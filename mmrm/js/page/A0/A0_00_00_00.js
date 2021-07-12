export default function({ apiUrl, pageUrl }) {
   const serviceObj = {
      call(val) {
         let aTag = this.createATag();
         aTag.href = `tel:${val}`;
         aTag.click();
         this.removeATag(aTag);
      },
      email(val, subject) {
         let aTag = this.createATag();
         let mailUrl = `${val}?subject=${encodeURIComponent(subject)}`;
         aTag.href = `mailto:${mailUrl}`;
         aTag.click();
         this.removeATag(aTag);
      },
      redirect(url) {
         location.href = url;
      },
      createATag() {
         let a = document.createElement('a');
         document.body.appendChild(a);
         return a;
      },
      removeATag(el) {
         document.body.removeChild(el);
      }
   };

   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         currentPointInfo: { point_id: 0, amount: '0', },
         totalTicket: 0,
         isLoading: false,
         serviceList: [
            { title: '撥打客服', type: 'call' },
            { title: '意見回饋', type: 'email' },
            { title: '相關條款', type: 'term' },
            { title: 'Q&A', type: 'qa' }
         ],
         vendor: {
            mobile: '',
            email: '',
            subject: ''
         },
         pageUrl
      }),
      computed: {
         pointPageUrl() {
            return `${this.pageUrl.point}?point_id=${this.currentPointInfo.point_id}`;
         }
      },
      methods: {
         talkHandler() {
            $('#optionModal').modal('show');
         },
         getSystemConfig() { //取得系統參數
            return mmrmAxios({
               url: apiUrl.config,
               method: 'post',
               data: {
                  keys: [ 
                     "customer_service_phone",
                     "feedback_email_address",
                     "feedback_email_subject"
                  ]
               }
            }).then(res => res.data.results.config_info).catch(err => []);
         },
         getMemberSummary() {
            return mmrmAxios({
               url: apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => res.data.results)
         },
         serviceHandler(serviceType) {
            let params = '';
            let subject = '';
            if (serviceType === 'call') params = this.vendor.mobile;
            if (serviceType === 'email') {
               params = this.vendor.email;
               subject = this.vendor.subject;
            }
            if (serviceType === 'term') params = this.pageUrl.term;
            if (serviceType === 'qa') params = this.pageUrl.qa;
            serviceType = serviceType === 'term' || serviceType === 'qa' ? 'redirect': serviceType;
            serviceObj[serviceType](params, subject);
         },
         setConfig(configArr) {
            if (configArr.length === 0) return;
            alert('update');
            this.vendor.mobile = configArr[0].value.replace(/-/g, '')
            this.vendor.email = configArr[1].value;
            this.vendor.subject = configArr[2].value;
         },
         setSummaryInfo(summary) {
            this.totalTicket = summary.coupon_summary.valid_coupon_amount;
            let { point_id, amount } = summary.point_summary.current_point[0];
            this.currentPointInfo.point_id = point_id;
            this.currentPointInfo.amount = amount;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.getLocalProfile();
         let [ configArr, memberSummary ] = await Promise.all([
            this.getSystemConfig(), this.getMemberSummary()
         ]);
         this.setConfig(configArr);
         this.setSummaryInfo(memberSummary);
         this.isLoading = false;
      }
   });
}