import QrcodeMaker from '../QrcodeMaker/index.js';
import BarCodeMaker from '../BarCodeMaker/index.js';
export default class CouponCard {
   constructor(props) {
      this.appName = props.appName;
      this.codeTextEl = document.querySelector(props.codeTextEl);
      this.source = props.source;
      this.vehicleCode = props.vehicleCode;
      this.qrInstance = null;
      this.swipers = [];
      this.slideGroup = [];
      this._type = 0;
      this.isFirst = true;
      this.isFirstLarge = true;
      this.swiperIndex = 0;
      this.barCodeText1 = window.getSystemLang('couponcode_b_1dbarcode');
      this.barCodeText2 = window.getSystemLang('couponcode_b_2dbarcode');
      this.bindEvent();
      this.init();
   }
   bindEvent() {
      this.codeTextEl.addEventListener('click', () => {
         this.setType = this.getType === 0 ? 1 : 0;
      });
   }
   init() {
      this.createSlideGroup();
      this.createQrcode();
      this.setType = 0;
   }
   createSlideGroup() { //分類輪播資料
      let count = 2;
      let total = Math.ceil(this.source.length / count);
      for (let i = 1; i <= total; i++) {
         let start = (i - 1) * count;
         let end = (i - 1) * count + count;
         let arr = this.source.slice(start, end);
         this.slideGroup.push({ data: arr });
      }
   }
   createQrcode() { //產生qrcode
      let sourceLength = this.source.length;
      let endIndex = this.vehicleCode !== undefined ? sourceLength - 1 : sourceLength;
      let memberCard = this.source.slice(1, endIndex);
      let couponValue = this.source[0].value;
      memberCard = memberCard.map(({ key, value }) => ({ key, value }));
      let schema = {
         "source": {
            "system": "MMRM",
            "app": this.appName,
            "type": "coupon"
         },
         "card_info": memberCard,
         "invoice_info": [
            {
               "key": "einvoice_carrier_no",
               "value": this.vehicleCode !== undefined ? this.vehicleCode : ''
            }
         ],
         "coupon_no": couponValue
      };
      this.qrInstance = new QrcodeMaker({
         rootEl: '#qrcode',
         text: JSON.stringify(schema)
      });
   }
   createSlideHTML({ swiperClass, idKey, parent }) { //產生slider結構
      let swiperContainer = document.createElement('div');
      swiperContainer.classList.add('swiper-container', swiperClass);
      swiperContainer.innerHTML = `
         <div class="swiper-wrapper"></div>
         <div class="swiper-pagination"></div>`;

      this.slideGroup.forEach(item => {
         let template = '';
         let swipeSlide = document.createElement('div');
         swipeSlide.classList.add('swiper-slide');
         swipeSlide.innerHTML = '<div class="rotateBox"></div>';
         item.data.forEach(obj => {
            template += `
               <div class="codeItem">
                  <p>${obj.key}</p>
                  <svg id="${obj[idKey]}"></svg>
               </div>`;
         });
         swipeSlide.querySelector('.rotateBox').innerHTML = template;
         swiperContainer.querySelector('.swiper-wrapper').appendChild(swipeSlide);
      });
      $(parent).append(swiperContainer);
   }
   createBarcode({ idKey, option }) {  //產生二為條碼
      this.source.forEach(item => {
         new BarCodeMaker({
            rootEl: `#${item[idKey]}`,
            text: item.value,
            option
         });
      });
   }
   initSwiper({ rootEl }) { //初始輪播
      let isThanOne = this.slideGroup.length > 1;
      let option = {
         loop: isThanOne,
         allowTouchMove: isThanOne, 
         pagination: {
            el: '.swiper-pagination',
            bulletActiveClass: 'swiper-pagination-bullet-bg'
         },
      };
      if (!isThanOne) delete option.pagination;
      let instance = new Swiper(`.${rootEl}`, { ...option });
      this.swipers.push({ id: rootEl, instance });
   }
   moveSwiperSlide({ from, to }) {  //滑動指定的swiper slide
      let fromObj = this.swipers.find(item => item.id === from);
      let toObj = this.swipers.find(item => item.id === to);
      let index = fromObj.instance.activeIndex;
      toObj.instance.slideTo(index, 0, false);
   }
   initNormal() { //執行一般狀態
      this.isFirst = false;
      this.createSlideHTML({ 
         swiperClass: 'basic',
         idKey: 'id',
         parent: '#barCodeBox'
      });
      this.createBarcode({ idKey: 'id', option: { width: 1 }});
      this.initSwiper({ rootEl: 'basic' });
      // this.initLarge();
   }
   initLarge() { //執行放大狀態
      $('.largeCancel').on('click', () => {
         $('.mask').show();
         $('.enlargeBox').hide();
         this.moveSwiperSlide({ from: 'special', to: 'basic' });
      });
      $('.basic svg').on('click', () => {
         $('.mask').hide();
         $('.enlargeBox').show();
         if (this.isFirstLarge) {
            this.isFirstLarge = false;
            this.createSlideHTML({
               swiperClass: 'special',
               idKey: 'id2',
               parent: '#largeBody'
            });
            this.createBarcode({ idKey: 'id2', option: { width: 2, height: 55 }});
            this.initSwiper({ rootEl: 'special' });
         }
         this.moveSwiperSlide({ from: 'basic', to: 'special' });
      });
   }
   changeText(val) { //條碼文字狀態
      let textObj = { 
         0: this.barCodeText1, 
         1: this.barCodeText2
      };
      this.codeTextEl.textContent = textObj[val];
   }
   showHandler(val) {
      if (val === 0) {
         $('#qrcode').show();
         $('#barCodeBox').hide();
      } else {
         $('#qrcode').hide();
         $('#barCodeBox').show();
      }
   }
   get getType() {
      return this._type;
   }
   set setType(val) {
      this._type = val;
      this.changeText(val);
      this.showHandler(val);
      if (val === 1 && this.isFirst) this.initNormal();
   }
}