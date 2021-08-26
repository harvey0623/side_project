export default function({ apiUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: {
         isLoading: false,
         brandList: [],
         invoiceList: [],
         paymentList: [],
         goodsList: [],
         memberCard: '',
         primaryInfo: {
            brandLogo: '',
            brandName: '',
            storeName: '',
            sale_invamt: '0',
            date: '',
            time: '',
            isReturn: false,
         },
      },
      computed: {
         brandBg() {
            let brandLogo = this.primaryInfo.brandLogo;
            if (!brandLogo) return {};
            else return { backgroundImage: `url(${brandLogo})` };
         },
         createdTime() {
            let { date, time } = this.primaryInfo;
            let formatDate = date !== '' ? dayjs(date).format('YYYY/MM/DD') : '';
            let formatTime = time !== '' ? dayjs(time).format('HH:mm:ss') : '';
            let fullText = `${formatDate} ${formatTime}`;
            return fullText.trim();
         }
      },
      methods: {
         getQuery(key) { //取得網址參數
            let params = (new URL(document.location)).searchParams;
            return params.get(key);
         },
         getMemberCard() {
            return mmrmAxios({
               url: apiUrl.memberCard,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data.results.member_card.code_info.card_info[0].value;
            }).catch(err => '')
         },
         searchBrand() {
            return mmrmAxios({
               url: apiUrl.searchBrand,
               method: 'post',
               data: {}
            }).then(res => res.data.results.brand_ids).catch(err => []);
         },
         getBrandInfo(brandIds) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: {
                  "brand_ids": brandIds,
                  "full_info": false
               }
            }).then(res => res.data.results.brand_information).catch(err => []);
         },
         getTradeDetail() {
            return mmrmAxios({
               url: apiUrl.tradeDetail,
               method: 'post',
               data: {
                  url: '/cct/cctws/wowapp/saledetail/receive',
                  payload: {
                     "request_body_type": "x-www-form-urlencoded",
                     "header": null,
                     "merchant": "wowprime_cct",
                     "http_method": "POST",
                     "body": {
                        "sale_id": this.getQuery('sale_id'),
                        "jrsyring": "666666666666666666666666666666666666",
                        "memb_fmscard": this.memberCard,
                        "version": "00001"
                     },
                  }
               }
            }).then(res => {
               return res.data.results.data.payload;
            }).catch(err => {
               return { isdone: "F", message: "error", data: {} };
            });
         },
         processTrade(tradeInfo) {
            let { saleh, listp, listi, listd } = tradeInfo;
            let targetBrand = this.brandList.find(brand => brand.brand_code === saleh.brnd_id);
            this.primaryInfo.brandLogo = targetBrand ? targetBrand.feature_image_small.url : '';
            this.primaryInfo.brandName = saleh.brnd_name;
            this.primaryInfo.storeName = saleh.stor_name;
            this.primaryInfo.sale_invamt = saleh.sale_invamt;
            this.primaryInfo.date = saleh.d_sale;
            this.primaryInfo.time = saleh.t_sale;
            this.primaryInfo.isReturn = saleh.sale_id_p !== '';
            this.invoiceList = listi;
            this.paymentList = listp;
            this.goodsList = listd;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.getLocalProfile();
         this.memberCard = await this.getMemberCard();
         let brandIds = await this.searchBrand();
         this.brandList = await this.getBrandInfo(brandIds);
         let tradeData = await this.getTradeDetail();
         if (tradeData.isdone === 'T') this.processTrade(tradeData.data);
         this.isLoading = false;
      }
   })
}