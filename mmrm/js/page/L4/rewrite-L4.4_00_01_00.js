export default function({ openLink, apiUrl, pageUrl }) {
   let statusArr = ['public', 'member', 'notify'];
   let messageData = statusArr.reduce((prev, current) => {
      prev[current] = {
         isFirst: true,
         loading: false,
         currentPage: 0,
         scrollPos: 0,
         data: [],
         name: current
      };
      return prev;
   }, {});
   new Vue({
      el: '#app',
      mixins: [openLink],
      data: () => ({
         statusArr,
         messageData,
         currentType: 'public',
         tabList: [
            { id: 'public', title: window.getSystemLang('messagelist_public'), isOpen: true, },
            { id: 'member', title: window.getSystemLang('messagelist_member'), isOpen: true },
            { id: 'notify', title: window.getSystemLang('messagelist_notification'), isOpen: true, }
         ],
         isLoading: false,
         searchLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         hasEmptyPublic() {
            let obj = this.messageData.public;
            return !obj.loading && obj.currentPage === null && obj.data.length === 0;
         },
         hasEmptyMember() {
            let obj = this.messageData.member;
            return !obj.loading && obj.currentPage === null && obj.data.length === 0;
         },
         hasEmptyNotify() {
            let obj = this.messageData.notify;
            return !obj.loading && obj.currentPage === null && obj.data.length === 0;
         },
         noNextPublic() {
            let obj = this.messageData.public;
            return !obj.loading && obj.currentPage === null && obj.data.length > 0;
         },
         noNextMember() {
            let obj = this.messageData.member;
            return !obj.loading && obj.currentPage === null && obj.data.length > 0;
         },
         noNextNotify() {
            let obj = this.messageData.notify;
            return !obj.loading && obj.currentPage === null && obj.data.length > 0;
         },
      },
      methods: {
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            let value = params.get(key);
            return value;
         },
         getPublicMsg() { //取得公眾訊息
            this.isLoading = true;
            return axios({
               url: this.apiUrl.publicMessage,
               method: 'post',
               data: { offset: this.messageData.public.currentPage }
            }).then(res => {
               return {
                  next: res.data.next,
                  data: res.data.results.message,
               };
            }).catch(err => {
               return { next: null, data: [] };
            }).finally(() => this.isLoading = false)
         },
         getMemberMsg() { //取得會員訊息
            this.isLoading = true;
            return axios({
               url: this.apiUrl.memberMessage,
               method: 'post',
               data: { offset: this.messageData.member.currentPage }
            }).then(res => {
               return {
                  next: res.data.next,
                  data: res.data.results.message,
               };
            }).catch(err => {
               return { next: null, data: [] };
            }).finally(() => this.isLoading = false)
         },
         getNotifyMsg() { //取得通知訊息
            this.isLoading = true;
            return axios({
               url: this.apiUrl.notifyMessage,
               method: 'post',
               data: { offset: this.messageData.notify.currentPage }
            }).then(res => {
               return {
                  next: res.data.next,
                  data: res.data.results.notification,
               };
            }).catch(err => {
               return { next: null, data: [] };
            }).finally(() => this.isLoading = false)
         },
         async changeTab(id) { //改變tab id
            if (this.isLoading) return;
            if (this.currentType === id) return;
            this.messageData[this.currentType].scrollPos = window.pageYOffset;
            this.currentType = id;
            if (this.messageData[this.currentType].isFirst) await this.getPagination();
            await this.$nextTick();
            window.scrollTo(0, this.messageData[this.currentType].scrollPos);
         },
         addUnuqueId(data) { //增加messageId
            return data.reduce((prev, current, index) => {
               prev.push({
                  messageId: Date.now() + index,
                  ...current
               });
               return prev;
            }, []);
         },
         async getPagination() {
            this.isLoading = true;
            let mappingFunc = { 
               public: 'getPublicMsg', 
               member: 'getMemberMsg', 
               notify: 'getNotifyMsg' 
            };
            let currentType = this.currentType;
            let targetMsg = this.messageData[currentType];
            targetMsg.loading = true;
            let msgResult = await this[mappingFunc[currentType]]().then(res => res);
            targetMsg.currentPage = msgResult.next;
            targetMsg.data = targetMsg.data.concat(this.addUnuqueId(msgResult.data));
            targetMsg.isFirst = false;
            targetMsg.loading = false;
            this.isLoading = false;
         },
         async scrollHandler() {
            if (this.isLoading) return;
            let documentH = document.documentElement.scrollHeight;
            let windowH = window.innerHeight;
            let distance = documentH - windowH;
            let scrollPos = window.pageYOffset;
            let hasNextPage = this.messageData[this.currentType].currentPage !== null;
            if (scrollPos >= distance * 0.95 && hasNextPage) {
               await this.getPagination();
            }
         }
      },
      created() {
         let msgType = this.getQuery('messageType');
         let isInclude = this.statusArr.includes(msgType);
         this.currentType = isInclude ? msgType : 'public';
      },
      async mounted() {
         window.addEventListener('scroll', this.scrollHandler);
         await this.getPagination();
      }
   });
}