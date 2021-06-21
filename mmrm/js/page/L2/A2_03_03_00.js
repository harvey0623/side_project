export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         visible1: false,
         visible2: false,
         visible3: false,
         isLoading: false,
         tipMsg: '',
         user: {
            old_password: '',
            new_password: '',
            confrimPw: ''
         },
      }),
      methods: {
         see1Handler() {
            this.visible1 = !this.visible1;
            this.setInputType({ status: this.visible1, el: this.$refs.pwInput });
         },
         see2Handler() {
            this.visible2 = !this.visible2;
            this.setInputType({ status: this.visible2, el: this.$refs.confirmInput });
         },
         see3Handler() {
            this.visible3 = !this.visible3;
            this.setInputType({ status: this.visible3, el: this.$refs.oldInput });
         },
         setInputType({ status, el }) {
            el.type = status ? 'text' : 'password';
         },
         confirmHandler() {
            
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
         }
      },
      mounted() {
         this.setInputType({ status: this.visible1, el: this.$refs.pwInput });
         this.setInputType({ status: this.visible2, el: this.$refs.confirmInput });
         this.setInputType({ status: this.visible3, el: this.$refs.oldInput });
      }
   });
}