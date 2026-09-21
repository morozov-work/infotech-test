import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Theme, Lang } from '@types';
import i18n from '@lang';

export const useUiStore = defineStore('ui', () => {
  const isTheme = (value: unknown): value is Theme => {
    return Object.values(Theme).includes(value as Theme);
  };

  const getTheme = () => {
    const theme = localStorage.getItem('theme');
    return isTheme(theme) ? theme : Theme.AUTO;
  };

  const setTheme = (theme: Theme) => localStorage.setItem('theme', theme);

  const theme = ref<Theme>(getTheme());

  const isLang = (value: unknown): value is Lang => {
    return Object.values(Lang).includes(value as Lang);
  };

  const getLang = () => {
    const lang = localStorage.getItem('lang');
    return isLang(lang) ? lang : (i18n.global.locale.value as Lang);
  };

  const setLang = (lang: Lang) => localStorage.setItem('lang', lang);

  const lang = ref<Lang>(getLang());

  const loading = ref<boolean>(false);

  return { theme, getTheme, setTheme, lang, getLang, setLang, loading };
});
