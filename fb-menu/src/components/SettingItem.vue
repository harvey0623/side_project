<template>
   <div class="menu-item menu-item-setting" @click="settingHandler">
      <span class="circle">
         <i :class="icon" aria-hidden="true"></i>
      </span>
      <span class="settingText">{{ title }}</span>
      <i class="fa fa-angle-right" aria-hidden="true"></i>
   </div>
</template>

<script>
export default {
   props: {
      id: {
         type: String,
         required: true
      },
      title: {
         type: String,
         required: true
      },
      icon: {
         type: String,
         required: true
      },
   },
   methods: {
      settingHandler() {
         this.$emit('setting', this.id);
      }
   }
}
</script>