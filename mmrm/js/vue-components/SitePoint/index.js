Vue.component('site-point', {
   props: {
      store_bg: {
         required: true
      },
      brand_logo: {
         required: true
      },
      store_name: {
         type: String,
         required: true
      },
      address: {
         type: String,
         required: true
      },
      tel: {
         type: String,
         required: true
      },
      distance: {
         required: true
      },
      google_map_url: {
         type: String,
         required: true
      }
   },
   computed: {
      storeBg() {
         if (!this.store_bg) return {};
         else return { backgroundImage: `url(${this.store_bg})` };
      },
      brandLogo() {
         if (!this.brand_logo) return {};
         else return { backgroundImage: `url(${this.brand_logo})` };
      },
      distanceText() {
         return this.distance !== '' ? `| ${Math.floor(this.distance)}km` : '';
      }
   },
   template: `
      <a :href="google_map_url" class="storePoint" target="_blank">
         <div class="storeBg" :style="storeBg"></div>
         <div class="storeDesc">
            <div>
               <div class="brandLogo" :style="brandLogo"></div>
               <p class="storeName">{{ store_name }}</p>
            </div>
            <div>
               <p>{{ address }}</p>
            </div>
            <div class="contact">
               <p>{{ tel }}</p>
               <p class="distance">{{ distanceText }}</p>
            </div>
         </div>
      </a>`
});