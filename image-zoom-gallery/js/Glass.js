export default class Glass {
   constructor(props) {
      this.glass = document.querySelector('.glass');
      this.size = props.size;
      this._active = false;
      this.setSize();
   }
   setSize() {
      this.glass.style.width = this.size.width + 'px';
      this.glass.style.height = this.size.height + 'px';
   }
   setAvtive(val) {
      let method = val ? 'add' : 'remove';
      this.glass.classList[method]('active');
   }
   setPos({ x, y }) {
      this.glass.style.left = x + 'px';
      this.glass.style.top = y + 'px';
   }
   get active() {
      return this._active;
   }
   set active(val) {
      this._active = val;
      this.setAvtive(val);
   }
}