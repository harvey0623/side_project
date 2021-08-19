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
         copyHandler() {
            
         },
         checkHandler() {
            this.isEmpty = this.user.code === '';
         },
         shareHandler() {
            this.checkHandler();
            if (this.isEmpty) return;
            let text = `Hi 好朋友\n下載王品瘋美食APP\nhttps://wowfoods.cc/mgm\n首次註冊輸入我的好友推薦碼﹝${this.profile.referral_code}﹞，一起享受美食吧!`;
            let url = `line://msg/text/${encodeURIComponent(text)}`;
            location.href = url;
         }
      },
      mounted() {
         this.initClipboard();
      }
   });
}