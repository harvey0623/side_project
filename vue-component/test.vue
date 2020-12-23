<template>
   <div>
      <div class="home">{{ msg }}</div>
      <list-item
         v-for="list in lists"
         :key="list.id"
         :list-id="list.id"
         :title="list.title"
         @remove="removeHandler"
      ></list-item>
   </div>
</template>

<script>
module.exports = {
   props: {
      msg: {
         type: String,
         required: true
      }
   },
   data: () => ({
      lists: [
         { id: 'a', title: 'test1' },
         { id: 'b', title: 'test2' },
      ]
   }),
   methods: {
      removeHandler(payload) {
         let index = this.lists.findIndex(list => list.id === payload.id);
         this.lists.splice(index, 1);
      }
   },
   components: {
      'list-item': httpVueLoader('./ListItem.vue'),
   }
};
</script>
