export default function({ apiUrl, pageUrl }) {
   const serviceObj = {
      call(val) {
         let aTag = this.createATag();
         aTag.href = `tel:${val};`
         aTag.click();
         this.removeATag(aTag);
      },
      email(val) {
         let aTag = this.createATag();
         aTag.href = `mailto:${val};`
         aTag.click();
         this.removeATag(aTag);
      },
      redirect(url) {
         location.href = url;
      },
      createATag() {
         let a = document.createElement('a');
         document.body.appendChild(a);
         return a;
      },
      removeATag(el) {
         document.body.removeChild(el);
      }
   };

   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         isLoading: false,
         serviceList: [
            { title: '撥打客服', type: 'call' },
            { title: '意見回饋', type: 'email' },
            { title: '相關條款', type: 'term' },
            { title: 'Q&A', type: 'qa' }
         ],
         vendor: {
            mobile: '0912345678',
            email: 'service@gmail.com'
         },
         pageUrl
      }),
      methods: {
         talkHandler() {
            $('#optionModal').modal('show');
         },
         serviceHandler(serviceType) {
            let params = null;
            if (serviceType === 'call') params = this.vendor.mobile;
            if (serviceType === 'email') params = this.vendor.email;
            if (serviceType === 'term') params = this.pageUrl.term;
            if (serviceType === 'qa') params = this.pageUrl.qa;
            serviceType = serviceType === 'term' || serviceType === 'qa' ? 'redirect': serviceType;
            serviceObj[serviceType](params);
         }
      },
      mounted() {
         this.getLocalProfile();
      }
   });
}