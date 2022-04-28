export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: {
         user: { name: '', einvoice: '', cardNo: '', level: '' },
         tipInfo: { status: false, message: '' },
         isLoading: false,
         pageUrl
      },
      computed: {
         hasCardNo() {
            return this.user.cardNo !== '';
         }
      },
      methods: {
         profileApi() {
            return mmrmAxios({
               url: apiUrl.memberProfile,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         memberCardApi() {
            return mmrmAxios({
               url: apiUrl.memberCard,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data;
            })
         },
         memberSummaryApi() {
            return mmrmAxios({
               url: apiUrl.memberSummary,
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
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         createQrcode(payload) {
            let schema = {
               "source": {
                  "system": "MMRM",
                  "app": "FMS",
                  "type": "member"
               },
               "card_info": payload.cardSource,
               "invoice_info": [
                  {
                     "key": "einvoice_carrier_no",
                     "value": payload.einvoice_carrier_no
                  }
               ]
            };
            new QRCode(document.querySelector('#qrcode'), {
               width: 180,
               height: 180,
               colorDark : '#000000',
               colorLight : '#ffffff',
               text: JSON.stringify(schema),
               correctLevel : QRCode.CorrectLevel.H
            });
         },
         openBarcodeModal() {
            this.$refs.barcodeModal.open();
         },
         checkRemove() {
            this.$refs.barcodeModal.close();
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
            if (this.tipInfo.status) this.user.einvoice = '';
            $('#removeOkModal').modal('show');
            this.isLoading = false;
         }
      },
      async mounted() {
         this.isLoading = true;
         let profile = await this.profileApi();
         let memberCard = await this.memberCardApi();
         let summary = await this.memberSummaryApi();
         let cardSource = memberCard.results.member_card.code_info.card_info;
         this.user.name = profile.results.member_profile.name;
         this.user.einvoice = profile.results.member_profile.einvoice_carrier_no || '';
         this.user.cardNo = cardSource[0].value;
         this.user.level = summary.results.level_summary.current_level.title;
         this.createQrcode({
            einvoice_carrier_no: this.user.einvoice,
            cardSource,
         });
         if (this.getQuery('openModal') === 'true') this.openBarcodeModal();
         this.isLoading = false;
      }
   })
}