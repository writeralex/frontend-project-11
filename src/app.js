// @ts-check

import onChange from 'on-change';
import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import resources from './language/language.js';
import i18n from 'i18next';
import axios from 'axios';
import parser from './parser.js'
//https://news.un.org/feed/subscribe/ru/news/topic/humanitarian-aid/feed/rss.xml
const downloadRSS = (link, state, i18nInstance) => {
  axios.get(link)
  .then(response => {
    const parserResult = parser(response.data);
    state.feeds.push(parserResult);
    render(state, i18nInstance);
  })
  .catch(error => {
    console.log(error);
  })
}

const schema = yup.object().shape({
  link: yup.string().required('url is a required field').url(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

const app = () => {
  const state = {
    state: 'filling',
    errors: {},
    validationState: false,
    fields: {
      link: '',
    },
    lang: 'ru',
    feeds: [],
    links: [],
  }

  const inputForm = document.querySelector('.inputForm');
  const buttonRSS = document.querySelector('.btn-rss');
  const buttonLang = document.querySelector('.btn-lan');
  const result = document.querySelector('.result');

  const watchedState = onChange(state, (path, value, oldValue) => {
    switch (path) {
      case 'fields.link':
        const errors = validate(state.fields);
        state.errors = errors;
        state.validationState = isEmpty(errors);
        break;
      case 'lang':
        if (value === 'ru') {
          russian();
        }
        if (value === 'en') {
          english();
        }
        break;
        default:
        break;
    }
  });

  inputForm.addEventListener('input', (e) => {
    watchedState.fields.link = e.target.value;
    state.state = 'sending';
  })
  buttonRSS.addEventListener('click', () => {
    state.links.forEach((link) => {
      if (link === state.fields.link) {
        state.validationState = false;
        result.textContent = i18nInstance.t('RSSrepeat');
        return;
      }
    })
    if (state.validationState) {
      state.links.push(state.fields.link);
      downloadRSS(state.fields.link, state, i18nInstance);
      state.state = 'sent';
      result.textContent = i18nInstance.t('RSSokay');
      return;
    }
    result.textContent = i18nInstance.t('RSSnokay');
  })
  buttonLang.addEventListener('click', () => {
    if (state.lang === 'ru') {
      watchedState.lang = 'en';
    }
    if (state.lang === 'en') {
      watchedState.lang = 'ru';
    }
  })
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(function(t) {
    buttonLang.textContent = i18nInstance.t('buttonLan');
  });

  const english = () => {
    i18nInstance.changeLanguage('en', (err, t) => {
      if (err) return console.log('something went wrong loading', err);
      t('en');
    });
  }
  const russian = () => {
    i18nInstance.changeLanguage('ru', (err, t) => {
      if (err) return console.log('something went wrong loading', err);
      t('ru');
    });
  }
  
}
const posts = document.querySelector('.posts') //то, куда загружают посты
const feeds = document.querySelector('.feeds'); //то, куда загружаются фиды
const render = (state, i18nInstance) => {
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
      aEl.classList.add('fw-bold');
      buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-small');
      aEl.textContent = article.title;
      buttonEl.textContent = i18nInstance.t('button');
      liEl.append(aEl);
      liEl.append(buttonEl);
      ulEl.append(liEl);
    })
  })
  feedsList.append(feedsUlEl);
  postsList.append(ulEl);
}

export default app;