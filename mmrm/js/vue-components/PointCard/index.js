Vue.component('point-card', {
   props: {
      id: {
         type: Number,
         required: true
      },
      title: {
         type: String,
         required: true
      },
      point: {
         type: String,
         required: true
      },
      imgurl: {
         required: true
      },
      expiretime: {
         type: String,
         required: true
      }
   },
   data: () => ({
      expireText: window.getSystemLang('pointactivitydetail_duration'),
      pointUnit: window.getSystemLang('point_unit')
   }),
   computed: {
      pointBg() {
         if (!this.imgurl) return {};
         else return { backgroundImage: `url(${this.imgurl})` };
      },
      dateText() {
         return this.expiretime.split(' ')[0];
      },
      deadline() {
         return vsprintf(this.expireText, [this.dateText]); 
      }
   },
   template: `
      <div class="pointCard">
         <div class="pointBg" :style="pointBg"></div>
         <div class="pointDesc">
            <p class="pointTitle">{{ title }}</p>
            <div class="pointAmount">
               <span class="number">{{ point }}</span>
               <span>{{ pointUnit }}</span>
            </div>
            <div class="expireTime">{{ deadline }}</div>
         </div>
      </div>`
});