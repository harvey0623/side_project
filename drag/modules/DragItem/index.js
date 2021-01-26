export default class DragItem {
   constructor(props) {
      this.el = null;
      this.isDown = false;
      this.currentPos = { x: 0, y: 0 };
      this.limitW = props.limitW;
      this.limitH = props.limitH;
      this.mousemoveFunc = this.mousemoveHandler.bind(this);
      this.mouseupFunc = this.mouseupHandler.bind(this);
   }
   renderHtml() {
      this.el = document.createElement('div');
      this.el.classList.add('dragItem');
      this.el.addEventListener('mousedown', this.mousedownHandler.bind(this));
      return this.el;
   }
   mousedownHandler(evt) {
      this.isDown = true;
      this.currentPos.x = evt.clientX;
      this.currentPos.y = evt.clientY; 
      document.addEventListener('mousemove', this.mousemoveFunc);
      document.addEventListener('mouseup', this.mouseupFunc);
   }
   mousemoveHandler(evt) {
      if (!this.isDown) return;
      let { clientX, clientY } = evt;
      let { newPosX, newPosY } = this.calculatePos(clientX, clientY);
      this.el.style.left = `${newPosX}px`;
      this.el.style.top = `${newPosY}px`;
      this.currentPos.x = clientX;
      this.currentPos.y = clientY;
   }
   calculatePos(clientX, clientY) {
      let diffX = clientX - this.currentPos.x;
      let diffY = clientY - this.currentPos.y;
      let offsetLeft = this.el.offsetLeft;
      let offsetTop = this.el.offsetTop;
      let newPosX = offsetLeft + diffX;
      let newPosY = offsetTop + diffY;
      if (newPosX + this.el.offsetWidth >= this.limitW) {
         newPosX = this.limitW - this.el.offsetWidth;
      }
      if (newPosY + this.el.offsetHeight >= this.limitH) {
         newPosY = this.limitH - this.el.offsetHeight;
      }
      if (newPosX <= 0) newPosX = 0;
      if (newPosY <= 0) newPosY = 0;
      return { newPosX, newPosY };
   }
   mouseupHandler() {
      this.isDown = false;
      document.removeEventListener('mousemove', this.mousemoveFunc);
      document.removeEventListener('mouseup', this.mouseupFunc);
   }
}