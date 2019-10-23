(function () {
    let cropImg = document.querySelector('#cropImg');
    let $cropModal = $('#cropModal');
    let partyCardUrl = null;
    let cropper = null;
    let fileName = '';


    function init() {
        $('#myFile').on('change', uploadHandler);
        $('.btnCrop').on('click', confirmCrop);
        $('.btnCancel').on('click', hideModal);
        $('.cutPhoto').on('click', cutUploadedPhoto);

        $cropModal.on('shown.bs.modal', function () {
            initCrop();
        });

        $cropModal.on('hidden.bs.modal', function () {
            destroyCrop();
        });
    }

    //檔案上傳
    function uploadHandler() {
        let file = this.files[0];
        if (!file) return false;  //按取消上傳照片會傳回undefined
        let isValid = checkFormat(file);
        if (!isValid) {
            return false;
        }

        cropImg.onload = () => {
            fileName = file.name;
            this.value = '';  //為了能重複上傳同一張圖所做的reset
            $cropModal.modal('show');
        }
        cropImg.src = URL.createObjectURL(file);
    }

    //檢查圖片格式
    function checkFormat(fileObj) {
        let rule = /^image\/(jpg|jpeg|png)/;
        let maxSize = 5;  //MB
        let isValidType = rule.test(fileObj.type);
        let isValidSize = (fileObj.size / 1024 / 1024) <= maxSize;
        return isValidType && isValidSize;
    }

    //啟動截圖套件
    function initCrop() {
        cropper = new Cropper(cropImg, {
            aspectRatio: 1,
            viewMode: 2,
            zoomable: false,
            zoomOnTouch: false,
            ready() {
                console.log('ready');
            },
        });
    }

    //確認截圖
    function confirmCrop() {
        if (!cropper) return false;
        let base64 = cropper.getCroppedCanvas({
            width: 500,
            height: 500,
            imageSmoothingQuality: 'high'
        }).toDataURL('image/jpeg');


        partyCardUrl = base64;
        hideModal();
    }

    //取消截圖
    function destroyCrop() {
        cropper.destroy();
        cropper = null;
    }

    //隱藏modal
    function hideModal() {
        $cropModal.modal('hide');
    }

    //取消已上傳裁切的圖片
    function cutUploadedPhoto() {
        partyCardUrl = null;
        fileName = '';
    }


    init();
})();