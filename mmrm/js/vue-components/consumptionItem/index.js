Vue.component('consumption-item', {
   props: {
      brand_logo: {
         required: true
      },
      brand_name: {
         type: String,
         required: true
      },
      invamt: {
         type: String,
         required: true
      },
      store_name: {
         type: String,
         required: true
      },
      sale_id_p: {
         type: String,
         required: true
      },
      date: {
         type: String,
         required: true
      },
      time: {
         type: String,
         required: true
      },
      page_url: {
         type: String,
         required: true
      }
   },
   computed: {
      brandBg() {
         if (!this.brand_logo) return {};
         else return { backgroundImage: `url(${this.brand_logo})` };
      },
      createdTime() {
         return dayjs(`${this.date} ${this.time}`).format('YYYY/MM/DD HH:mm:ss');
      },
      isReturn() {
         return this.sale_id_p !== '';
      }
   },
   template: `
      <a :href="page_url" class="consumptionItem">
         <div class="infoBox">
            <div>
               <span class="brandBg" :style="brandBg"></span>
               <p>{{ brand_name }}</p>
            </div>
            <div>
               <p>NT.{{ parseInt(invamt) | currency }}</p>
               <span class="arrowBg"></span>
            </div>
         </div>
         <p class="normalColor storeName">{{ store_name }}</p>
         <p class="normalColor time">{{ createdTime }}</p>
         <div class="returnBg" v-if="isReturn"></div>
      </a>`
});