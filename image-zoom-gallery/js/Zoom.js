export default class Zoom {
   constructor(props) {
      this.zoom = document.querySelector('.zoomBox');
      this._active = false;
   }
   setBgImg(url) {
      this.zoom.style.backgroundImage = `url(${url})`;
   }
   setBgSize({ x, y }) {
      this.zoom.style.backgroundSize = `${x}px ${y}px`;
   }
   setPos({ x, y }) {
      this.zoom.style.backgroundPosition = `-${x}px -${y}px`;
   }
   setActive(val) {
      let method = val ? 'add' : 'remove';
      this.zoom.classList[method]('active');
   }
   get active() {
      return this._active;
   }
   set active(val) {
      this._active = val;
      this.setActive(val);
   }
}