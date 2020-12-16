export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         pointId: '',
         pointData: null,
         isLoading: false,
         apiUrl
      }),
      computed: {
         metaList() {
            if (this.pointData === null) return [];
            return this.pointData.meta;
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         async getPointData() { //取得點數資料
            this.isLoading = true;
            return await axios({
               url: this.apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: [this.pointId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.point_information[0];
            }).catch(err => {
               return null;
            }).finally(() => {
               this.isLoading = false;
            });
         }
      },
      async mounted() {
         this.pointId = parseInt(this.getQuery('point_id'));
         this.pointData = await this.getPointData().then(res => res);
      }
   });
}