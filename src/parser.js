export default (data) => {
  const result = [];
  const parser = new DOMParser();
  console.log(parser.parseFromString(data, 'text/html'));
  const RSSdocument = parser.parseFromString(data, 'text/html');
  const RSSFeedTitle = RSSdocument.querySelector('title');
  const RSSFeedDescription = RSSdocument.querySelector('description');
  const RSSItemsEls = RSSdocument.querySelectorAll('item');
  const info = {
    feedTitle: RSSFeedTitle.textContent,
    feedDescription: RSSFeedDescription.textContent,
  };
  result.push(info);
  RSSItemsEls.forEach((item) => {
    const title = item.querySelector('title');
    const link = item.querySelector('link');
    const description = item.querySelector('description')
    const article = {
      title: title.textContent,
      link: link.textContent,
      description: description.textContent,
    };
    result.push(article);
  })
  return result;
}