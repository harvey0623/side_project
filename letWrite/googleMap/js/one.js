(function(Vue, axios) {
   new Vue({
      el: '#app',
      data: () => ({
         map: null,
         features: [],
         mapStyle: [],
         infoWindowArr: [],
         nightMode: true
      }),
      methods: {
         getMapStyle() {
            return axios.get('./json/mapStyle.json');
         },
         initMap() {
            let location = {
               lat: 25.0374865,
               lng: 121.5647688
            };
            this.map = new google.maps.Map(document.getElementById('map'), {
               center: location,
               zoom: 16,
               mapTypeId: 'terrain',
               disableDefaultUI: true
            });
            this.createMarker();
         },
         async createMarker() {
            this.features.forEach(item => {
               let [lat, lng] = item.geometry.coordinates;
               let latLng = new google.maps.LatLng(lat, lng);
               let marker = new google.maps.Marker({
                  position: latLng,
                  map: this.map
                  // icon: 'https://akveo.github.io/eva-icons/outline/png/128/gift-outline.png',
                  // animation: google.maps.Animation.DROP,
                  // draggable: true,
               });
               let infowindow = new google.maps.InfoWindow({
                  content: `<h6">${item.properties.name}</h6>`
               });
               marker.addListener('click', () => {
                  infowindow.open(this.map, marker);
               });
               this.infoWindowArr.push({
                  id: item.properties.id,
                  infoInstance: infowindow,
                  markerInstance: marker 
               });
            });
         },
         clickHandler(id) {
            let targetWindow = this.infoWindowArr.find(info => info.id === id);
            if (targetWindow !== undefined) {
               let { infoInstance, markerInstance } = targetWindow;
               infoInstance.open(this.map, markerInstance);
            }
         },
         setMode() {
            let modeValue = this.nightMode ? this.mapStyle : [];
            this.map.setOptions({
               styles: modeValue
            });
         }
      },
      async mounted() {
         this.features = await axios.get('./json/one.geojson').then(res => res.data.features);
         this.mapStyle = await this.getMapStyle().then(res => res.data);
         this.initMap();
         this.setMode();
      },
      watch: {
         nightMode() {
            this.setMode();
         }
      }
   });
})(Vue, axios);