export const storageObj = {
   getItem(key) {
      let data = sessionStorage.getItem(key);
      return data !== null ? JSON.parse(data) : null;
   },
   setItem(key, payload) {
      sessionStorage.setItem(key, JSON.stringify(payload));
   },
   removeItem(key) {
      sessionStorage.removeItem(key);
   }
};