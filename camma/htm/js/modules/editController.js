export default class EditController {
   constructor(props) {
      this.topEl = document.querySelector(props.topEl);
      this.bottomEl = document.querySelector(props.bottomEl);
   }
   render(pageArr) {
      this.topEl.innerHTML = '';
      this.bottomEl.innerHTML = '';
      pageArr.forEach(data => {
         let { iType, vDetail } = data;
         if (iType === 1) this.topEl.innerHTML = vDetail;
         if (iType === 2) this.bottomEl.innerHTML = vDetail;
      });
   }
}