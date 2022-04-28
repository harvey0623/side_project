export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         termList: [],
         isLoading: false,
         pageUrl
      }),
      computed: {
         termLength() {
            return this.termList.length;
         }
      },
      methods: {
         getTerm() { //取得條款資料
            return mmrmAxios({
               url: apiUrl.term,
               method: 'post',
               data: {
                  type: ['register']
               }
            }).then(res => {
               let termInfo = res.data.results.term_information;
               if (termInfo.length === 0) return [];
               else return termInfo[0].terms;
            }).catch(err => []);
         },
         autoNavigate() { //自動導頁面
            let termId = this.termList[0].id;
            let url = `${pageUrl.content}?id=${termId}`;
            location.href = url;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.termList = await this.getTerm();
         if (this.termLength === 0 || this.termLength > 1) this.isLoading = false;
         else this.autoNavigate();
      }
   });
}