import { createI18n } from 'vue-i18n';
import { Lang } from '@types';
import en from './en.json';
import ru from './ru.json';

const fallbackLang = Lang.EN;
const userLang =
  localStorage.getItem('lang') || navigator.language || navigator.languages?.[0] || fallbackLang;
const userLocale = ['ru', 'ru-RU'].includes(userLang) ? Lang.RU : fallbackLang;

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: userLocale,
  fallbackLocale: fallbackLang,
  messages: { [Lang.EN]: en, [Lang.RU]: ru },
});
