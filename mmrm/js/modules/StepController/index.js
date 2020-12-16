class StepController {
   constructor(props) {
      this.duration = props.duration;
      this.setp1_key = 'step1';
      this.setp2_key = 'step2';
      this.timestampKey = 'timestamp';
      this.termKey = 'term';
   }
   setLS(key, value) {
      let isObject = this.checkIsObject(value);
      if (!isObject) throw new Error('value must be object');
      localStorage.setItem(key, JSON.stringify(value));
   }
   getLS(key) {
      let data = localStorage.getItem(key);
      return data !== null ? JSON.parse(data) : null;
   }
   removeLS(key) {
      localStorage.removeItem(key);
   }
   checkIsObject(value) {
      let isObject = value && typeof value === 'object' && value.constructor === Object;
      let isArray = Array.isArray(value);
      return isObject || isArray;
   }
   checkHasTimestamp() {
      return this.getLS(this.timestampKey) !== null;
   }
   checkIsExpire() {
      let hasTimestamp = this.checkHasTimestamp();
      if (!hasTimestamp) return true;
      let now = new Date().getTime();
      let recordTime = this.getLS(this.timestampKey).time;
      return (recordTime + this.duration) < now;
   }
   setTimestamp() {
      this.setLS(this.timestampKey, { time: new Date().getTime() });
   }
   setStep1(data) {
      this.setLS(this.setp1_key, data);
   }
   setStep2(data) {
      this.setLS(this.setp2_key, data);
   }
   setTerm(data) {
      this.setLS(this.termKey, data);
   }
   clearAll() {
      let keyArr = [this.timestampKey, this.setp1_key, this.setp2_key, this.termKey];
      keyArr.forEach(key => this.removeLS(key));
   }
   getTerm() {
      return this.getLS(this.termKey);
   }
}