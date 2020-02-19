(function (Vue) {
   new Vue({
      el: "#app",
      data: () => ({
         map: null,
         japanGeo: [],
      }),
      methods: {
         getJapanGeo() {
            return axios.get('./json/japan.geojson');
         },
         initMap() {
            let location = {
               lat: 34.9506901,
               lng: 135.7468915
            };
            this.map = new google.maps.Map(document.getElementById('map'), {
               center: location,
               zoom: 12,
               mapTypeId: 'terrain',
               disableDefaultUI: true
            });
         },
         createMarker() {
            this.japanGeo.forEach(item => {
               let [lat, lng] = item.geometry.coordinates;
               let latLng = new google.maps.LatLng(lat, lng);
               let marker = new google.maps.Marker({
                  position: latLng,
                  map: this.map
               });
               let infoWindow = new google.maps.InfoWindow({
                  content: `<div class="highlight">${item.properties.name}</div>`
               });
               infoWindow.open(this.map, marker);
            });
         },
         drawStar() {
            let star = new google.maps.Polygon({
               paths: [
                  { lat: 35.019416, lng: 135.742086 },
                  { lat: 34.889255, lng: 135.807670 },
                  { lat: 34.960380, lng: 135.656189 },
                  { lat: 34.970635, lng: 135.833613 },
                  { lat: 34.879675, lng: 135.700043 }
               ],
               strokeColor: '#000000',
               fillColor: '#000000',
               strokeOpacity: 0.8,
               fillOpacity: 0.24,
               strokeWeight: 5,
            });
            star.setMap(this.map);
         },
         drawCircle() {
            new google.maps.Circle({
               strokeColor: '#f1c40f',
               strokeOpacity: 1,
               strokeWeight: 5,
               fillColor: '#f1c40f',
               fillOpacity: 0.35,
               radius: 8500,
               map: this.map,
               center: {
                 lat: 34.9506901,
                 lng: 135.7468915
               }
            });
         }
      },
      async mounted() {
         this.japanGeo = await this.getJapanGeo().then(res => res.data.features);
         this.initMap();
         this.createMarker();
         this.drawStar();
         this.drawCircle();
      }
   });
})(Vue);
