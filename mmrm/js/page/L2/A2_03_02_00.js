export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         visible: false,
         tipMsg: '',
         isLoading: false,
         user: {
            mobile: '',
            password: ''
         },
      }),
      methods: {
         seeHandler() {
            this.visible = !this.visible;
            this.setInputType({ status: this.visible, el: this.$refs.pwInput });
         },
         setInputType({ status, el }) {
            el.type = status ? 'text' : 'password';
         },
         updateMemberMobile() {
            return mmrmAxios({
               url: apiUrl.updateMemberMobile,
               method: 'post',
               data: {
                  mobile: this.$wm_aes(this.user.mobile),
                  password: this.$wm_aes(this.user.password)
               }
            }).then(res => res.data).catch(err => err.response.data);
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let updateResult = await this.updateMemberMobile();
            if (updateResult.rcrm.RC === 'C01') {
               sessionStorage.setItem('user_new_mobile', JSON.stringify({ value: this.user.mobile }));
               location.href = pageUrl.verify;
            } else {
               this.tipMsg = updateResult.rcrm.RM;
               $('#failModal').modal('show');
               this.isLoading = false;
            }
         }
      },
      mounted() {
         this.setInputType({ status: this.visible, el: this.$refs.pwInput });
      }
   });
}