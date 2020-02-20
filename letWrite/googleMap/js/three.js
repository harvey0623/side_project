(function(Vue) {
   let rainApi = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization=CWB-C690A6B2-B213-4C52-9CAE-E65971C00D04';

   new Vue({
      el: "#app",
      data: () => ({
         map: null,
         rainData: []
      }),
      methods: {
         getRainData() {
            return axios.get(rainApi);
         },
         initMap() {
            let center = {
               lat: 23.717118,
               lng: 120.9967659
            };
            this.map = new google.maps.Map(document.getElementById('map'), {
               center: center,
               zoom: 8,
               mapTypeId: 'hybrid',
               disableDefaultUI: true
            });
         },
         rainNumberHandler(rainNumber) {
            rainNumber = parseFloat(rainNumber);
            if (rainNumber < 0) rainNumber = 0;
            return rainNumber;
         },
         createHeatData({ lat, lon, weatherElement }) {
            let location = new google.maps.LatLng(lat, lon);
            let weight = this.rainNumberHandler(weatherElement[6]['elementValue']);
            return { location, weight };
         },
         createHeatMap() {
            let heatData = [];
            this.rainData.forEach(item => {
               let result = this.createHeatData(item);
               heatData.push(result);
            });
            new google.maps.visualization.HeatmapLayer({
               data: heatData,
               dissipating: true,
               radius: 10,
               map: this.map,
               gradient: [
                  "rgba(255, 255, 255, 0)",
                  "#B3E5FC",
                  "#81D4FA",
                  "#4FC3F7",
                  "#29B6F6",
                  "#03A9F4",
                  "#039BE5",
                  "#0288D1",
                  "#0277BD",
                  "#01579B"
               ],
            });
         }
      },
      async mounted() {
         this.rainData = await this.getRainData().then(res => res.data.records.location);
         this.initMap();
         this.createHeatMap();
      }
   });
})(Vue);
