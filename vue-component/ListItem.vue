<template>
   <li 
      class="listItem" 
      @click="clickHandler"
   >{{ title }}</li>
</template>

<script>
module.exports = {
   props: {
      listId: {
         type: String,
         required: true
      },
      title: {
         type: String,
         required: true
      }
   },
   methods: {
      clickHandler() {
         this.$emit('remove', { id: this.listId });
      }
   },
   mounted() {
      let person = new window.Person();
   },
   beforeDestroy() {
      console.log(this);
   }
};
</script>