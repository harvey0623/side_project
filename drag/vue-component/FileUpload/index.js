Vue.component('file-upload', {
   props: {
      options: {
         type: Object,
         required: true
      }
   },
   data: () => ({
      uploadList: [
         // { timestamp: 1324, imgUrl: '../../image/cat2.jpg', file: null }
      ],
      isActive: false
   }),
   computed: {
      totalUpload() {
         return this.uploadList.length;
      },
      hasUploadFile() {
         return this.totalUpload > 0;
      },
      remainingFile() {
         return this.options.maxFiles - this.totalUpload;
      }
   },
   methods: {
      clickFileElement() {
         this.$refs.myfile.click();
      },
      triggerFile(evt) {
         let evtTarget = evt.target;
         let canClick = evtTarget === evt.currentTarget || evtTarget === this.$refs.previewBox;
         if (canClick) this.clickFileElement();
      },
      cancelDefault(evt) {
         evt.preventDefault();
         evt.stopPropagation();
      },
      heightlight(evt) {
         this.cancelDefault(evt);
         this.isActive = evt.type !== 'dragleave';
      },
      selectFile(evt) {
         let files = Array.from(evt.target.files);
         this.handleFiles(files);
      },
      dropHandler(evt) {
         this.cancelDefault(evt);
         this.isActive = false;
         let files = Array.from(evt.dataTransfer.files);
         this.handleFiles(files);
      },
      handleFiles(files) { //檔案檢查&處理
         let formatResult = this.checkFormt(files);
         let remainResult = this.checkRemainingFile(files);
         let sizeResult = this.checkFileSize(files);
         let gatherResult = [formatResult, remainResult, sizeResult];
         let hasError = gatherResult.some(item => item.status === false);
         if (hasError) {
            let errObj = gatherResult.find(item => item.status === false);
            this.$emit('invalid', errObj);
         } else {
            this.$emit('invalid', { status: true, message: '' });
            files.forEach(this.previewProfile);
         }
      },
      checkFormt(files) { //檢查格式
         let result = files.every(file => {
            let text = file.name.split('.').pop();
            return this.options.extensions.includes(text);
         });
         return {
            status: result,
            message: result ? '' : this.options.error.format
         };
      },
      checkRemainingFile(files) { //檢查剩餘檔案數量
         let result = files.length <= this.remainingFile;
         return {
            status: result,
            message: result ? '' : this.options.error.quantity
         };
      },
      checkFileSize(files) { //檢查檔案大小
         let result = files.every(file => {
            return (file.size / 1024 / 1024) <= this.options.maxSize;
         });
         return {
            status: result,
            message: result ? '' : this.options.error.size
         };
      },
      previewProfile(file, index) {
         let reader = new FileReader();
         reader.addEventListener('load', (evt) => {
            this.uploadList.push({
               timestamp: Date.now() + (index * 2),
               imgUrl: evt.target.result,
               file
            });
         });
         reader.readAsDataURL(file);
      },
      removeHandler(val) {
         let index = this.uploadList.findIndex(item => item.timestamp === val);
         this.uploadList.splice(index, 1);
      }
   },
   watch: {
      totalUpload: {
         immediate: true,
         handler(val) {
            this.$emit('quantity', val);
         }
      }
   },
   template: `
      <div
         id="drop-area"
         :class="{active:isActive}"
         @drop="dropHandler"
         @dragenter="heightlight"
         @dragleave="heightlight"
         @dragover="heightlight">
         <div
            class="my-form" 
            :class="{active:hasUploadFile}" 
            @click="triggerFile">
            <p v-show="!hasUploadFile">Choose file / Drag file</p>
            <div class="previewBox" ref="previewBox">
               <thumb
                  v-for="item in uploadList"
                  :key="item.timestamp"
                  :timestamp="item.timestamp"
                  :imgUrl="item.imgUrl"
                  :fileObj="item.file"
                  @remove="removeHandler"
               ></thumb>
            </div>
         </div>
         <input type="file" id="myfile" ref="myfile" @change="selectFile" multiple>
      </div>`
});