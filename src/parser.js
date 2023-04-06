export default (data) => {
  const result = [];
  const parser = new DOMParser();
  const RSSdocument = parser.parseFromString(data, 'text/xml');
  console.log(RSSdocument)
  const RSSFeedTitle = RSSdocument.querySelector('title');
  const RSSFeedDescription = RSSdocument.querySelector('description');
  const RSSItemsEls = RSSdocument.querySelectorAll('item');
  const info = {
    feedTitle: RSSFeedTitle.textContent,
    feedDescription: RSSFeedDescription.textContent,
  };
  result.push(info);
  const articles = [];
  RSSItemsEls.forEach((item) => {
    let n = 0;
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description')
    const article = {
      title: title.textContent,
      link: link.textContent,
      description: description.textContent,
      status: 'unread',
      num: n + 1,
    };
    articles.push(article);
  })
  result.push(articles);
  return result;
}