window.localProfile = {
   data() {
      return {
         profile: {
            name: '',
            avatar: ''
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
         let sotrage = localStorage.getItem('member_profile');
         let profile = sotrage !== null ? JSON.parse(storage) : null;
         this.profile.name = profile !== null ? profile.name : '';
         this.profile.avatar = profile !== null ?  profile.photo.url : '';
      }
   }
} 