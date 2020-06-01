export default class SlickController {
   constructor(props) {
      this.slickBoxEl = document.querySelector(props.slickBoxEl);
      this.$slick = $(this.slickBoxEl);
      this.init();
   }
   init() {
      this.$slick.slick({
         arrows: false,
         autoplay: true,
         autoplaySpeed: 3000,
      });
   }
   update(data) {
      let template = '';
      data.forEach(item => {
         let url = item.vUrl ? item.vUrl : 'javascript:;';
         template += `
            <div>
               <a href="${url}">
                  <img src="${item.vImages[0]}">
               </a>
            </div>`;
      });
      this.$slick.slick('slickPause');
      this.$slick.slick('slickRemove', null, null, true);
      this.$slick.slick('slickAdd', template);
      this.$slick.slick('slickPlay');
   }
}