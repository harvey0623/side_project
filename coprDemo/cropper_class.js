let PhotoCrop = (function ($, Cropper) {
    class PhotoCrop {
        constructor(props) {
            this._fileInput = PhotoCrop.getDom(props.fileInput);
            this._cropImg = PhotoCrop.getDom(props.cropImg);
            this._photoFrame = PhotoCrop.getDom(props.photoFrme);
            this._$cropModal = props.$cropModal;
            this._maxFileSzie = props.maxFileSzie;
            this._cropper = null;
            this._output = null;
            this._cropOption = props.cropOption;
            this._cropOutputOption = props.cropOutputOption;
            this._bsShowCallback = props.bsShowCallback;
            this._bsHideCallback = props.bsHideCallback;
            this.bindEvent();
        }
        static getDom(class_name) {
            let el = document.querySelector(class_name);
            if (!el) throw new Error('can\'t not found the DOM');
            return el;
        }
        bindEvent() {
            this._fileInput.addEventListener('change', this.localUpload.bind(this));
            this._$cropModal.on('shown.bs.modal', this.bsShown.bind(this));
            this._$cropModal.on('hidden.bs.modal', this.bsHidden.bind(this));
            this._$cropModal.modal({ backdrop: 'static', show: false });
        }
        localUpload() {
            let file = event.target.files[0];
            if (!file) return;  //按取消上傳照片會傳回undefined
            let isValid = this.checkFormat(file);
            if (isValid) {
                this._cropImg.onload = () => this._$cropModal.modal('show');
                this._cropImg.src = URL.createObjectURL(file);
            } else {
                console.log('不符合上傳格式');
            }
            this._fileInput.value = '';
        }
        checkFormat(fileObj) {
            let formatRule = /^image\/(jpg|jpeg|png)/;
            let isValidType = formatRule.test(fileObj.type);
            let isValidSize = (fileObj.size / 1024 / 1024) <= this._maxFileSzie;
            return isValidType && isValidSize;
        }
        bsShown(event) {
            this.cropInit();
            if (typeof this._bsShowCallback === 'function') this._bsShowCallback();
        }
        bsHidden(event) {
            this.destroyCrop();
            if (typeof this._bsHideCallback === 'function') this._bsHideCallback();
        }
        cropInit() {
            this._cropper = new Cropper(this._cropImg, this._cropOption);
        }
        confirmCrop() {
            if (this._cropper === null) return;
            let canvas = this._cropper.getCroppedCanvas(this._cropOutputOption);
            this.output = canvas.toDataURL('image/jpeg');
            return this.output;
        }
        destroyCrop() {
            this._cropper.destroy();
            this._cropper = null;
            this._cropImg.src = '';
        }
        get output() {
            return this._output;
        }
        set output(val) {
            this._photoFrame.style.backgroundImage = `url(${val})`;
            this._output = val;
        }
    }
    return PhotoCrop;
})($, Cropper);

export default PhotoCrop;