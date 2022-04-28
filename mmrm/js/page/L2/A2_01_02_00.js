export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         pointData: null,
         isLoading: false,
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
         getPointData(pointId) { //取得點數資料
            return mmrmAxios({
               url: apiUrl.pointInfo,
               method: 'post',
               data: {
                  point_id: [pointId],
                  full_info: true
               }
            }).then(res => {
               return res.data.results.point_information[0];
            }).catch(err => null)
         }
      },
      async mounted() {
         this.isLoading = true;
         let pointId = parseInt(this.getQuery('point_id'));
         this.pointData = await this.getPointData(pointId);
         this.isLoading = false;
      }
   });
}