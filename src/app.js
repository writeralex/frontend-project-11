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
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
  .then(response => {
    const parserResult = parser(response.data.contents);
    state.feeds.push(parserResult);
    const autoDownload = () => {
      render(state, i18nInstance);
      setTimeout(() => {
        autoDownload();
      }, 5000)
    }
    autoDownload();
    render(state, i18nInstance);
  })
  .catch(error => {
    state.URLstate = error.message;
  })
}

const app = () => {
  const state = {
    state: 'filling',
    errors: {},
    validationState: false,
    URLstate: '',
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
  }).then(function() {
    
    
    
    const watchedState = onChange(state, (path, value) => {
      switch (path) {
        case 'fields.link':
          const errors = state.validate(state.fields);
          state.errors = errors;
          state.validationState = isEmpty(errors);      
          state.links.push(value);
          break;
          default:
          break;
      }
    });
    
  const inputForm = document.querySelector('.inputForm');
  const buttonRSS = document.querySelector('.btn-rss');
  const result = document.querySelector('.result');

  inputForm.addEventListener('input', (e) => {
    const schema = yup.object().shape({
      link: yup.string().required('url is a required field').url().notOneOf(state.links, `${i18nInstance.t('RSSrepeat')}`,),
    });
    state.validate = (fields) => {
      try {
        schema.validateSync(fields, { abortEarly: false });
        return {};
      } catch (e) {
        return keyBy(e.inner, 'path');
      }
    };
    watchedState.fields.link = e.target.value;
    state.state = 'sending';
  })
  buttonRSS.addEventListener('click', () => {
    if (state.URLstate === 'Network Error') {
      result.classList.add('text-danger');
      result.textContent = i18nInstance.t('networkError');
      return;
    }
    if (state.validationState) {
      const autoDownload = () => {
        downloadRSS(state.fields.link, state, i18nInstance);
        setTimeout(() => {
          autoDownload();
        }, 5000)
      }
      autoDownload();
      inputForm.value = '';
      state.fields.link = '';
      state.state = 'sent';
      result.classList.remove('text-danger');
      result.classList.add('text-success');
      result.textContent = i18nInstance.t('RSSokay');
      return;
    }
    if (inputForm.value === '') {
      result.classList.add('text-danger');
      result.textContent = i18nInstance.t('RSSempty');
      return;
    }
    result.classList.remove('text-success');
    result.classList.add('text-danger');
    result.textContent = i18nInstance.t('RSSnokay');
  })
  });
}
export default app;