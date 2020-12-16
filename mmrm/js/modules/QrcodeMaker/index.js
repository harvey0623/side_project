export default class QrcodeMaker {
   constructor(props) {
      this.instance = null;
      this.rootEl = document.querySelector(props.rootEl);
      this.text = props.text;
      this.width = props.width || 230;
      this.height = props.height || 230;
      this.init();
   }
   init() {
      this.instance = new QRCode(this.rootEl, {
         text: this.text,
         width: this.width,
         height: this.height,
         colorDark : '#000000',
         colorLight : '#ffffff',
         correctLevel : QRCode.CorrectLevel.H
      });
   }
}