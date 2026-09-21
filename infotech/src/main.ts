import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import i18n from './lang';
import { initializeMockDatabase } from './db';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});
const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(vuetify);

initializeMockDatabase()
  .then(() => {
    app.use(router);
    app.mount('#app');
  })
  .catch((error: unknown) => {
    console.error('Не удалось запустить моковое API:', error);
    const root = document.querySelector('#app');
    if (root) root.textContent = 'Не удалось загрузить данные. Обновите страницу.';
  });
