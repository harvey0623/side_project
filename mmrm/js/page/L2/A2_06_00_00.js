export default function ({ apiUrl, pageUrl }) {
   let clipboard = null;
   new Vue({
      el: '#app',
      data: () => ({
         isEmpty: false,
         isCopy: false,
         user: {
            code: ''
         }
      }),
      methods: {
         initClipboard() {
            clipboard = new ClipboardJS('#copyBox', {
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
         checkHandler() {
            this.isEmpty = this.user.code === '';
         },
         shareHandler() {
            this.checkHandler();
            if (this.isEmpty) return;
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

