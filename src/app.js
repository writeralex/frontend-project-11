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
const downloadRSS = (link, state) => {
  axios.get(link)
  .then(response => {
    const parserResult = parser(response.data);
    state.feeds.push(parserResult);
    render(state);
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
    if (state.validationState === true) {
      downloadRSS(state.fields.link, state);
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
const body = document.querySelector('.body') //то, куда загружают фиды
const render = (state,) => {
  if (state.state === 'filling') {
    body.textContent = '';
    return
  }
  document.createElement('div');
  alert(state.feeds[0][0].feedTitle) //Новости ООН... заголовок RSS
  //...создаем структуру ссылок
  //наполняем структуру статьями
  //добавляем ее в боди
}

export default app;