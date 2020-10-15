Vue.component('thumb', {
   props: {
      timestamp: {
         type: Number,
         required: true
      },
      imgUrl: {
         type: String,
         required: true
      },
      fileObj: {
         required: true,
      }
   },
   data: () => ({
      progress: 0,
      isUploaded: false,
      isEnter: false
   }),
   computed: {
      barWidth() {
         return { width: this.progress + 'px' }
      }
   },
   methods: {
      async uploadToServer() {
         let formData = new FormData();
         formData.append('file', this.fileObj);
         return await axios({
            url: 'https://api.cloudinary.com/v1_1/joezimim007/image/upload',
            method: 'post',
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
            onUploadProgress: (evt) => {
               this.calculateProgress(evt.loaded, evt.total);
            }
         }).then(res => {
            return res.data;
         });
      },
      calculateProgress(loaded, total) {
         this.progress = (loaded / total) * 100;
         if (this.progress === 100) this.isUploaded = true;
      },
      mouseEnter() {
         if (this.isUploaded) this.isEnter = true;
      },
      removeThumb() {
         this.$emit('remove', this.timestamp);
      }
   },
   created() {
      if (this.fileObj === null) {
         this.isUploaded = true;
         this.progress = 100;
      }
   },
   mounted() {
      if (!this.isUploaded) this.uploadToServer();
   },
   template: `
      <div
         class="thumb"
         @mouseenter="mouseEnter"
         @mouseleave="isEnter = false">
         <div class="imgBox">
            <img :src="imgUrl">
         </div>
         <div class="progressBox" :class="{active:!isUploaded}">
            <div class="progressBar">
               <div class="bar" :style="barWidth"></div>
            </div>
         </div>
         <div class="removeBox" :class="{active:isEnter}">
            <i class="las la-times" @click="removeThumb"></i>
         </div>   
      </div>`
});