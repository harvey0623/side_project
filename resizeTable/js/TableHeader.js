export default class TableHeader {
   constructor(props) {
      this.th = null;
      this.source = props.source;
      this.onMouseDown = props.onMouseDown;
      this.createTemplate();
   }
   createTemplate() {
      this.th = document.createElement('th');
      let resizeLine = document.createElement('span');
      resizeLine.classList.add('resize-line');
      this.th.textContent = this.source.title;
      this.th.appendChild(resizeLine);
      resizeLine.addEventListener('mousedown', this.mousedownHandler.bind(this));
      return this.th;
   }
   mousedownHandler(evt) {
      this.onMouseDown({
         headerId: this.source.id,
         thEl: this.th,
         pageX: evt.pageX
      });
   }
}