export default function ({ apiUrl, pageUrl }) {
   let mobileSelect = null;
   new Vue({
      el: '#app',
      mixins: [localProfile],
      data: () => ({
         isLoading: false,
         pageUrl
      }),
      computed: {

      },
      methods: {
         initMobileSelector() {
            mobileSelect = new MobileSelect({
               trigger: '#iosPicker',
               title: '大頭照',
               ensureBtnText: '確定',
               cancelBtnText: '取消',
               ensureBtnColor: '#288efb',
               titleColor: '#292929',
               textColor: '#292929',
               triggerDisplayData: false,
               wheels: [{
                  data: [
                     { id: 'camera', value: '現在就來自拍吧' },
                     { id: 'album', value: '從我的相簿中找找' },
                  ]
               }],
               callback: (index, data) => {
                  let info = data[0];
                  
               }
            });
         },
         takePicture() {
            mobileSelect.show();
         }
      },
      async mounted() {
         this.initMobileSelector();
      }
   });
}