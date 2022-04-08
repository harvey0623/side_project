import { sessionStorageObj } from '../../src/storage.js';
export const checkHasForgotInfoMixin = {
   methods: {
      checkHasForgetInfo() {
         let storageData = sessionStorageObj.getItem('forgotInfo');
         if (storageData !== null) {
            this.user.mobile = storageData.mobile;
            this.user.temp_access_token = storageData.temp_access_token;
         } else {
            $('#refillModal').modal('show');
         }
         return storageData !== null;
      },
   }
}