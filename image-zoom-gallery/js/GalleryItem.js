export default class CalleryItem {
   constructor(props) {
      this.orderIndex = props.orderIndex;
      this.galleryId = props.galleryId;
      this.imgUrl = props.imgUrl;
      this.clickCb = props.clickCb;
      this.el = null;
   }
   createTemplate() {
      this.el = document.createElement('div');
      this.el.classList.add('galleryItem');
      this.el.innerHTML = `<img src="${this.imgUrl}" alt="">`;
      this.el.addEventListener('click', this.clickHandler.bind(this));
      return this.el;
   }
   clickHandler() {
      this.clickCb(this.orderIndex);
   }
   setActive(index) {
      let method = index === this.orderIndex ? 'add' : 'remove';
      this.el.classList[method]('active');
   }
}