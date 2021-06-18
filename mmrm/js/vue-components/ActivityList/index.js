Vue.component('activity-list', {
   props: {
      detail: {
         type: Object,
         required: true
      },
      changelayout: {
         type: Boolean,
         required: true
      },
      brandlist: {
         type: Array,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      },
      systemtime: {
         type: String,
         required: true
      },
      projecttime: {
         type: Number,
         required: true
      },
      activitytype: {
         type: String,
         default: 'coupon'
      },
   },
   data: () => ({
      isFinish: false,
      timeText: '',
      usageStatus: {
         opening: '已開啟',
         unopened: window.getSystemLang('couponactivitylist_unopened'),
         closed: window.getSystemLang('couponactivitylist_closed')
      },
      redeemStatus: {
         free: window.getSystemLang('couponactivitylist_free'),
         redeem_code: window.getSystemLang('couponactivitylist_redeemcode'),
         point: '點數兌換',
      },
      exchangeTime: window.getSystemLang('couponactivitylist_redeemdurationkey'),
      countdownText: window.getSystemLang('couponactivitylist_countdownText'),
      pointUnit: window.getSystemLang('point_unit')
   }),
   computed: {
      pageLink() {
         let activityType = this.activitytype;
         let key = activityType === 'coupon' ? 'coupon_activity_id' : 'point_activity_id';
         let searchParams = activityType === 'coupon' ? 'coupon_activity_id' : 'point_activity_id';
         return `${this.pageurl}?${searchParams}=${this.detail[key]}`;
      },
      activityBg() {
         let imgUrl = this.detail.feature_image.url;
         if (!imgUrl) return {};
         else return { backgroundImage: `url(${imgUrl})` }; 
      },
      duration() {
         let { start_datetime, end_datetime } = this.detail;
         let startTime = start_datetime.split(' ')[0];
         let endTime = end_datetime.split(' ')[0];
         return `${this.exchangeTime}: ${startTime} ~ ${endTime}`;
      },
      isOpen() {
         return this.detail.status === 'opening';
      },
      isCountDown() { //是否要倒數
         let systemTimeStamp = new Date(this.systemtime).getTime();
         let endTimeStamp = new Date(this.detail.end_datetime).getTime();
         let diff = endTimeStamp - systemTimeStamp;
         if (diff <= 0) return false;
         let isLess = diff < this.projecttime;
         return this.isOpen && isLess;
      },
      statusText() {
         return this.usageStatus[this.detail.status];
      },
      brandData() {
         return this.brandlist.find(item => item.brand_id === this.detail.brand_id);
      },
      brandTitle() {
         if (this.brandData === undefined) return '';
         return this.brandData.title;
      },
      brandImgUrl() {
         if (this.brandData === undefined) return '';
         let imgUrl = this.brandData.feature_image_small.url;
         if (imgUrl !== null) return { backgroundImage: `url(${imgUrl})` };
         else return {};
      },
      pointIntro() { //組合點數介紹的字串
         let redeemType = this.detail.redeem_type;
         if (redeemType !== 'point') return this.redeemStatus[redeemType];
         let normalArr = this.getPointInfoText('point_condition');
         let externalArr = this.getPointInfoText('external_point_condition');
         return normalArr.concat(externalArr).join(' / ');
      }
   },
   methods: {
      startCountDown() {
         let el = this.$refs.time;
         let finalDate = new Date(this.detail.end_datetime);
         $(el).countdown(finalDate).on('update.countdown', (evt) => {
            let dayText = evt.strftime('%-D');
            let hourText = evt.strftime('%H');
            let minText = evt.strftime('%M');
            this.timeText = vsprintf(this.countdownText, [dayText, hourText, minText]);
         }).on('finish.countdown', () => {
            this.isFinish = true;
         });
      },
      wantExchange() {
         let key = this.activitytype === 'coupon' ? 'coupon_activity_id' : 'point_activity_id';
         this.$emit('exchange', {
            id: this.detail[key],
            type: this.detail.redeem_type,
            status: this.detail.status
         });
      },
      getPointInfoText(key) { //取得點數資訊字串
         if (this.detail[key] === undefined) return [];
         return this.detail[key].reduce((prev, current) => {
            let obj = this.detail.pointInfo.find(item => {
               return item.point_id === current.point_id && item.category === key;
            });
            prev.push(`${obj.title}${current.amount}${this.pointUnit}`);
            return prev;
         }, []);
      }
   },
   mounted() {
      if (this.isCountDown) this.startCountDown();
   },
   watch: {
      async isCountDown(val) {
         if (val) {
            await this.$nextTick();
            this.startCountDown();
         } else {
            this.isFinish = true;
         }
      }
   },
   template: `
      <li :class="{ hide: isFinish }">
         <a class="topBlock" :href="pageLink" :class="{other: changelayout}">
            <div class="bgBlock" :style="activityBg">
               <div class="statusCover" v-if="!isOpen">
                  <span>{{ statusText }}</span>
               </div>
               <div class="countdownBlock" v-if="isCountDown">
                  <div class="clockBg"></div>
                  <p class="time" ref="time">{{ timeText }}</p>  
               </div>   
            </div>
            <div class="desc">
               <div class="intro">
                  <div class="brandBg" :style="brandImgUrl"></div>
                  <span class="brandTitle">{{ brandTitle }}</span>
               </div>
               <div class="activityTitle">{{ detail.title }}</div>
               <div class="duration">{{ duration }}</div>
            </div>
         </a>
         <div class="bottomBlock" @click="wantExchange">
            <p class="variationMainPoint">{{ pointIntro }}</p>
         </div>
      </li>`
});