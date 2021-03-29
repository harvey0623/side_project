import QrScanner from "../../../lib/qr-scanner.min.js";
QrScanner.WORKER_PATH = '../../../lib/qr-scanner-worker.min.js';
export default class ScanPopup {
   constructor(props) {
      this.el = document.querySelector(props.el);
      this.camera = this.el.querySelector('#qr-video');
      this.closeItem = this.el.querySelector('.closeItem');
      this.scanner = null;
      this.isFirstOpen = true;
      this.scanEvent = props.scanEvent;
      this.bindEvent()
   }
   bindEvent() {
      this.closeItem.addEventListener('click', () => {
         this.display(false);
      });
   }
   async display(isOpen) {
      this.el.style.display = isOpen ? 'block' : 'none';
      if (this.isFirstOpen) {
         this.isFirstOpen = false;
         let hasCamera = await QrScanner.hasCamera();
         if (hasCamera) this.initScanner();
      }
      if (!isOpen) {
         if (this.scanner !== null) this.scanner.stop();
      }
   }
   initScanner() {
      this.scanner = new QrScanner(this.camera, (code) => {
         this.scanEvent(code);
         this.scanner.stop();
      });
      this.scanner.setInversionMode('both');
      this.scanner.start();
   }
}