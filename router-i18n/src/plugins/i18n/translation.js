import i18n from './index.js';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './config.js';

const translate = {
   get defaultLanguage() {
      return DEFAULT_LANGUAGE;
   },
   get supportedLanguages() {
      return SUPPORTED_LANGUAGES;
   },
   get currentLanguage() {
      return i18n.locale;
   },
   set currentLanguage(lang) {
      i18n.locale = lang;
   },
   resetLanguage(lang) {
      translate.currentLanguage = lang;
      document.querySelector('html').setAttribute('lang', lang);
   },
   loadLanguageFile(lang) {
      return import(`@/plugins/i18n/locales/${lang}.json`);
   },
   isLangSupported(lang) {
      return translate.supportedLanguages.includes(lang);
   },
   getUserLang () {
      return navigator.language;
   },
   setLS({ key, value }) {
      localStorage.setItem(key, value);
   },
   async changeLanguage(lang) {
      lang = translate.isLangSupported(lang) ? lang : DEFAULT_LANGUAGE;
      translate.setLS({ key: 'lang', value: lang });
      if (translate.currentLanguage === lang) return Promise.resolve(lang);
      let message = await translate.loadLanguageFile(lang).then(res => res);
      i18n.setLocaleMessage(lang, message.default);
      translate.resetLanguage(lang);
      return lang;
   },
   async routeMiddleware(to, from, next) {
      const lang = to.params.locale;
      if (!translate.isLangSupported(lang)) return next(`/${translate.getUserLang()}`);
      return await translate.changeLanguage(lang).then(() => next());
   },
   i18nRoute(to) {
      return {
         ...to,
         params: { locale: translate.currentLanguage, ...to.params }
      };
   }
};

export default translate;