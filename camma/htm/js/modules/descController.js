export default class DescController {
   constructor(props) {
      this.descBoxEl = document.querySelector(props.descBoxEl);
      this.descData = props.descData;
      this.renderHtml();
   }
   renderHtml() {
      let template = '';
      this.descData.forEach(item => {
         template += `
            <div class="descRow">
               <div class="descL">
                  <i class="fas fa-circle"></i>
               </div>
               <div class="descR">${item}</div>
            </div>`;
      });
      this.descBoxEl.innerHTML = template;
   }
}