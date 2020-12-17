export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         termList: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         termLength() {
            return this.termList.length;
         }
      },
      methods: {
         async getTerm() { //取得條款資料
            return await axios({
               url: this.apiUrl.term,
               method: 'post',
               data: {
                  type: ['register']
               }
            }).then(res => {
               let termInfo = res.data.results.term_information;
               if (termInfo.length === 0) return [];
               else return termInfo[0].terms;
            }).catch(err => [])
         },
         autoNavigate() { //自動導頁面
            let termId = this.termList[0].id;
            let url = `${this.pageUrl.content}?id=${termId}`;
            this.isLoading = false;
            location.href = url;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.termList = await this.getTerm().then(res => res);
         if (this.termLength === 0 || this.termLength > 1) this.isLoading = false;
         else this.autoNavigate();
      }
   });
}