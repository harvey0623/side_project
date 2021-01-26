export default class ResizeItem {
   constructor(props) {
      this.el = null;
      this.limitW = props.limitW;
      this.limitH = props.limitH;
      this.isDown = false;
      this.currentPos = { x: 0, y: 0 };
      this.currentSize = { w: 0, h: 0 };
      this.mousemoveFunc = this.mousemoveHandler.bind(this);
      this.mouseupFunc = this.mouseupHandler.bind(this);
   }
   renderHtml() {
      this.el = document.createElement('div');
      this.el.classList.add('resizable');
      this.el.innerHTML = `
         <div class="resizer resizer-r"></div>
         <div class="resizer resizer-b"></div>`;
      this.el.querySelectorAll('.resizer').forEach(item => {
         item.addEventListener('mousedown', this.mousedownHandler.bind(this));
      });
      return this.el;
   }
   mousedownHandler(evt) {
      this.isDown = true;
      this.currentPos.x = evt.clientX;
      this.currentPos.y = evt.clientY;
      this.currentSize.w = this.el.getBoundingClientRect().width;
      this.currentSize.h = this.el.getBoundingClientRect().height;
      document.addEventListener('mousemove', this.mousemoveFunc);
      document.addEventListener('mouseup', this.mouseupFunc);
   }
   mousemoveHandler(evt) {
      let { clientX, clientY } = evt;
      let { newWidth, newHeight } = this.calculateSize(clientX, clientY);
      this.el.style.width = `${newWidth}px`;
      this.el.style.height = `${newHeight}px`;
   }
   calculateSize(clientX, clientY) {
      let diffX = clientX - this.currentPos.x;
      let diffY = clientY - this.currentPos.y;
      let newWidth = this.currentSize.w + diffX;
      let newHeight = this.currentSize.h + diffY;
      let offsetLeft = this.el.offsetLeft;
      let offsetTop = this.el.offsetTop;
      if (offsetLeft + newWidth >= this.limitW) {
         newWidth = this.limitW - offsetLeft;
      }
      if (offsetTop + newHeight >= this.limitH) {
         newHeight = this.limitH - offsetTop;
      }
      return { newWidth, newHeight };
   }
   mouseupHandler() {
      this.isDown = false;
      document.removeEventListener('mousemove', this.mousemoveFunc);
      document.removeEventListener('mouseup', this.mouseupFunc);
   }
}