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
      <li>
         <div class="title">{{ term.title }}</div>
         <a :href="link" class="arrowBox"></a>
      </li>`
});