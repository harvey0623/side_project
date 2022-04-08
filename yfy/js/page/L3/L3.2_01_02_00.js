export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         metaList: [],
         obtainPoint: [],
         pointList: [],
         isLoading: false,
         apiUrl,
         pageUrl
      }),
      computed: {
         hasObtainPoint() {
            return this.obtainPoint.length > 0;
         },
         pointThanOne() {
            return this.obtainPoint.length > 1;
         },
         pointIds() {
            return this.obtainPoint.map(({ point_id }) => point_id);
         },
         pointMenu() { //點數清單
            return this.pointList.map(({ point_id, title }) => {
               return {
                  point_id,
                  href: `${this.pageUrl.pointInfo}?point_id=${point_id}`,
                  text: title
               }
            });
         }
      },
      methods: {
         getLS(key) { //取得localStorage資料
            let data = localStorage.getItem(key);
            return data !== null ? JSON.parse(data) : null;
         },
         removeLS(key) {
            localStorage.removeItem(key);
         },
         assignData() { //資料寫入
            let exchangeResult = this.getLS('exchangePoint');
            let obtainResult = this.getLS('obtainPoint');
            this.metaList = exchangeResult !== null ? exchangeResult.meta : [];
            this.obtainPoint = obtainResult !== null ? obtainResult : [];
         },
         async getPointInfo() { //取得點數資訊
            this.isLoading = true;
            return axios({
               url: this.apiUrl.pointInfo,
               method: 'post',
               data: {
                  "point_id": this.pointIds,
                  "full_info": false
               }
            }).then(res => {
               return res.data.results.point_information;
            }).catch(err => {
               return []
            }).finally(() => {
               this.isLoading = false;
            });
         },
         async getAboutPoint() {
            if (!this.hasObtainPoint) return;
            this.pointList = await this.getPointInfo().then(res => res);
         },
         showPointMenu() {
            if (this.pointThanOne) {
               $('#optionModal').modal('show');
            } else {
               location.href = `${this.pageUrl.pointInfo}?point_id=${this.pointIds[0]}`;
            }
         }
      },
      mounted() {
         // [{"point_id":2,"amount":"6"},{"point_id":5,"amount":"5"}]
         this.assignData();
         this.getAboutPoint();
      },
   });
}