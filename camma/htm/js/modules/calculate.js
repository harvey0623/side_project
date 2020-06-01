export default class Calculate {
   constructor(props) {
      this.infoData = props.infoData;
      this.countInstance = props.countInstance;
   }
   reachedLimit() {  //確認是否達到上限
      let userData = this.countInstance.getUserData();
      let sum = userData.reduce((prev, current) => {
         prev += current.count;
         return prev;
      }, 0);
      return {
         status: sum === this.infoData.packageMaxNumber,
         userData
      }
   }
}