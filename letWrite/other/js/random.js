const apiUrl = 'https://spreadsheets.google.com/feeds/list/11wLZL0bNoD7ZQwfN3Tkx41YB6IgLbv4ftsrxywA0114/1/public/values?alt=json';

new Vue({
   el: '#app',
   data: () => ({
      foodList: [],
      isMeat: true,
      isClick: false
   }),
   computed: {
      vegetableList() {
         if (this.foodList.length === 0) return [];
         return this.doCategory('否');
      },
      meetList() {
         if (this.foodList.length === 0) return [];
         return this.doCategory('是');
      },
      drawList() {
         return this.isMeat ? this.meetList : this.vegetableList;
      },
      runAnimate() {
         return { [`span-${this.drawList.length - 1}`]: this.isClick }
      }
   },
   methods: {
      getData() {
         return axios.get(apiUrl);
      },
      doCategory(condition) {
         return this.foodList.filter(food => food.gsx$vage['$t'] === condition)
            .map(item => ({ id: item.id.$t, shopName: item.gsx$shops.$t }))
      },
      getRandomNumber() {
         let min = 0;
         let length = this.drawList.length - 1;
         return Math.floor(Math.random() * (length - min + 1)) + min;
      },
      drawHandler() {
         if (this.isClick) return;
         this.isClick = true;
         console.log(this.getRandomNumber());
      }
   },
   async mounted() {
      this.foodList = await this.getData().then(res => res.data.feed.entry);
   }
});


