import QrcodeMaker from '../QrcodeMaker/index.js';
import BarCodeMaker from '../BarCodeMaker/index.js';
export default class MemberCard {
   constructor(props) {
      this.appName = props.appName;
      this.codeTextEl = document.querySelector(props.codeTextEl);
      this.source = props.source;
      this.vehicleCode = props.vehicleCode;
      this.qrInstance = null;
      this.swiper = null;
      this.slideGroup = [];
      this._type = 0;
      this.isFirst = true;
      this.barCodeText1 = window.getSystemLang('membercard_b_1dbarcode');
      this.barCodeText2 = window.getSystemLang('membercard_b_2dbarcode');
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
      let memberCard = this.source.slice(0, endIndex);
      memberCard = memberCard.map(({ key, value }) => ({ key, value }));
      let schema = {
         "source": {
            "system": "MMRM",
            "app": `{{${this.appName}}}`,
            "type": "member"
         },
         "card_info": memberCard,
         "invoice_info": [
            {
               "key": "einvoice_carrier_no",
               "value": this.vehicleCode !== undefined ? this.vehicleCode : ''
            }
         ]
      };
      this.qrInstance = new QrcodeMaker({
         rootEl: '#qrcode',
         text: JSON.stringify(schema)
      });
   }
   createSlideHTML() { //產生slider結構
      let swiperContainer = document.createElement('div');
      swiperContainer.classList.add('swiper-container');
      swiperContainer.innerHTML = `
         <div class="swiper-wrapper"></div>
         <div class="swiper-pagination"></div>`;
      this.slideGroup.forEach(item => {
         let template = '';
         let swipeSlide = document.createElement('div');
         swipeSlide.classList.add('swiper-slide');
         item.data.forEach(obj => {
            template += `
               <div class="codeItem">
                  <p>${obj.key}</p>
                  <svg id="${obj.id}"></svg>
               </div>`;
         });
         swipeSlide.innerHTML = template;
         swiperContainer.querySelector('.swiper-wrapper').appendChild(swipeSlide);
      });
      $('#barCodeBox').append(swiperContainer);
   }
   createBarcode() {  //產生二為條碼
      this.source.forEach(item => {
         new BarCodeMaker({
            rootEl: `#${item.id}`,
            text: item.value,
         });
      });
   }
   initSwiper() { //初始輪播
      let isThanOne = this.slideGroup.length > 1;
      let option = {
         loop: isThanOne,
         allowTouchMove: isThanOne,
         pagination: {
            el: '.swiper-pagination',
            bulletActiveClass: 'swiper-pagination-bullet-bg'
         }
      };
      if (!isThanOne) delete option.pagination;
      this.swiper = new Swiper('.swiper-container', { ...option });
   }
   changeText(val) {
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
      if (val === 1 && this.isFirst) {
         this.createSlideHTML();
         this.createBarcode();
         this.initSwiper();
         this.isFirst = false;
      }
   }
}