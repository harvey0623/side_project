export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         user: { einvoice: '' },
         noteContent: '',
         tipInfo: { status: false, message: '' },
         isLoading: false,
         pageUrl,
      }),
      computed: {

      },
      methods: {
         profileApi() {
            return mmrmAxios({
               url: apiUrl.memberProfile,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data;
            })
         },
         updateProfileApi(payload) {
            return mmrmAxios({
               url: apiUrl.updateMemberProfile,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            })
         },
         copywritingApi(payload) {
            return mmrmAxios({
               url: apiUrl.brefConfig,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data
            })
         },
         async getCopywrite() {
            let response = await this.copywritingApi({ keys: ['hasbind_einvoice_carrier_note'] });
            this.noteContent = response.results.config_info[0].value.replace(/\\n/g, "\n");
         },
         createBarcode() {
            JsBarcode('#einvoice', this.user.einvoice, {
               width: 1.5,
               height: 50,
               fontSize: 16,
               textMargin: 5
            });
         },
         setInvoice(payload) {
            let { einvoice_carrier_no } = payload.results.member_profile;
            if (_.isEmpty(einvoice_carrier_no)) return;
            this.user.einvoice = einvoice_carrier_no;
            this.createBarcode();
         },
         checkRemove() {
            $('#checkModal').modal('show');
         },
         async removeHandler() {
            this.isLoading = true;
            $('#checkModal').modal('hide');
            let response = await this.updateProfileApi({
               member_profile : { einvoice_carrier_no: null }
            });
            this.tipInfo.status = response.rcrm.RC === 'C01';
            this.tipInfo.message = response.rcrm.RM;
            $('#okModal').modal('show');
            this.isLoading = false;
         }
      },
      async mounted() {
         this.isLoading = true;
         let [profile] = await Promise.all([ this.profileApi(), this.getCopywrite() ]);
         this.setInvoice(profile);
         this.isLoading = false;
      }
   });
}
