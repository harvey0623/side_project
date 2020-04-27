function getQrcode(option) {
   let { apiUrl, modalTitle, descContent, account = null, postData } = option;
   new Vue({
      el: '#app',
      data: () => ({
         code: '',
         isTimeUp: true,
         modalTitle,
         descContent,
         account,
         qrcodeMaker: null,
         errorMsg: 'error'
      }),
      methods: {
         getEndTime(minute) {  //取得結束時間
            minute = minute || 1;
            return new Date().getTime() + minute * 60 * 1000;
         },
         startCountdown(minute) {  //開始倒數
            let endTime = this.getEndTime(minute);
            $('#countdown').countdown(endTime)
               .on('update.countdown', function (event) {
                  let remainTime = event.strftime('%M : %S');
                  $(this).text(remainTime);
               }).on('finish.countdown', () => {
                  this.isTimeUp = true;
               });
         },
         generateQrcode(text) {  //產生qrcode
            let el = this.$refs.qrcode;
            this.qrcodeMaker = new QRCode(el, {
               text,
               width: 200,
               height: 200,
               colorDark : "#000000",
               colorLight : "#ffffff",
               correctLevel : QRCode.CorrectLevel.H
            });
         },
         successHandler(data) {  //回傳成功執行
            let QRCode = data.QRCode
            this.code = data.RND;
            this.startCountdown(data.ExpireMin);
            this.isTimeUp = false;
            if (this.qrcodeMaker === null) {
               this.generateQrcode(QRCode);
            } else {
               this.qrcodeMaker.makeCode(QRCode);
            }
            $('#cardModal').modal('show');
         },
         errorHandler(data) {  //回傳錯誤處理
            this.errorMsg = data.ErrorMsg;
            $('#msgModal').modal('show');
         },
         reloadHandler() {  //重新reload畫面
            location.reload();
         },
         async getQrcode() {  //重新取得qrcode
            // setTimeout(() => {  //====測試用
            //    this.code = 'abc123';
            //    this.isTimeUp = false;
            //    this.startCountdown(0.1);
            //    if (this.qrcodeMaker === null) {
            //       this.generateQrcode('hello');
            //    } else {
            //       this.qrcodeMaker.makeCode('hi');
            //    }
            //    $('#cardModal').modal('show');
            // }, 10);

            //===正式串接用
            let result;
            try {
               result = await axios.post(apiUrl, postData).then(res => res.data);
            } catch(err) {
               result = err.response.data;
               this.errorHandler(result);
            }
            if (result.status) {
                this.successHandler(result);
             }
         }
      },
      mounted() {
         this.getQrcode();
      }
   });
}
