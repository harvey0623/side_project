export default class Toastr {
   constructor(props) {
      this.toastrObj = props.toastrObj;
      this.toastrObj.options.timeOut = 3000;
      this.toastrObj.options.preventDuplicates = true;
   }
   setInfo({ text }) {
      this.toastrObj.info(text);
   }
   setError({ text }) {
      this.toastrObj.error(text);
   }
   setSuccess({ text }) {
      this.toastrObj.success(text);
   }
}