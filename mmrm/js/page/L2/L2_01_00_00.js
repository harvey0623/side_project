import Ajax from '../../modules/Ajax/index.js';
import MemberCard from '../../modules/MemberCard/index.js';
export default function({ appName, apiUrl }) {
   let ajax = new Ajax({ ...apiUrl });
   let profile = {
      name: '',
      status: '',
      isLoading: false
   };
   let profileProxy = new Proxy(profile, {
      get(target, key) {
         return target[key];
      },
      set(target, key, value) {
         target[key] = value;
         if (key === 'name') $('.name').text(value);
         if (key === 'status') $('.status').text(value);
         if (key === 'isLoading') $('#loading')[value ? 'show' : 'hide']();
         return true;
      }
   });

   let init = async function() {
      profileProxy.isLoading = true;
      let cardSource = [];
      let memberProfile = await ajax.getMemberProfile().then(res => res);
      let cardResult = await ajax.getCard().then(res => res);
      let memberSummary = await ajax.getMemberSummary().then(res => res);
      let levelId = memberSummary.level_summary.current_level.level_id;
      let levelInfo = await ajax.getLevelInfo(levelId).then(res => res);
      let vehicleCode = memberProfile.member_profile.einvoice_carrier_no;
      profileProxy.name = memberProfile.member_profile.name;
      profileProxy.status = levelInfo.level_information[0].title;
      cardSource = cardSource.concat(cardResult.member_card.code_info.card_info);
      if (vehicleCode !== undefined) {
         cardSource.push({
            key: window.getSystemLang('membercard_vehicleno'),
            value: vehicleCode
         });
      }
      cardSource.forEach((card, index) => card.id = `x${index + 1}`);
      new MemberCard({
         appName,
         codeTextEl: '.codeText',
         source: cardSource,
         vehicleCode
      });
      profileProxy.isLoading = false;
   }

   init();
}