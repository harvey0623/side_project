Vue.component('term-list', {
   props: {
      term: {
         type: Object,
         required: true
      },
      pageurl: {
         type: String,
         required: true
      }
   },
   computed: {
      link() {
         return `${this.pageurl}?id=${this.term.id}`;
      }
   },
   template: `
      <a :href="link">
         <div class="title">{{ term.title }}</div>
         <div class="arrowBox"></div>
      </a>`
});