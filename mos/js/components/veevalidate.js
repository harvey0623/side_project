Vue.component('validation-observer', VeeValidate.ValidationObserver);
Vue.component('validation-provider', VeeValidate.ValidationProvider);
VeeValidate.setInteractionMode('eager');

VeeValidate.extend('required', {
   message: '必填',
   validate(value) {
      return {
         required: true,
         valid: ['', null, undefined].indexOf(value) === -1
      };
   },
   computesRequired: true
});

VeeValidate.extend('email', {
   message: '電子信箱格式有誤',
   validate(value) {
      let rule = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return rule.test(value);
   }
});

VeeValidate.extend('confirmEmail', {
   params: ['target'],
   message: '確認信箱有誤',
   validate(value, { target }) {
      return value === target;
   }
});

VeeValidate.extend('password', {
   message: '密碼格式有誤',
   validate(value) {
      let length = value.length;
      return length >= 6 && length <= 20;
      // let rule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
      // return rule.test(value);
   }
});

VeeValidate.extend('confirmPw', {
   params: ['target'],
   message: '確認密碼有誤',
   validate(value, { target }) {
      return value === target;
   }
});



