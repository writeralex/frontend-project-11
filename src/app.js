// @ts-check

//import i18n from 'i18next';
import onChange from 'on-change';
import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import resources from './language/language.js';
import i18n from 'i18next';

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
        if (state.validationState === true) {
          result.textContent = value;
        }
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

export default app;