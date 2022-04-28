export default function({ appName, apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: {
         isLoading: false,
         couponData: { name: '', duration: '', bannerImg: '', brandImg: '', my_coupon_id: '' },
         user: { einvoice: '', couponNo: '' },
         currentMode: 2,
         showModeText: false,
         normalCardList: [],
         enlargeCardList: [],
         isEnlarge: false,
         tipInfo: { status: false, message: '' },
         pageUrl
      },
      computed: {
         bannerBackground() {
            if (!this.couponData.bannerImg) return {};
            else return { backgroundImage: `url(${this.couponData.bannerImg})` };
         },
         brandLogoBackground() {
            if (!this.couponData.brandImg) return {};
            else return { backgroundImage: `url(${this.couponData.brandImg})` };
         },
         modeText() {
            return this.currentMode === 1 ? '切換條碼資訊' : '切換二維條碼';
         },
         hasCard() {
            return this.normalCardList.length > 0;
         }
      },
      methods: {
         couponDetailApi(payload) {
            return mmrmAxios({
               url: apiUrl.couponDetail,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         couponInfoApi(payload) {
            return mmrmAxios({
               url: apiUrl.couponInfo,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         brandInfoApi(payload) {
            return mmrmAxios({
               url: apiUrl.brandInfo,
               method: 'post',
               data: payload
            }).then(res => {
               return res.data;
            }).catch(err => {
               return err.response.data;
            })
         },
         profileApi() {
            return mmrmAxios({
               url: apiUrl.memberProfile,
               method: 'post',
               data: {}
            }).then(res => {
               return res.data;
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
                  "app": 'FMS',
                  "type": "coupon"
               },
               "card_info": payload.cardSource,
               "invoice_info": [
                  {
                     "key": "einvoice_carrier_no",
                     "value": payload.einvoice
                  }
               ],
               "coupon_no": payload.couponNo
            };
            new QRCode(document.querySelector('#qrcode'), {
               width: 230,
               height: 230,
               colorDark : '#000000',
               colorLight : '#ffffff',
               text: JSON.stringify(schema),
               correctLevel : QRCode.CorrectLevel.H
            });
         },
         switchMode() {
            this.currentMode = this.currentMode === 1 ? 2 : 1;
         },
         addCardId(lists, prefix) {
            let cloneList = _.cloneDeep(lists);
            cloneList.forEach((item, index) => item.id = `${prefix}-barcode${index}`);
            return cloneList;
         },
         createCardList(arr) {
            let per = 2;
            let total = Math.ceil(arr.length / 2);
            let lists = [];
            for (let i = 1; i <= total; i++) {
               let startIndex = (i - 1 ) * per;
               let endIndex = (i - 1 ) * per + per;
               let sliceData = arr.slice(startIndex, endIndex);
               lists.push({ data: sliceData });
            }
            return lists;
         },
         enlargeHandler(payload) {
            return;
            this.$refs.enlargeSwiper.moveSlide(payload.index + 1);
            this.isEnlarge = true;
         },
         minifyHandler() {
            let index = this.$refs.enlargeSwiper.getSwiperRealIndex() + 1;
            this.$refs.barcodeSwiper.moveSlide(index);
            this.isEnlarge = false;
         },
         async setCouponData() {
            let my_coupon_id = parseInt(this.getQuery('my_coupon_id'));
            let couponDetailResponse = await this.couponDetailApi({ my_coupon_id });
            let { coupon_id, coupon_no, duration } = couponDetailResponse.results.my_coupon_detail;
            let couponInfoResponse = await this.couponInfoApi({ 
               coupon_ids: [coupon_id],
               full_info: true
            });
            let { brand_ids, title, feature_image, third_party_promotion_code } = couponInfoResponse.results.coupon_information[0];
            let brandInfo = await this.brandInfoApi({ brand_ids: [brand_ids[0]], full_info: false });
            this.user.couponNo = coupon_no;
            this.user.my_coupon_id = my_coupon_id;
            this.couponData.name = title;
            this.couponData.duration = `使用期限: ${duration}`;
            this.couponData.bannerImg = feature_image.url;
            this.couponData.brandImg = brandInfo.results.brand_information[0].feature_image_big.url;
            firebaseGa.logEvent(`voucherbasket_wcoupon_usable_use_mobilebarcode_${third_party_promotion_code}`, {}, true);
         },
         async setMemberData() {
            let profile = await this.profileApi();
            let cardSource = await this.memberCardApi().then(res => res.results.member_card.code_info.card_info);
            this.user.einvoice = profile.results.member_profile.einvoice_carrier_no || '';
            this.createQrcode({
               cardSource,
               einvoice: this.user.einvoice,
               couponNo: this.user.couponNo,
            });
            let arr = [];
            arr = arr.concat(cardSource);
            if (this.user.couponNo) arr.push({ key: '票券號碼', value: this.user.couponNo });
            if (this.user.einvoice) arr.push({ key: '手機條碼載具', value: this.user.einvoice });
            let normalSource = this.addCardId(arr, 'normal');
            let enlargeSource = this.addCardId(arr, 'enlarge');
            this.normalCardList = this.createCardList(normalSource);
            this.enlargeCardList = this.createCardList(enlargeSource);
            await this.$nextTick();
            this.currentMode = 1;
            this.showModeText = true;
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
         },
      },
      async mounted() {
         this.isLoading = true;
         await this.setCouponData();
         await this.setMemberData();
         if (this.getQuery('openModal') === 'true') this.openBarcodeModal();
         this.isLoading = false;
      }
   })
}