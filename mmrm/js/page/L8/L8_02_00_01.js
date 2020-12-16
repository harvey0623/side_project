export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         termList: [],
         isLoading: false,
         apiUrl
      }),
      computed: {
         hasTerm() {
            return this.termList.length !== 0;
         },
         targetTerm() {
            if (!this.hasTerm) return null;
            let termId = parseInt(this.getQuery('id'));
            let obj = this.termList.find(item => item.id === termId);
            if (obj !== undefined) return obj;
            else return null;
         },
         termTitle() {
            if (this.targetTerm === null) return '';
            else return this.targetTerm.title;
         },
         termContent() {
            if (this.targetTerm === null) return '';
            else return this.targetTerm.content;
         }
      },
      methods: {
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            let paramsValue = params.get(key);
            return paramsValue;
         },
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
         }
      },
      async mounted() {
         this.isLoading = true;
         this.termList = await this.getTerm().then(res => res);
         if (this.hasTerm) {
            document.querySelector('title').textContent = this.termTitle;
         }
         this.isLoading = false;
      }
   });
}