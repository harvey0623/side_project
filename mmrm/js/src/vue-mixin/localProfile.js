window.localProfile = {
   data() {
      return {
         profile: {
            name: '',
            avatar: '',
            referral_code: ''
         }
      }
   },
   computed: {
      avatarBg() {
         if (this.profile.avatar === '') return {};
         else return { backgroundImage: `url(${this.profile.avatar})` };
      }
   },
   methods: {
      getLocalProfile() {
         let storage = localStorage.getItem('member_profile');
         let profile = storage !== null ? JSON.parse(storage) : null;
         this.profile.name = profile !== null ? profile.name : '';
         this.profile.referral_code = profile !== null ? profile.referral_code : '';
         if (profile === null || profile.photo === undefined) {
            this.profile.avatar = '';
         } else {
            this.profile.avatar = profile.photo.url;
         }
      },
      getMemberProfile() {
         let meta = document.querySelector('[name="get_member_profile_url"]');
         if (meta === null) return;
         return mmrmAxios({
            url: meta.content,
            method: 'post',
            data: {}
         }).then(res => res.data.results.member_profile).catch(() => null);
      },
   },
   mounted() {
      let storage = localStorage.getItem('member_profile');
      if (storage !== null) return;
      this.getMemberProfile().then(res => {
         localStorage.setItem('member_profile', JSON.stringify(res));
         this.getLocalProfile();
      });
   }
}