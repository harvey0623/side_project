export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         memberProfile: null,
         isLoading: false,
         tipMsg: '',
         pageUrl,
         user: {
            mobile: '',
            name: '',
            gender: '',
            email: '',
            birthday: '',
            security_question: '',
            security_answer: '',
            memorial_day_type: '',
				memorial_day: '',
         },
         genderList: [
            { title: window.getSystemLang('membergender_male'), value: 'M' },
            { title: window.getSystemLang('membergender_female'), value: 'F' },
            { title: window.getSystemLang('membergender_secret'), value: 'S' },
         ],
         questionList: [
            { title: window.getSystemLang('membersecurityquestion_sq01'), value: 'sq01' },
            { title: window.getSystemLang('membersecurityquestion_sq02'), value: 'sq02' },
            { title: window.getSystemLang('membersecurityquestion_sq03'), value: 'sq03' },
            { title: window.getSystemLang('membersecurityquestion_sq04'), value: 'sq04' },
            { title: window.getSystemLang('membersecurityquestion_sq05'), value: 'sq05' }
         ],
         memorialList: [
            { title: '愛情紀念日', value: 'md01' },
            { title: '加薪紀念日', value: 'md02' },
            { title: '好友紀念日', value: 'md03' },
            { title: '畢業紀念日', value: 'md04' },
            { title: '家人生日',  value: 'md05' },
            { title: '其他', value: 'md99' }
         ]
      }),
      computed: {
         isDateRequired() {
            return this.user.memorial_day_type !== ''; 
         },
         criteriaText() {
            return this.isDateRequired ? 'required|memorialDay' : '';
         }
      },
      methods: {
         birthdayHandler() {
            $('#birthdayModal').modal('show');
         },
         getMemberProfile() {
            return mmrmAxios({
               url: apiUrl.memberProfile,
               method: 'post',
               data: {}
            }).then(res => res.data.results.member_profile).catch(() => null);
         },
         updateMemberProfile() { //修改會員資料
            let copyData = JSON.parse(JSON.stringify(this.user));
            delete copyData.mobile;
            delete copyData.birthday;
            if (copyData.memorial_day !== '') {
               copyData.memorial_day = copyData.memorial_day.replace(/\-/g, '/');
            }
            return mmrmAxios({
               url: apiUrl.updateMemberProfile,
               method: 'post',
               data: { member_profile: copyData }
            }).then(res => res.data);
         },
         async setUser(memberProfile) {
            for (let key in this.user) {
               this.user[key] = memberProfile[key] || '';
            }
            await this.$nextTick();
            let memorial_day = memberProfile.memorial_day;
				this.user.memorial_day = memorial_day ? memorial_day.replace(/\//g, '-') : '';
         },
         async submitHandler() { 
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
            this.isLoading = true;
            let updateResult = await this.updateMemberProfile();
            this.tipMsg = updateResult.rcrm.RM;
            if (updateResult.rcrm.RC === 'C01') {
               let newProfile = await this.getMemberProfile();
               localStorage.setItem('member_profile', JSON.stringify(newProfile));
            }
            $('#tipModal').modal('show');
            this.isLoading = false;
         },
      },
      async mounted() {
         this.isLoading = true;
         let memberProfile = await this.getMemberProfile();
         await this.setUser(memberProfile);
         this.isLoading = false;
      },
      watch: {
         isDateRequired(val) {
            this.user.memorial_day = '';
         }
      }
   });
}