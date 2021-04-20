export const gpsObj = {
   getLocation() {
      return new Promise(resolve => {
         if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
               resolve({
                  status: true,
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
               });
            }, () => {
               resolve({ status: false });
            }, {
               enableHighAccuracy: false,
               timeout: 5000,
               maximumAge: 0
            });
         } else {
            resolve({ status: false });
         }
      });
   },
   getDistance(from, to, unit) {
      if ((from.lat1 == to.lat2) && (from.lon1 == to.lon2)) {
         return 0;
      } else {
         var radlat1 = Math.PI * from.lat1 / 180;
         var radlat2 = Math.PI * to.lat2 / 180;
         var theta = from.lon1 - to.lon2;
         var radtheta = Math.PI * theta / 180;
         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
         if (dist > 1) {
            dist = 1;
         }
         dist = Math.acos(dist);
         dist = dist * 180 / Math.PI;
         dist = dist * 60 * 1.1515;
         if (unit == "K") { dist = dist * 1.609344 }
         if (unit == "N") { dist = dist * 0.8684 }
         return dist;
      }
   }
}