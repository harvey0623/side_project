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
         tempStatus: false,
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
         updatePassword() { //修改密碼
            return mmrmAxios({
               url: apiUrl.updatePassword,
               method: 'post',
               data: {
                  old_password: this.$wm_aes(this.user.old_password),
                  new_password: this.$wm_aes(this.user.new_password),
               }
            }).then(res => res.data).catch(err => err.response.data);
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let fixedResult = await this.updatePassword()
            this.tipMsg = fixedResult.rcrm.RM;
            this.tempStatus = fixedResult.rcrm.RC === 'C01';
            $('#failModal').modal('show');
            this.isLoading = false;
         },
         confirmHandler() {
            if (this.tempStatus) location.href = pageUrl.maintain; 
            else $('#failModal').modal('hide');
         },
      },
      mounted() {
         this.setInputType({ status: this.visible1, el: this.$refs.pwInput });
         this.setInputType({ status: this.visible2, el: this.$refs.confirmInput });
         this.setInputType({ status: this.visible3, el: this.$refs.oldInput });
      }
   });
}