new Vue({
   el: '#app',
   data: () => ({
      map: null,
      autocomplete: null,
      marker: null,
      infoWindow: null,
      reviews: [],
      storeAddress: '',
      keyword: '',
   }),
   computed: {
      reviewList() {
         let arr = JSON.parse(JSON.stringify(this.reviews));
         return arr.sort((a, b) => b.rating - a.rating);
      }
   },
   methods: {
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
      },
      siteAuto() {
         this.autocomplete = new google.maps.places.Autocomplete(this.$refs.input, {
            fields: ['All']
         });
         this.autocomplete.addListener('place_changed', this.placeChange);
      },
      placeChange() {
         let placeData = this.autocomplete.getPlace();
         if (!placeData.geometry) return;
         this.storeAddress = placeData.formatted_address;
         this.reviews = placeData.reviews || [];
         this.setMarkerAndWindow(placeData);
      },
      setMarkerAndWindow(placeData) {
         let searchCenter = placeData.geometry.location;
         this.map.panTo(searchCenter);
         if (this.marker !== null) this.marker.setMap(null);
         if (this.infoWindow !== null) this.infoWindow.close(null);
         this.marker = new google.maps.Marker({
            position: searchCenter,
            map: this.map
         });
         this.infowindow = new google.maps.InfoWindow({
            content: placeData.name
         });
         this.infowindow.open(this.map, this.marker);
      },
      getTimeString(timeStamp) {
         return new Date(timeStamp * 1000).toLocaleDateString();
      }
   },
   mounted() {
      this.initMap();
      this.siteAuto();
   }
});