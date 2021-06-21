export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         visible: false,
         isLoading: false,
         user: {
            mobile: '',
            password: ''
         },
         pageUrl
      }),
      methods: {
         seeHandler() {
            this.visible = !this.visible;
            this.setInputType({ status: this.visible, el: this.$refs.pwInput });
         },
         setInputType({ status, el }) {
            el.type = status ? 'text' : 'password';
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            
         }
      },
      mounted() {
         this.setInputType({ status: this.visible, el: this.$refs.pwInput });
      }
   });
}