import TableHeader from './TableHeader.js';
import TableCell from './TableCell.js';
export default class ResizedTable {
   constructor(props) {
      this.tableEl = document.querySelector(props.el);
      this.tableLine = document.querySelector(props.tableLine);
      this.tableHeaderData = props.tableHeaderData;
      this.tableCellData = props.tableCellData;
      this.cellBlackList = props.cellBlackList;
      this.headerArr = []; //儲存tableHeader
      this.cellArr = [];
      this.changeTable = true;
      this.startX = 0;
      this.minWidth = 100;
      this.maxWidth = 0;
      this.targetThWidth = 0;
      this.targetTh = null;
      this.moveDsitance = 0;
      this.tableLineLeft = 0;
      this.tempMouseMove = null;
      this.tempMouseUp = null;
      this.init();
   }
   init() {
      this.tableWidth = this.tableEl.offsetWidth;
      this.maxWidth = this.changeTable ? Infinity : 0;
      this.createTableHeader();
      this.createTableCell();
   }
   createTableHeader() {
      let tr = document.createElement('tr');
      this.tableHeaderData.forEach(item => {
         let instance = new TableHeader({
            source: item,
            onMouseDown: (payload) => {
               this.mouseDownHandler(payload);
            }
         });
         let dom = instance.createTemplate();
         tr.appendChild(dom);
         this.headerArr.push({ headerId: item.id, instance });
      });
      this.tableEl.querySelector('thead').appendChild(tr);
   }
   createTableCell() {
      this.tableCellData.forEach(item => {
         let tr = document.createElement('tr');
         for (let key in item) {
            if (this.cellBlackList.includes(key)) continue;
            let instance = new TableCell({
               uid: item.uid.value,
               info: item[key]
            });
            let dom = instance.createTemplate();
            tr.append(dom);
         }
         this.tableEl.querySelector('tbody').appendChild(tr);
      });
   }
   mouseDownHandler(payload) {
      if (!this.changeTable) this.calculateMaxWidth(payload.headerId);
      this.targetTh = payload.thEl;
      this.targetThWidth = payload.thEl.offsetWidth;
      this.startX = payload.pageX;
      this.setTableLineStartPosition(payload.headerId);
      let mouseMoveFn = this.tempMouseMove = this.mouseMoveHandler.bind(this);
      let mouseUpFn = this.tempMouseUp = this.mouseUpHandler.bind(this);
      document.addEventListener('mousemove', mouseMoveFn);
      document.addEventListener('mouseup', mouseUpFn);
   }
   calculateMaxWidth(headerId) { //計算最大寬度
      let index = this.headerArr.findIndex(item => item.headerId === headerId);
      let nextArr = this.headerArr.slice(index + 1);
      let nextTotlaWidth = nextArr.length * this.minWidth;
      this.maxWidth = this.tableWidth - nextTotlaWidth;
   }
   setTableLineStartPosition(headerId) {
      let index = this.headerArr.findIndex(item => item.headerId === headerId);
      let arr = this.headerArr.slice(0, index + 1);
      let distance = arr.reduce((prev, current) => {
         prev += current.instance.th.offsetWidth;
         return prev;
      }, 0);
      this.tableLineLeft = distance;
      this.tableLine.style.left = `${distance}px`;
      this.tableLine.classList.add('show');
   }
   mouseMoveHandler(evt) {
      this.moveDsitance = evt.pageX - this.startX;
      let updatePos = this.targetThWidth + this.moveDsitance;
      //当表格拖拽在合理范围内时，即大于 minWidth 并且小于 maxWidth时
      if (updatePos >= this.minWidth && updatePos <= this.maxWidth) {
         this.tableLine.style.left = `${this.tableLineLeft + this.moveDsitance}px`;
      }
   }
   setThWidth() {
      let newWidth = this.targetThWidth + this.moveDsitance;
      this.targetTh.style.width = `${newWidth}px`;
      if (newWidth < this.minWidth) {
         // 当表格的宽度被限制的时候，如果最终计算的表格不符合实际宽度，则设置为实际宽度
         this.targetTh.style.width = `${this.minWidth}px`;
      } else if (this.changeTable && newWidth > this.maxWidth) {
         this.targetTh.style.width = `${this.maxWidth}px`;
      }
   }
   setTableWidth() {
      if (!this.changeTable) return;
      let currentTableWidth = this.tableEl.offsetWidth;
      console.log(currentTableWidth)
      let newTableWidth = currentTableWidth + this.moveDsitance;
      let result = newTableWidth < this.tableWidth ? this.tableWidth : newTableWidth;
      this.tableEl.style.width = `${result}px`;
   }
   mouseUpHandler() {
      this.setThWidth();
      this.setTableWidth();
      this.tableLine.classList.remove('show');
      document.removeEventListener('mousemove', this.tempMouseMove);
      document.removeEventListener('mouseup', this.tempMouseUp);
      this.tempMouseMove = null;
      this.tempMouseUp = null;
   }
}