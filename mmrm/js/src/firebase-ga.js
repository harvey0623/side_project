import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
class FirebaseGa {
   constructor() {
      this.analytics = null;
      this.initFirebase();
      this.initTimeMe();
   }
   initFirebase() {
      let firebaseConfig = window.firebaseInitConfig;
      let app = initializeApp(firebaseConfig);
      this.analytics = getAnalytics(app);
   }
   initTimeMe() {
      TimeMe.initialize({
         currentPageName: 'wowfoods-line',
         idleTimeoutInSeconds: 60
      });
   }
   getCardNo() {
      let storage = localStorage.getItem('member_card');
      let cardNo = storage !== null ? JSON.parse(storage).text : '';
      return window.$wm_md5(cardNo);
   }
   logEvent(eventName, payload = {}, needTime = false) {
      console.log(eventName)
      let requiredData = {
         UUID: Cookies.get('local_line_user_id') || '',
         setUserID: this.getCardNo(),
         OStype: 'Web'
      };
      let eventParams = { ...requiredData, ...payload };
      if (needTime) eventParams.spentTime = TimeMe.getTimeOnCurrentPageInSeconds();
      logEvent(this.analytics, eventName, eventParams);
   }
}

window.firebaseGa = new FirebaseGa();