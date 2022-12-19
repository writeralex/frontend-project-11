// @ts-check
/* eslint no-param-reassign: ["error", { "props": false }] */

import i18n from 'i18next';
import onChange from 'on-change';
import ru from './locales/ru.js'
import en from './locales/en.js'

// BEGIN (write your solution here)
const render = (i18nInstance, state, watchedState) => {
  const container = document.querySelector('.container');
  container.innerHTML = '';
  const divEl = document.createElement('div');
  divEl.classList.add('btn-group');
  divEl.setAttribute('role', 'group');
  divEl.textContent = '';

  const button1El = document.createElement('button');
  button1El.setAttribute('type', 'button');
  button1El.classList.add('btn');
  button1El.classList.add('mb-3');
  button1El.classList.add('en');
  button1El.textContent = i18nInstance.t('langEn');

  const button2El = document.createElement('button');
  button2El.setAttribute('type', 'button');
  button2El.classList.add('btn');
  button2El.classList.add('mb-3');
  button2El.classList.add('ru');
  button2El.textContent = i18nInstance.t('langRu');

  const buttonClickEl = document.createElement('button');
  buttonClickEl.setAttribute('type', 'button');
  buttonClickEl.classList.add('btn');
  buttonClickEl.classList.add('btn-info');
  buttonClickEl.classList.add('mb-3');
  buttonClickEl.classList.add('align-self-center');
  buttonClickEl.textContent = i18nInstance.t('clicksCount', { count: state.value });

  const buttonResetEl = document.createElement('button');
  buttonResetEl.setAttribute('type', 'button');
  buttonResetEl.classList.add('btn');
  buttonResetEl.classList.add('btn-warning');
  buttonResetEl.textContent = i18nInstance.t('reset');

  if (state.lang === 'en') {
    button1El.classList.add('btn-primary');
    button2El.classList.add('btn-outline-primary');
  }
  if (state.lang === 'ru') {
    button2El.classList.add('btn-primary');
    button1El.classList.add('btn-outline-primary');
  }
  divEl.append(button1El);
  divEl.append(button2El);

  container.append(divEl);
  container.append(buttonClickEl);
  container.append(buttonResetEl);

  buttonClickEl.addEventListener('click', () => {
    watchedState.value += 1;
  })
  buttonResetEl.addEventListener('click', () => {
    watchedState.value = 0;
  })
  button1El.addEventListener('click', () => {
    //watchedState.value = 0;
    watchedState.lang = 'en';

  });
  button2El.addEventListener('click', () => {
    //watchedState.value = 0;
    watchedState.lang = 'ru';
  });
};

const runApp = async () => {
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'en',
    debug: true,
    resources: {
      ru,
      en,
    },
  });

  const state = {
    value: 0,
    lang: 'en'
  }
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
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'value':
        const buttonClickEl = document.querySelector('.btn-info')
        buttonClickEl.textContent = i18nInstance.t('clicksCount', { count: value });
        break;
      case 'lang':
        if (value === 'ru') {
          russian();
        }
        if (value === 'en') {
          english();
        }
        render(i18nInstance, state, watchedState);
        break;
      default:
        break;
    }
  });
  render(i18nInstance, state, watchedState)
};

export default runApp;
// END
