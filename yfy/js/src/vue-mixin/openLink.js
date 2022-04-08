window.openLink = {
   data() {
      return {
         modalTitle: {
            popup: '請選擇欲前往的連結', 
            hyperlink: '即將開起外部連結是否前往', 
            error: ''
         },
         tempHyperLink: '',
         optionList: [],
         user: { password: '' },
         checUserkPw: false
      }
   },
   methods: {
      bindModalEvent() {
         $('#checkPw').on('shown.bs.modal', function() {
            $(this).find('input').focus();
         });
         $('#checkPw').on('hidden.bs.modal', () => {
            this.$refs.form.reset();
            this.user.password = '';
         });
      },
      async verifyPassword() { //密碼檢查
         return axios({
            url: this.apiUrl.verifyPassword,
            method: 'post',
            data: { 
               password: this.$encryptAes(this.user.password)
            }
         }).then(res => {
            return { status: true, errMsg: '' };
         }).catch(err => {
            let errMsg = err.response.data.rcrm.RM;
            return { status: false, errMsg };
         });
      },
      showPopup(payload) { //顯示彈跳視窗
         //console.log(payload);
         let { title, links } = payload;
         if (links.length === 1) this.singleOption({ linkInfo: links[0] });
         if (links.length > 1) {
            // this.modalTitle.popup = title || '請選擇欲前往的連結';
            this.optionList = links;
            $('#optionModal').modal('show');
         }
      },
      singleOption({ linkInfo }) { //單一選項處理
         //console.log(linkInfo);
         let linkType = linkInfo.type;
         if (linkType === 'book') {
            location.href = `${this.pageUrl.book}?book_id=${linkInfo.book_id}`;
         } else if (linkType === 'app') {
            location.href = `${linkInfo.hyperlink_url}`;
         } else if (linkType === 'hyperlink') {
            if (!this.checUserkPw) return location.href = linkInfo.hyperlink_url;
            this.tempHyperLink = linkInfo.hyperlink_url;
            $('#hyperModal').modal('show');
         }
      },
      confirmHyper() { //確認外連超連結
         $('#hyperModal').modal('hide');
         $('#checkPw').modal('show');
      },
      async confirmPassword() { //密碼確認
         let isValid = await this.$refs.form.validate().then(res => res);
         if (!isValid) return;
         this.searchLoading = true;
         let { status, errMsg } = await this.verifyPassword().then(res => res);
         if (status) {
            location.href = this.tempHyperLink;
         } else {
            this.modalTitle.error = errMsg;
            $('#checkPw').modal('hide');
            $('#failModal').modal('show');
            this.searchLoading = false;
         }
      },
      optionClick(payload) {
         //console.log(payload);
         this.singleOption({ linkInfo: payload });
         $('#optionModal').modal('hide');
      }
   },
   mounted() {
      this.bindModalEvent();
   }
};