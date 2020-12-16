export default class BarCodeMaker {
   constructor(props) {
      this.rootEl = props.rootEl;
      this.text = props.text;
      this.option = props.option || {};
      this.init();
   }
   init() {
      let basicOption = {
         width: 1.5,
			height: 50,
			displayValue: true,
         fontSize: 14,
         textMargin: 5,
         background: 'transparent'
      };
      JsBarcode(this.rootEl, this.text, {
         ...basicOption,
         ...this.option
      });
   }
}