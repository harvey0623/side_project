Vue.component('store-sidebar', {
   props: {
      turn_on: {
         type: Boolean,
         required: true
      },
   },
   data: () => ({
      zipCodeData: zipCodeData,
      isOpenAreaBlock: false,
      areaInfo: {
         city: '',
         district: ''
      }
   }),
   computed: {
      cityList() {
         return this.zipCodeData.map(item => item.name);
      },
      districtList() {
         let tagretCity = this.zipCodeData.find(item => item.name === this.areaInfo.city);
         if (tagretCity !== undefined) return tagretCity.districts;
         else return [];
      }
   },
   methods: {
      confirmHandler() {
         this.$emit('pickup_area', { ...this.areaInfo });
      }
   },
   watch: {
      districtList() {
         this.areaInfo.district = '';
      }
   },
   template: `
      <div id="sidebar" :class="{show:turn_on}">
         <div class="sidebarPanel">
            <div class="empty"></div>
            <div class="seekText">篩選</div>
            <div class="sureText" @click="confirmHandler">確定</div>
         </div>
         <div class="storeFilter">
            <div class="hasBorder" @click="isOpenAreaBlock = !isOpenAreaBlock">
               <div class="filterTitle">區域選擇</div>
               <div class="areaDownIcon" :class="{rotate:isOpenAreaBlock}"></div>
            </div>
            <div class="storeAreaBlock" :class="{active:isOpenAreaBlock}">
               <div class="selectOuter">
                  <select class="form-control" v-model="areaInfo.city">
                     <option value="">選擇縣市</option>
                     <option v-for="city in cityList" :key="city" :value="city">{{ city }}</option>
                  </select>
                  <div class="downIcon"></div>
               </div>
               <div class="selectOuter">
                  <select class="form-control" v-model="areaInfo.district">
                     <option value="">選擇地區</option>
                     <option 
                        v-for="district in districtList" 
                        :key="district" 
                        :value="district">
                        {{ district }}
                     </option>
                  </select>
                  <div class="downIcon"></div>
               </div>
            </div>  
         </div>
      </div>`
});