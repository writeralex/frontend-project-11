export default (state, i18nInstance) => {
  const posts = document.querySelector('.posts') //то, куда загружают посты
  const feeds = document.querySelector('.feeds'); //то, куда загружаются фиды
  if (state.state === 'filling') {
    posts.textContent = '';
    feeds.textContent = '';
    return
  }
    //фиды
  const feedsList = feeds.querySelector('.card');
  feedsList.textContent = '';
    //создание заголовка ленты
    const feedDivEl = document.createElement('div');
    feedDivEl.classList.add('card-body');
    const h2El = document.createElement('h2');
    h2El.classList.add('card-title', 'h4');
    h2El.textContent = i18nInstance.t('feeds');
    feedDivEl.append(h2El);
    feedsList.append(feedDivEl);
  
    const feedsUlEl = document.createElement('ul');
    feedsUlEl.classList.add('list-group', 'border-0', 'border-end-0');
    
    //посты
    const postsList = posts.querySelector('.card');
    postsList.textContent = '';
    //создание заголовка Посты
    const divEl = document.createElement('div');
    divEl.classList.add('card-body');
    const hEl = document.createElement('h2');
    hEl.classList.add('card-title', 'h4');
    hEl.textContent = i18nInstance.t('posts');
    divEl.append(hEl);
    postsList.append(divEl);
  
    //создание списка для добавления статей forEach
    const ulEl = document.createElement('ul');
    ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  
    const feedsCol = state.feeds;
    feedsCol.forEach((feed) => {
      //ЛЕНТЫ
      const feedInfo = feed[0];
      const feedTitle = feedInfo.feedTitle;
      const feedDescription = feedInfo.feedDescription;
      const feedLiEl = document.createElement('li');
      feedLiEl.classList.add('list-froup-item', 'border-0', 'border-end-0');
      const feedH3El = document.createElement('h3');
      feedH3El.classList.add('h6', 'm-0');
      feedH3El.textContent = feedTitle;
      feedLiEl.append(feedH3El);
      const feedPEl = document.createElement('p');
      feedPEl.classList.add('m-0', 'small', 'text-black-50');
      feedPEl.textContent = feedDescription;
      feedLiEl.append(feedPEl);
      feedsUlEl.append(feedLiEl);
  
      //СТАТЬИ
      const feedArticle = feed[1];
      feedArticle.forEach((article) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        const aEl = document.createElement('a');
        const buttonEl = document.createElement('button');
        //атрибуты
        const setAttribute = (el, attributes) => {
          Object.keys(attributes).forEach((attribute) => {
            el.setAttribute(attribute, attributes[attribute]);
          })
        }
        setAttribute(aEl, {'href': `${article.link}`, 'data-id': '2', 'target': '_blank', 'rel': 'noopenernoreferrer'});
        setAttribute(buttonEl, {'type': 'button', 'data-id': '2', 'data-bs-toggle': 'modal', 'data-bs-target': '#modal'});
        if (article.status === 'unread') {
          aEl.classList.add('fw-bold');
        }
        buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-small');
        aEl.textContent = article.title;
        buttonEl.textContent = i18nInstance.t('button');
        liEl.append(aEl);
        liEl.append(buttonEl);
        ulEl.append(liEl);
        buttonEl.addEventListener('click', () => {
          const modalTitle = document.querySelector('.modal-title');
          const modalDescr = document.querySelector('.modal-body');
          const modalFullArticle = document.querySelector('.full-article');
          modalTitle.textContent = article.title;
          modalDescr.textContent = article.description;
          modalFullArticle.setAttribute('href', `${article.link}`);
          article.status = 'read';
          aEl.classList.remove('fw-bold');
        })   
      })
    })
    feedsList.append(feedsUlEl);
    postsList.append(ulEl);
  }
