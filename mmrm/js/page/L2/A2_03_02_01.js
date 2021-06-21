export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         isLoading: false,
         user: {
            mobile: '',
            verify_code: '',
         },
      }),
      methods: {
         againHandler() {
            
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
         }
      }
   });
}