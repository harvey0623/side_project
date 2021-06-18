const wm_aes = function (input) {
   let meta = document.querySelector('[name=aes_key]');
   if (meta === null) throw new Error('not found aes_key');
   let keyHash = CryptoJS.SHA384(meta.content);
   let key = CryptoJS.enc.Hex.parse(keyHash.toString().substring(0, 64));
   let iv = CryptoJS.enc.Hex.parse(keyHash.toString().substring(64, 96));
   let encrypted = CryptoJS.AES.encrypt(input, key, { iv: iv });
   return encrypted.toString();
}

window.$wm_aes = wm_aes;
Vue.prototype.$wm_aes = wm_aes;