export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         nextLevel: null,
         renewLevel: null,
         isLoading: false,
         apiUrl,
      }),
      methods: {
         async getMemberSummary() {
            this.isLoading = true;
            return await axios({
               url: this.apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.level_summary;
            }).catch(err => {
               return null
            }).finally(() => this.isLoading = false);
         }
      },
      async mounted() {
         let levelData = await this.getMemberSummary().then(res => res);
         let { next_level, renew_level } = levelData;
         if (next_level !== undefined && next_level.progress.length !== 0) {
            this.nextLevel = { 
               title: window.getSystemLang('levelinformation_upgrade'),
               source: next_level,
            };
         }
         if (renew_level !== undefined && renew_level.progress.length !== 0) {
            this.renewLevel = {
               title: window.getSystemLang('levelinformation_renew'),
               source: renew_level
            }
         }
      }
   });
}