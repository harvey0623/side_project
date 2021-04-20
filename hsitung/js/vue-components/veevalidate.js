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
   message: '密碼長度或格式不符: 6 - 12碼英數字',
   validate(value) {
      // let rule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/
      let rule = /^.{6,12}$/g;
      return rule.test(value);
   }
});

VeeValidate.extend('confirmPw', {
   params: ['target'],
   message: '密碼與確認密碼不符',
   validate(value, { target }) {
      return value === target;
   }
});

VeeValidate.extend('phone', {
   message: '手機格式不正確',
   validate(value) {
      return /^09\d{8}$/.test(value);
   }
});

VeeValidate.extend('birthday', {
   message: '出生日期範圍異常，請重新輸入',
   validate(value) {
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
      let birthday = new Date(value).getTime();
      let minDate = new Date(1902, 0, 1);
      return birthday >= minDate && birthday < today;
   }
});