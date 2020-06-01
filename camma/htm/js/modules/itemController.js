export default class ItemController {
   constructor(props) {
      this.itemBoxEl = document.querySelector(props.itemBoxEl);
   }
   dollarCamma(num) {  //千分位符號
      if (typeof num !== 'number') throw new TypeError('variable must be number');
      let n = 0;
      let x = 3;
      let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
      return num.toFixed(Math.max(0, n)).replace(new RegExp(re, 'g'), '$&,');
   }
   render(data) {
      this.itemBoxEl.innerHTML = '';
      let template = '';
      data.forEach(obj => {
         //vCategoryName 團購單字(取第一個字), iSpecProductStock, iSpecStock庫存
         let { info, category, url, iProductBuyMinPrice } = obj;
         let { vCategoryName, vCss, iSpecProductStock, iSpecStock } = category;
         let character = vCategoryName.slice(0, 1);
         let noStock = iSpecProductStock <= 0 || iSpecStock <= 0;
         template += `
            <div class="product-block">
               <a href="${url}">
                  <div class="imgBox">
                     <img src="${info.vImages[0]}" alt="">
                     <div class="label-box ${noStock ? 'show' : ''}">
                        <div>售完<br>SOLD OUT</div>
                     </div>
                  </div>
                  <div class="descBox ellipsis">${info.vProductName}</div>
                  <div class="categoryCircle" style="background-color:${vCss};">${character}</div>
               </a>
               <div class="price-box">
                  <div class="price-sub">
                     <span>TWD</span>
                     <span>${this.dollarCamma(iProductBuyMinPrice)}</span>
                  </div>
               </div>
               <div class="button-box">
                  <a href="${url}" class="orange-btn">選購</a>
               </div>
               <div class="sub-box ellipsis">${info.vProductSummary}</div>
            </div>`;
      });
      this.itemBoxEl.innerHTML = template;
   }
}