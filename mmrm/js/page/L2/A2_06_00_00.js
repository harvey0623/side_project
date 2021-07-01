export default function ({ apiUrl, pageUrl }) {
   let clipboard = null;
   console.log('ok');
   new Vue({
      el: '#app',
      data: () => ({
         isCopy: false,
         user: {
            code: ''
         },
      }),
      methods: {
         initClipboard() {
            clipboard = new ClipboardJS('#visibleBox', {
               text: () => this.user.code
            });
            clipboard.on('success', (e) => {
               this.isCopy = true;
               e.clearSelection();
               setTimeout(() => {
                  this.isCopy = false;
               }, 2000);
            });
         },
         async shareHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            let text = `Hi ! 好朋友 \n下載王品瘋美食APP\n[wwww.wowfoods.cc/mgm]\n輸入我的好友推薦碼\n[ ${this.user.code} ]，跟我一起享受美食吧!`;
            let url = `line://msg/text/${encodeURIComponent(text)}`;
            location.href = url;
         }
      },
      mounted() {
         this.initClipboard();
      }
   });
}