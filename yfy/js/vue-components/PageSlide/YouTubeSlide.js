Vue.component('youtube-slide', {
   props: {
      url: {
         type: String,
         required: true
      }
   },
   computed: {
      youtubeId() {
         let arr = this.url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  			return (arr[2] !== undefined) ? arr[2].split(/[^0-9a-z_\-]/i)[0] : arr[0];
      },
   },
   methods: {
      createPlayer() {
         let player = new YT.Player(this.$refs.iframe, {
            videoId: this.youtubeId,
         });
         this.$emit('player', player);
      }
   },
   mounted() {
      this.createPlayer();
   },
   template: `
      <div class="swiper-slide">
         <div ref="iframe"></div>   
      </div>`
});