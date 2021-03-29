export default class ScanPopup {
   constructor(props) {
      this.el = document.querySelector(props.el);
      this.canvas = this.el.querySelector('#canvas');
      this.ctx = this.canvas.getContext('2d');
      this.video = this.el.querySelector('#video');
      this.closeItem = this.el.querySelector('.closeItem');
      this.scanner = null;
		this.animateFrame = null;
		this.isScan = false;
      this.isFirstOpen = true;
      this.scanEvent = props.scanEvent;
      this.bindEvent();
   }
   bindEvent() {
      this.closeItem.addEventListener('click', () => {
         this.display(false);
      });
   }
   async display(isOpen) {
      this.el.style.display = isOpen ? 'block' : 'none';
      if (isOpen) {
         this.getMedia();
      } else {
         cancelAnimationFrame(this.animateFrame);
         this.video.pause();
         this.isScan = false;
      }
   }
   drawLine(begin, end) {
      this.ctx.beginPath();
      this.ctx.moveTo(begin.x, begin.y);
      this.ctx.lineTo(end.x, end.y);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#FF3B58';
      this.ctx.stroke();
   }
   tick() {
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
         let size = { w: 300, h: 300 };
         this.canvas.classList.remove('notActive');
         this.ctx.drawImage(this.video, 0, 0, size.w, size.h);
         let { data, width, height } = this.ctx.getImageData(0, 0, size.w, size.h);
         let code = jsQR(data, width, height, {
            inversionAttempts: 'dontInvert',
         });
         if (code) {
            this.isScan = true;
            let { topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner } = code.location;
            this.drawLine(topLeftCorner, topRightCorner);
            this.drawLine(topRightCorner, bottomRightCorner);
            this.drawLine(bottomRightCorner, bottomLeftCorner);
            this.drawLine(bottomLeftCorner, topLeftCorner);
            alert(code.data);
            cancelAnimationFrame(this.animateFrame);
            this.video.pause();
            this.scanEvent(code.data);
            this.display(false);
         }
      }
      if (!this.isScan) {
         this.animateFrame = requestAnimationFrame(() => {
            this.tick();
         });
      }
   }
   async getMedia() {
      try {
         let stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
         });
         this.video.srcObject = stream;
         this.video.play();
         this.animateFrame = requestAnimationFrame(() => {
            this.tick();
         });
      } catch(err) {
         alert('您未開起相機功能')
      }
   }
}