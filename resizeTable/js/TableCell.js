export default class TableCell {
   constructor(props) {
      this.td = null;
      this.uid = props.uid;
      this.info = props.info;
      this.iconInfo = {
         yes: 'fa-pencil-square-o',
         no: 'fa-unlock-alt'
      };
   }
   createTemplate() {
      this.td = document.createElement('td');
      this.td.textContent = this.info.value;
      let iTag = document.createElement('i');
      let iconKey = this.info.editable ? 'yes' : 'no';
      iTag.classList.add('fa', this.iconInfo[iconKey]);
      iTag.setAttribute('aria-hidden', 'true');
      if (this.info.editable) {
         iTag.addEventListener('click', this.editHandler.bind(this));
      }
      this.td.appendChild(iTag);
      return this.td;
   }
   editHandler() {
      console.log(this.uid);
      console.log(this.info.value);
   }
}