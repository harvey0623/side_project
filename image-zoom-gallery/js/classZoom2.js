import Glass from './Glass.js';
import Zoom from './Zoom.js';
import GalleryItem from './GalleryItem.js';
export default class ImageZoom {
   constructor(props) {
      this.sourceBox = document.querySelector(props.sourceBox);
      this.sourceImg = this.sourceBox.querySelector('img');
      this.gallery = document.querySelector(props.gallery);
      this.zoomBox = document.querySelector(props.zoomBox);
      this.glassSize = props.glassSize;
      this.zoomSize = props.zoomSize;
      this.glass = new Glass({ size: props.glassSize });
      this.zoom = new Zoom({ size: props.zoomSize });
      this.ratio = { x: 1, y: 1 };
      this.images = props.images;
      this._index = 0;
      this.galleryArr = [];
      this.bindEvent();
      this.init();
   }
   bindEvent() {
      this.sourceBox.addEventListener('mouseenter', this.enterHandler.bind(this));
      this.sourceBox.addEventListener('mouseleave', this.leaveHandler.bind(this));
      this.sourceBox.addEventListener('mousemove', this.moveHandler.bind(this));
      this.gallery.addEventListener('mousewheel', this.scrollHorizontally);
      this.gallery.addEventListener('DOMMouseScroll', this.scrollHorizontally);
   }
   init() {
      this.updateRatio();
      this.createGallery();
      this.setBackgroundPosition();
      this.index = 0;
   }
   enterHandler() {
      this.glass.active = true;
      this.zoom.active = true;
   }
   leaveHandler() {
      this.glass.active = false;
      this.zoom.active = false;
   }
   scrollHorizontally(evt) { //橫向移動捲軸
      evt.preventDefault();
      let delta = Math.max(-1, Math.min(1, evt.wheelDelta || -evt.detail));
      evt.currentTarget.scrollLeft -= delta * 50;
   };
   updateRatio() {
      this.ratio = {
         x: this.zoomSize.width / this.glassSize.width,
         y: this.zoomSize.height / this.glassSize.height,
      };
   }
   createGallery() {
      this.images.forEach((item, index) => {
         let instance = new GalleryItem({
            orderIndex: index,
            galleryId: item.id,
            imgUrl: item.url,
            clickCb: (val) => this.index = val
         });
         this.gallery.appendChild(instance.createTemplate());
         this.galleryArr.push(instance);
      });
   }
   setBackgroundPosition() {
      this.zoom.setBgSize({
         x: this.sourceImg.clientWidth * this.ratio.x,
         y: this.sourceImg.clientHeight * this.ratio.y
      });
   }
   moveHandler(evt) {
      let cursorPos = this.getCursorPos(evt);
      let movePos = this.getMovePos(cursorPos);
      this.setPosition(movePos);
   }
   getCursorPos(evt) {
      let boundingPos = this.sourceBox.getBoundingClientRect();
      let x = evt.pageX - boundingPos.left - window.pageXOffset;
      let y = evt.pageY - boundingPos.top - window.pageYOffset;
      return { x, y };
   }
   getMovePos(pos) {
      let x = pos.x - this.glassSize.width / 2;
      let y = pos.y - this.glassSize.height / 2;
      let imgWidth = this.sourceBox.clientWidth;
      let imgHeight = this.sourceBox.clientHeight;
      if (x > imgWidth - this.glassSize.width) x = imgWidth - this.glassSize.width;
      if (x <= 0) x = 0;
      if (y > imgHeight - this.glassSize.height) y = imgHeight - this.glassSize.height;
      if (y <= 0) y = 0;
      return { x, y };
   }
   setPosition(pos) {
      this.glass.setPos(pos);
      this.zoom.setPos({ 
         x: pos.x * this.ratio.x,
         y: pos.y * this.ratio.y
      });
   }
   setImageUrl() {
      let obj = this.images[this.index];
      this.sourceImg.src = obj.url;
      this.zoom.setBgImg(obj.url);
   }
   setActiveGallery() {
      this.galleryArr.forEach(item => {
         item.setActive(this.index);
      });
   }
   get index() {
      return this._index;
   }
   set index(val) {
      this._index = val;
      this.setImageUrl();
      this.setActiveGallery();
   }
}