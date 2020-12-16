export default class Ajax {
   constructor(props) {
      this.axios = axios.create({});
      this.memberProfile = props.memberProfile;
      this.memberSummary = props.memberSummary;
      this.memberCard = props.memberCard;
      this.levelInfo = props.levelInfo;
      this.couponDetail = props.couponDetail;
      this.couponInfo = props.couponInfo;
      this.brandInfo = props.brandInfo;
   }
   async getMemberProfile() { //取得會員簡介
      return await this.axios({
         url: this.memberProfile,
         method: 'post',
         data: {}
      }).then(res => {
         return res.data.results;
      }).catch(err => null);
   }
   async getCard() { //取得會員卡片資料
      return await this.axios({
         url: this.memberCard,
         method: 'post',
         data: {}
      }).then(res => {
         return res.data.results;
      }).catch(err => null);
   }
   async getMemberSummary() { //取得會員資料
      return await this.axios({
         url: this.memberSummary,
         method: 'post',
         data: {}
      }).then(res => {
         return res.data.results;
      }).catch(err => null);
   }
   async getLevelInfo(levelId) { //取得等級資訊
      return await this.axios({
         url: this.levelInfo,
         method: 'post',
         data: {
            level_id: [levelId]
         }
      }).then(res => {
         return res.data.results;
      }).catch(err => null);
   }
   async getCouponDetail(myCouponId) { //取得票券詳情
      return await axios({
         url: this.couponDetail,
         method: 'post',
         data: {
            my_coupon_id: myCouponId
         }
      }).then(res => {
         return res.data.results.my_coupon_detail;
      }).catch(err => null);
   }
   async getCouponInfo(couponId) { //取得票券資料
      return await axios({
         url: this.couponInfo,
         method: 'post',
         data: {
            coupon_ids: [couponId],
            full_info: true
         }
      }).then(res => {
         return res.data.results.coupon_information;
      }).catch(err => null);
   }
   async getBrandInfo(brandId) { //取得品牌資訊
      return await axios({
         url: this.brandInfo,
         method: 'post',
         data: {
            brand_ids: [brandId],
            full_info: false
         }
      }).then(res => {
         return res.data.results.brand_information;
      }).catch(err => null);
   }
}