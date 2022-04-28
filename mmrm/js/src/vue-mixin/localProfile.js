window.localProfile = {
   data() {
      return {
         profile: { name: '', avatar: '', referral_code: '' },
         cardNo: ''
      }
   },
   computed: {
      avatarBg() {
         if (this.profile.avatar === '') return {};
         else return { backgroundImage: `url(${this.profile.avatar})` };
      }
   },
   methods: {
      fetchMemberProfile() {
         let meta = document.querySelector('[name="get_member_profile_url"]');
         return mmrmAxios({
            url: meta.content,
            method: 'post',
            data: {}
         }).then(res => res.data.results.member_profile).catch(() => null);
      },
      fetchMemberCard() {
         let meta = document.querySelector('[name="get_member_card_url"]');
         return mmrmAxios({
            url: meta.content,
            method: 'post',
            data: {}
         }).then(res => res.data.results);
      },
      getLocalProfile() {
         let storage = localStorage.getItem('member_profile');
         let profile = JSON.parse(storage);
         this.profile.name = profile.name || '';
         this.profile.referral_code = profile.referral_code || '';
         this.profile.avatar = profile.photo !== undefined ? profile.photo.url : '';
      },
      checkHasProfile() {
         let storage = localStorage.getItem('member_profile');
         if (storage !== null) {
            this.getLocalProfile();
         } else {
            this.fetchMemberProfile().then(res => {
               localStorage.setItem('member_profile', JSON.stringify(res));
               this.getLocalProfile();
            });
         }
      },
      async checkHasCard() {
         let storage = localStorage.getItem('member_card');
         if (storage !== null) {
            let cardInfo = JSON.parse(storage);
            this.cardNo = cardInfo.text;
         } else {
            this.isLoading = true;
            let response = await this.fetchMemberCard();
            this.cardNo = response.member_card.code_info.card_info[0].value;
            localStorage.setItem('member_card', JSON.stringify({ text: this.cardNo }));
         }
      }
   },
   async mounted() {
      this.checkHasProfile();
      await this.checkHasCard();
   }
}