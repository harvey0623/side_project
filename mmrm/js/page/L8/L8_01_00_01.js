export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         isLoading: false,
         pageData: null,
      }),
      computed: {
         pageTitle() {
            if (this.pageData === null) return '';
            return this.pageData.title;	
         },
         pageContent() {
            if (this.pageData === null) return '';
            return this.pageData.content;
         }
      },
      methods: {
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return parseInt(paramsValue);
         },
         getFaqPage(pageId) { //取得問與答頁面資料
            return mmrmAxios({
               url: apiUrl.pageContent,
               method: 'post',
               data: {
                  page_id: pageId
               }
            }).then(res => {
               return res.data.results.page;
            }).catch(err => null)
         }
      },
      async mounted() {
         this.isLoading = true;
         let pageId = this.getQuery('page_id');
         this.pageData = await this.getFaqPage(pageId);
         this.isLoading = false;
      }
   });
}