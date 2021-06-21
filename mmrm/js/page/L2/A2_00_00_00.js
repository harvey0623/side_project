export default function ({ apiUrl, pageUrl }) {
   let mobileSelect = null;
   let fileReader = new FileReader();
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         isLoading: false,
         fileInput: null,
         pageUrl,
         user: { password: '' },
         errorMsg: '',
      }),
      methods: {
         verifyModalEvent() {
            $('#verifyModal').on('shown.bs.modal', () => $('.verifyInput').focus());
            $('#verifyModal').on('hidden.bs.modal', () => {
               this.user.password = '';
               this.$refs.form.reset();
            });
         },
         memberLogout() { //會員登出
            return mmrmAxios({
               url: apiUrl.logout,
               method: 'post',
               data: {}
            }).then(res => res.data);
         },
         updateMemberPhoto(base64) { //更新會員照片
            return mmrmAxios({
               url: apiUrl.updateMemberPhoto,
               method: 'post',
               data: { photo: base64 }
            }).then(res => {
               return res.data.results.photo.url;
            }).catch(() => '')
         },
         verifyMemberPw() { //驗證會員密碼
            return mmrmAxios({
               url: apiUrl.verifyPw,
               method: 'post',
               data: { password: this.$wm_aes(this.user.password) }
            }).then(res => {
               return res.data;
            }).catch(err => console.log(err))
         },
         initMobileSelector() {
            mobileSelect = new MobileSelect({
               trigger: '#iosPicker',
               title: '大頭照',
               ensureBtnText: '確定',
               cancelBtnText: '取消',
               ensureBtnColor: '#288efb',
               titleColor: '#292929',
               textColor: '#292929',
               triggerDisplayData: false,
               wheels: [{
                  data: [
                     { id: 'camera', value: '現在就來自拍吧' },
                     { id: 'album', value: '從我的相簿中找找' },
                  ]
               }],
               callback: (index, data) => {
                  let info = data[0];
                  this.fileInput.removeAttribute('capture');
                  if (info.id === 'camera') this.fileInput.setAttribute('capture', 'environment');
                  this.fileInput.click();
                  this.toggleMenu(false);
               }
            });
         },
         toggleMenu(isOpen) {
            mobileSelect[isOpen ? 'show' : 'hide']();
         },
         checkFileFormat(file) {
            let rule = /^image\/(jpg|jpeg|png)/;
            return ((file.size / 1024 / 1024) <= 5) && rule.test(file.type);
         },
         resetInput() {
            this.fileInput.type = 'text';
            this.fileInput.type = 'file';
         },
         selectPhoto(evt) {
            let file = evt.target.files[0];
            if (file === undefined) return;
            let isValid = this.checkFileFormat(file);
            if (!isValid) {
               this.errorMsg = '需上傳5MB以內的圖片檔';
               $('#failModal').modal('show');
               this.resetInput();
               return 
            }
            this.isLoading = true;
            fileReader.readAsDataURL(file);
            this.resetInput();
         },
         async getBase64(evt) {
            let base64 = evt.target.result;
            this.profile.avatar = await this.updateMemberPhoto(base64);
            this.isLoading = false;
         },
         async logoutHandler() {
            this.isLoading = true;
            $('#logoutModal').modal('hide');
            let logoutResult = await this.memberLogout();
            if (logoutResult.rcrm.RC === 'C01') {
               location.href = this.apiUrl.logoutOk;
               return;
            }
            this.isLoading = false;
         },
         async confirmVerify() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let verifyResult = await this.verifyMemberPw();
            this.errorMsg = verifyResult.rcrm.RM;
            if (verifyResult.rcrm.RC === 'C01') {
               location.href = this.pageUrl.maintain;
               return;
            }
            $('#failModal').modal('show');
            this.isLoading = false;
         }
      },
      async mounted() {
         this.verifyModalEvent();
         this.getLocalProfile();
         this.fileInput = this.$refs.file;
         this.initMobileSelector();
         fileReader.addEventListener('load', this.getBase64);
      }
   });
}