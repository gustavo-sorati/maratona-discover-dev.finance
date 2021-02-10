const StorageX = {
  get() {
    return localStorage.getItem('dev.finance:theme') || '';
  },
  set(value) {
    localStorage.setItem('dev.finance:theme', value);
  },
};

const ThemeSwitch = {
  page: document.querySelector('html'),
  widget: document.querySelector('.theme-switch-label'),
  input: document.querySelector('#theme-switch'),
  circle: document.querySelector('.theme-switch-circle'),
  isThemeActive: localStorage.getItem('dev.finance:theme') || '',

  init() {
    if (ThemeSwitch.isThemeActive !== '') {
      ThemeSwitch.page.classList.toggle('night-mode');
    }
  },
  update() {
    ThemeSwitch.page.classList.toggle('night-mode');

    ThemeSwitch.page.classList.contains('night-mode')
      ? (ThemeSwitch.input.value = 'night-mode')
      : (ThemeSwitch.input.value = '');

    let x = ThemeSwitch.input.value;
    ThemeSwitch.save(x);
  },
  save(value) {
    localStorage.setItem('dev.finance:theme', value);
  },
};

const ThemeCheck = {};

ThemeSwitch.init();
ThemeSwitch.widget.addEventListener('click', ThemeSwitch.update);
