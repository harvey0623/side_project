import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getAnalytics, logEvent  } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-analytics.js";
console.log(initializeApp)
class FirebaseGa {
   constructor() {
      this.analytics = null;
      this.initFirebase();
      this.initTimeMe();
   }
   initFirebase() {
      let firebaseConfig = { 
         apiKey: "AIzaSyDK-Z3og32hr4aUCis-EBszTXAUuTKZ0fc",
         authDomain: "analysic-4d1f3.firebaseapp.com",
         projectId: "analysic-4d1f3",
         storageBucket: "analysic-4d1f3.appspot.com",
         messagingSenderId: "493926805475",
         appId: "1:493926805475:web:965856ed0ca88762a9bad6",
         measurementId: "G-P6YEP2HBY4"
      };
      let app = initializeApp(firebaseConfig);
      this.analytics = getAnalytics(app);
   }
   initTimeMe() {
      TimeMe.initialize({
         currentPageName: 'current-page',
         idleTimeoutInSeconds: 60
      });
   }
   logEvent(eventName, payload) {
      logEvent(this.analytics, eventName, payload);
   }
   logTime(eventName) {
      logEvent(this.analytics, eventName, TimeMe.getTimeOnCurrentPageInSeconds());
   }
}

window.firebaseGa = new FirebaseGa();