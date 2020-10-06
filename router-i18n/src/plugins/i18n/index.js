import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from './config.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
   locale: DEFAULT_LANGUAGE,
   fallbackLocale: FALLBACK_LANGUAGE,
   messages: {
      [DEFAULT_LANGUAGE]: require('@/plugins/i18n/locales/'+ DEFAULT_LANGUAGE + '.json')
   }
});

export default i18n;