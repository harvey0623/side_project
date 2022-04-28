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
         orderList: [],
         myOrderData: { title: '', time: '' },
         brandList: [],
         serviceList: [
            { title: '撥打客服', type: 'call' },
            { title: '意見回饋', type: 'email' },
            { title: '相關條款', type: 'term' },
            { title: 'Q&A', type: 'qa' }
         ],
         vendor: { mobile: '', email: '', subject: '' },
         pageUrl
      }),
      computed: {
         pointPageUrl() {
            return `${this.pageUrl.point}?point_id=${this.currentPointInfo.point_id}`;
         },
         hasOrderInfo() {
            return this.orderList.length > 0;
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
         searchBrand() {
            return mmrmAxios({
               url: apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => res.data.results.brand_ids);
         },
         getBrandInfo(brandIds) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: {
                  "brand_ids": brandIds,
                  "full_info": true
               }
            }).then(res => res.data.results.brand_information);
         },
         getMemberSummary() {
            return mmrmAxios({
               url: apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => res.data.results)
         },
         getOrderHistory() { //取得訂位資料
            let payload = JSON.stringify({
               "stor_id":"",
               "brnd_id":"",
               "d_rvnm_f": dayjs().format('YYYYMMDD'),
               "d_rvnm_t": dayjs().add(60, 'day').format('YYYYMMDD'),
               "is_cancel":"F",
               "is_confirm":"",
               "rvnm_id":""
            });
            return mmrmAxios({
               url: apiUrl.orderHistory,
               method: 'post',
               data: {
                  api_name: '/bookingTable/search',
                  payload: window.$wm_aes(payload)
               }
            }).then(res => {
               return res.data.results.send_payload.data.rsvnnumber;
            }).catch(err => [])
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
            this.vendor.mobile = configArr[0].value.replace(/-/g, '');
            this.vendor.email = configArr[1].value;
            this.vendor.subject = configArr[2].value;
         },
         setSummaryInfo(summary) {
            this.totalTicket = summary.coupon_summary.valid_coupon_amount;
            let { point_id, amount } = summary.point_summary.current_point[0];
            this.currentPointInfo.point_id = point_id;
            this.currentPointInfo.amount = amount;
         },
         processOrderData() {
            let lastIndex = this.orderList.length - 1;
            let { brnd_id, d_rvnm, t_rvnm, stor_name } = this.orderList[lastIndex];
            let targetBrand = this.brandList.find(brand => brand.brand_code === brnd_id);
            let brandTitle = targetBrand !== undefined ? targetBrand.title : '';
            let time = dayjs(`${d_rvnm} ${t_rvnm}`).format('YYYY/MM/DD HH:mm');
            return {
               title: `${brandTitle} ${stor_name}`,
               time
            };
         },
         aTagClick(needTime, evt) {
            let linkObj = evt.currentTarget;
            firebaseGa.logEvent(linkObj.dataset.event, {}, needTime);
            location.href = linkObj.href;
         }
      },
      async mounted() {
         this.isLoading = true;
         let [ memberSummary, orderList, brandIds ] = await Promise.all([ 
            this.getMemberSummary() , this.getOrderHistory(), this.searchBrand()
         ]);
         this.brandList = await this.getBrandInfo(brandIds);
         this.setSummaryInfo(memberSummary);
         this.orderList = orderList;
         if (this.hasOrderInfo) this.myOrderData = this.processOrderData();
         this.isLoading = false;
      }
   });
}