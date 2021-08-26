import QrcodeMaker from '../../modules/QrcodeMaker/index.js';
export default function({ appName ,apiUrl }) {
   new Vue({
      el: '#app',
      data: {
         memberProfile: null,
         levelName: '',
         isLoading: false,
         cardNo: ''
      },
      computed: {
         hasMemberProfile() {
            return this.memberProfile !== null;
         },
         memberName() {
            return this.hasMemberProfile ? this.memberProfile.name : '';
         },
      },
      methods: {
         getMemberProfile() {
            return mmrmAxios({
               url: apiUrl.memberProfile,
               method: 'post',
               data: {}
            }).then(res => res.data.results.member_profile).catch(() => null);
         },
         getMemberCard() {
            return mmrmAxios({
               url: apiUrl.memberCard,
               method: 'post',
               data: {}
            }).then(res => res.data.results)
         },
         getMemberSummary() {
            return mmrmAxios({
               url: apiUrl.memberSummary,
               method: 'post',
               data: {}
            }).then(res => res.data.results)
         },
         getLevelInfo(levelId) {
            return mmrmAxios({
               url: apiUrl.levelInfo,
               method: 'post',
               data: { level_id: [levelId] }
            }).then(res => res.data.results)
         },
         createQrcode(vehicleCode, cardSource) {
            let schema = {
               "source": {
                  "system": "MMRM",
                  "app": `{{${appName}}}`,
                  "type": "member"
               },
               "card_info": cardSource,
               "invoice_info": [
                  {
                     "key": "einvoice_carrier_no",
                     "value": vehicleCode !== undefined ? vehicleCode : ''
                  }
               ]
            };
            new QrcodeMaker({
               rootEl: '#qrcode',
               width: 180,
               height: 180,
               text: JSON.stringify(schema)
            });
         },
         getCardNo(cardSource) { //取得會員卡號
            return cardSource[0].value;
         }
      },
      async mounted() {
         this.isLoading = true;
         this.memberProfile = await this.getMemberProfile();
         let memberCard = await this.getMemberCard();
         let memberSummary = await this.getMemberSummary();
         let levelId = memberSummary.level_summary.current_level.level_id;
         let levelInfo = await this.getLevelInfo(levelId);
         this.levelName = levelInfo.level_information[0].title;
         let vehicleCode = this.memberProfile.einvoice_carrier_no;
         let cardSource = memberCard.member_card.code_info.card_info;
         this.createQrcode(vehicleCode, cardSource);
         this.cardNo = this.getCardNo(cardSource);
         this.isLoading = false;
      }
   })
}