(function() {
   const vm = new Vue({
      el: '#app',
      data: () => ({
         map: null,
         geoJson: [],
         serviceData: null,
         currentMethod: '',
         methodList: [
            { id: 'TRANSIT', name: '大眾交通工具' },
            { id: 'DRIVING', name: '開車' },
            { id: 'BICYCLING', name: '騎腳踏車' },
            { id: 'WALKING', name: '走路' }
         ],
      }),
      computed: {
         destination() {
            if (this.geoJson.length === 0) return [];
            return this.geoJson.reduce((prev, current) => {
               let [lat, lng] = current.geometry.coordinates;
               prev.push(this.createCoordsInstance(lat, lng));
               return prev;
            }, []);
         },
         targetInfo() {
            if (this.serviceData === null) return [];
            return this.destination.reduce((prev, current) => {
               let index = this.geoJson.findIndex(({ geometry }) => {
                  return geometry.coordinates.indexOf(current.lat()) !== -1;
               });
               let { distance, duration } = this.serviceData[index];
               let { name, site } = this.geoJson[index]['properties'];
               prev.push({ name, site, distance, duration });
               return prev;
            }, []);
         }
      },
      methods: {
         getGeoJson() {
            return axios.get('./json/five.geojson');
         },
         createCoordsInstance(lat, lng) {
            return new google.maps.LatLng(lat, lng);
         },
         initMap() {
            let location = {
               lat: 25.0374865,
               lng: 121.5647688
            };
            this.map = new google.maps.Map(this.$refs.map, {
               center: location,
               zoom: 16,
               disableDefaultUI: true
            });
            this.createMarker();
         },
         createMarker() {
            this.geoJson.forEach(geo => {
               let [lat, lng] = geo.geometry.coordinates;
               new google.maps.Marker({
                  position: this.createCoordsInstance(lat, lng),
                  map: this.map,
                  icon: 'https://cdn0.iconfinder.com/data/icons/lumin-social-media-icons/512/Location-32.png'
               });
            });
         },
         getCurrent(id = 'TRANSIT') {
            if (navigator.geolocation) {
               this.currentMethod = id;
               navigator.geolocation.getCurrentPosition(this.success, this.error, {
                  enableHighAccuracy: true
               });
            } else {
               alert('not support geolocation');
            }
         },
         success(position) {
            let { latitude, longitude } = position.coords;
            let originInstance = this.createCoordsInstance(latitude, longitude);
            let service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
               origins: [originInstance],
               destinations: this.destination,
               travelMode: this.currentMethod,
               unitSystem: google.maps.UnitSystem.METRIC,
               avoidHighways: true,
               avoidTolls: true
            }, (res, status) => {
               if (status === 'OK') this.serviceData = res.rows[0]['elements'];
            });
         },
         error(err) {
            console.log(err);
         },
      },
      async mounted() {
         this.geoJson = await this.getGeoJson().then(res => res.data.features);
         this.initMap();
         this.getCurrent();
      }
   });

})();