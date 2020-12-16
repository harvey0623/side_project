const encryptAes = function(payload, isJson = true) {
   if (isJson) payload = JSON.stringify(payload); //如果是純字串就不stringify
   let meta = document.querySelector('[name=aes_key]');
   if (meta === null) throw new Error('not found specific meta tag');
   let aes_key = meta.content;
   let keyHash = CryptoJS.SHA384(aes_key);
   let key = CryptoJS.enc.Hex.parse(keyHash.toString().substring(0, 64));
   let iv = CryptoJS.enc.Hex.parse(keyHash.toString().substring(64, 96));
   let encrypted = CryptoJS.AES.encrypt(payload, key, { iv: iv });
   return encrypted.toString();
}

const decryptAes = function(input) {
   let meta = document.querySelector('[name=aes_key]');
   if (meta === null) throw new Error('not found specific meta tag');
   let aes_key = meta.content;
   let keyHash = CryptoJS.SHA384(aes_key);
   let key = CryptoJS.enc.Hex.parse(keyHash.toString().substring(0, 64));
   let iv = CryptoJS.enc.Hex.parse(keyHash.toString().substring(64, 96));
   var encrypted = CryptoJS.AES.decrypt(input, key, { iv: iv });
   return encrypted.toString(CryptoJS.enc.Utf8);
}

window.$encryptAes = encryptAes;
window.$decryptAes = decryptAes;
Vue.prototype.$encryptAes = encryptAes;
Vue.prototype.$decryptAes = decryptAes;