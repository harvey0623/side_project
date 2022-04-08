export const storageObj = {
   getItem(key) {
      let data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : null;
   },
   setItem(key, payload) {
      localStorage.setItem(key, JSON.stringify(payload));
   },
   removeItem(key) {
      localStorage.removeItem(key);
   }
}

export const sessionStorageObj = {
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
}