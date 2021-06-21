export default function({ apiUrl, pageUrl }) {
   new Vue({
      el: '#app',
      data: () => ({
         isLoading: false,
         pageUrl,
         user: {
            mobile: '',
            name: '',
            gender: '',
            email: '',
            birthday: '',
            security_question: '',
            security_answer: '',
            category: '',
            importantDate: ''
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
      }),
      computed: {
         isDateRequired() {
            return this.user.category !== ''; 
         },
         criteriaText() {
            return this.isDateRequired ? 'required' : '';
         }
      },
      methods: {
         birthdayHandler() {
            $('#birthdayModal').modal('show');
         },
         async submitHandler() {
            let isValid = await this.$refs.form.validate();
            if (!isValid) return;
         },
      },
      async mounted() {
         
      }
   });
}