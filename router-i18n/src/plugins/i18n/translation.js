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
      this.currentLanguage = lang;
      document.querySelector('html').setAttribute('lang', lang);
   },
   loadLanguageFile(lang) {
      return import(`@/plugins/i18n/locales/${lang}.json`);
   },
   isLangSupported(lang) {
      return this.supportedLanguages.includes(lang);
   },
   getUserLang () {
      return navigator.language;
   },
   setLS({ key, value }) {
      localStorage.setItem(key, value);
   },
   async changeLanguage(lang) {
      if (this.currentLanguage === lang) {
         this.resetLanguage(lang);
         return Promise.resolve(lang);
      }
      this.setLS({ key: 'lang', value: lang });
      let message = await this.loadLanguageFile(lang).then(res => res);
      i18n.setLocaleMessage(lang, message.default);
      this.resetLanguage(lang);
      return lang;
   },
   async routeMiddleware(to, from, next) {
      let lang = to.params.locale;
      if (!this.isLangSupported(lang)) return next(`/${this.getUserLang()}`);
      return await this.changeLanguage(lang).then(() => next());
   },
   i18nRoute(to) {
      return {
         ...to,
         params: { locale: this.currentLanguage, ...to.params }
      };
   }
};

export default translate;