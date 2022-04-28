export default function ({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         user: { einvoice: '', my_coupon_id: '' }, //6.S0-0S
         noteContent: '',
         tipInfo: { status: false, message: '' },
         isLoading: false,
         backSiteKey: null,
         pageUrl,
      }),
      computed: {
         modalTitle() {
            return this.tipInfo.status ? '設定成功' : '設定未完成';
         },
         modalContent() {
            return this.tipInfo.status ? '於指訂餐廳付款消費之電子發票可存入財政部手機條碼中。' : '您輸入的手機條碼有誤，請再次確認。';
         },
         backSiteUrl() {
            if (this.backSiteKey === null) return this.pageUrl.invoice_binded;
            let backUrl = `${this.pageUrl[this.backSiteKey]}?openModal=true`;
            if (this.backSiteKey === 'couponCard') backUrl = `${backUrl}&my_coupon_id=${this.user.my_coupon_id}`;
            return backUrl;
         }
      },
      methods: {
         copywritingApi(payload) {
            return mmrmAxios({
               url: apiUrl.brefConfig,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            })
         },
         einvoiceApi(payload) {
            return mmrmAxios({
               url: apiUrl.registerInvoice,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         updateProfileApi(payload) {
            return mmrmAxios({
               url: apiUrl.updateMemberProfile,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data
            })
         },
         getQuery(key) {
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         async getCopywrite() {
            let response = await this.copywritingApi({ keys: ['nobind_einvoice_carrier_note'] });
            this.noteContent = response.results.config_info[0].value.replace(/\\n/g, "\n");
         },
         redirectHandler() {
            window.open('https://www.einvoice.nat.gov.tw/APCONSUMER/BTC501W/')
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let response = await this.einvoiceApi({
               api_name: '/einvoice/verify_mobile_barcode',
               payload: window.$wm_aes(JSON.stringify({ barCode: this.user.einvoice }))
            });
            this.tipInfo.status = response.results.send_payload.mobile_barcode.isExist === 'Y';
            if (this.tipInfo.status) {
               let updateResponse = await this.updateProfileApi({
                  member_profile: { einvoice_carrier_no: this.user.einvoice }
               });
               this.tipInfo.status = updateResponse.rcrm.RC === 'C01';
            }
            $('#invoiceModal').modal('show');
            this.isLoading = false;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.backSiteKey = this.getQuery('backSite');
         this.user.my_coupon_id = this.getQuery('my_coupon_id') || '';
         await this.getCopywrite();
         this.isLoading = false;
      }
   });
}