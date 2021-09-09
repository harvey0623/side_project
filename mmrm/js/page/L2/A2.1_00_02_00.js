import Ajax from '../../modules/Ajax/index.js';
import CouponCard from '../../modules/CouponCard/index.js';
export default function({ appName, apiUrl }) {
   let couponObj = {
      imgUrl: '',
      title: '',
      duration: '',
      userName: '',
      bgImg: '',
      isLoading: false
   };
   let couponProxy = new Proxy(couponObj, {
      get(target, key) {
         return target[key];
      },
      set(target, key, value) {
         target[key] = value;
         if (key === 'imgUrl') {
            $('.brandLogo').attr('src', value);
            $('.brandLogo').addClass('show');
         }
         if (key === 'userName') $('.userName').text(value);
         if (key === 'title') $('.name').text(value);
         if (key === 'duration') {
            let template = window.getSystemLang('missiontaskreward_couponusageduration');
            $('.duration').text(vsprintf(template, [value]));
         }
         if (key === 'bgImg') {
            if (value) $('.colorBlock').css({ backgroundImage: `url(${value})` });
         }
         if (key === 'isLoading') $('#loading')[value ? 'show' : 'hide']();
         return true;
      }
   });

   let getQuery = function(key) { //取得網址參數
      let params = (new URL(document.location)).searchParams;
      return params.get(key);
   }

   let ajax = new Ajax({ ...apiUrl });

   let init = async function() {
      couponProxy.isLoading = true;
      
      let myCouponId = parseInt(getQuery('my_coupon_id'));
      let couponDetail = await ajax.getCouponDetail(myCouponId).then(res => res);
      let couponInfo = await ajax.getCouponInfo(couponDetail.coupon_id).then(res => res[0]);
      let brandInfo = await ajax.getBrandInfo(couponInfo.brand_ids[0]).then(res => res[0]);
      let memberProfile = await ajax.getMemberProfile().then(res => res);
      let memberCard = await ajax.getCard().then(res => res);
      let vehicleCode = memberProfile.member_profile.einvoice_carrier_no;
      couponProxy.title = couponInfo.title;
      couponProxy.duration = couponDetail.duration;
      couponProxy.imgUrl = brandInfo.feature_image_small.url;
      couponProxy.userName = memberProfile.member_profile.name;
      couponProxy.bgImg = couponInfo.feature_image.url;
      $('.cardHead').addClass('active');
      let cardSource = [];
      cardSource.push({
         key: window.getSystemLang('couponcode_couponnumber'),
         value: couponDetail.coupon_no,
      });
      cardSource = cardSource.concat(memberCard.member_card.code_info.card_info);
      
      if (vehicleCode !== undefined) {
         cardSource.push({
            key: window.getSystemLang('couponcode_vehiclenumber'),
            value: vehicleCode
         });
      }

      cardSource.forEach((card, index) => {
         card.id = `x${index + 1}`;
         card.id2 = `y${index + 1}`;
      });

      new CouponCard({
         appName,
         codeTextEl: '.codeText',
         source: cardSource,
         vehicleCode
      });

      couponProxy.isLoading = false;
   }

   init();
}