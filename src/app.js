// @ts-check

import onChange from 'on-change';
import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import resources from './language/language.js';
import i18n from 'i18next';
import axios from 'axios';
import parser from './parser.js';
import render from './view.js';

//https://news.un.org/feed/subscribe/ru/news/topic/culture-and-education/feed/rss.xml
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

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(function(t) {
    buttonLang.textContent = i18nInstance.t('buttonLan');
  });

  const schema = yup.object().shape({
    link: yup.string().required('url is a required field').url().notOneOf(state.links, `${i18nInstance.t('RSSrepeat')}`,),
  });
  
  const validate = (fields) => {
    try {
      schema.validateSync(fields, { abortEarly: false });
      return {};
    } catch (e) {
      return keyBy(e.inner, 'path');
    }
  };

  const inputForm = document.querySelector('.inputForm');
  const buttonRSS = document.querySelector('.btn-rss');
  const buttonLang = document.querySelector('.btn-lan');
  const result = document.querySelector('.result');

  const watchedState = onChange(state, (path, value, oldValue) => {
    switch (path) {
      case 'fields.link':
        state.links.push(value);
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
    if (state.validationState) {
      downloadRSS(state.fields.link, state, i18nInstance);
      //state.links.push(state.fields.link);
      inputForm.value = '';
      state.fields.link = '';
      state.state = 'sent';
      result.classList.remove('text-danger');
      result.classList.add('text-success');
      result.textContent = i18nInstance.t('RSSokay');
      return;
    }
    result.classList.remove('text-success');
    result.classList.add('text-danger');
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


export default app;