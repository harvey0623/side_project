Vue.component('validation-observer', VeeValidate.ValidationObserver);
Vue.component('validation-provider', VeeValidate.ValidationProvider);
VeeValidate.setInteractionMode('eager');

VeeValidate.extend('required', {
   message: window.getSystemLang('g_required'),
   validate(value) {
      return {
         required: true,
         valid: ['', null, undefined].indexOf(value) === -1
      };
   },
   computesRequired: true
});

VeeValidate.extend('email', {
   message: window.getSystemLang('g_emailformaterror'),
   validate(value) {
      let rule = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return rule.test(value);
   }
});

VeeValidate.extend('confirmEmail', {
   params: ['target'],
   message: window.getSystemLang('memberformkit_e_inconsistemail'),
   validate(value, { target }) {
      return value === target;
   }
});

VeeValidate.extend('password', {
   message: window.getSystemLang('g_e_formincorrectpwdformat'),
   validate(value) {
      let rule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/
      return rule.test(value);
   }
});

VeeValidate.extend('confirmPw', {
   params: ['target'],
   message: window.getSystemLang('memberformkit_e_inconsistpwd'),
   validate(value, { target }) {
      return value === target;
   }
});

VeeValidate.extend('phone', {
   message: window.getSystemLang('g_e_formincorrectmobileformat'),
   validate(value) {
      return /^09\d{8}$/.test(value);
   }
});

VeeValidate.extend('term', {
   message: '請同意條款',
   validate(value) {
      return value;
   }
});

VeeValidate.extend('birthday', {
   message: window.getSystemLang('g_birthday'),
   validate(value) {
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      let birthday = new Date(value).getTime();
      return birthday < today;
   }
});