<template>
   <div class="linkLayout">
      <div 
         v-for="item in settingList" 
         :key="item.id" 
         class="menu-item">
         <a :href="item.url" class="pageLink">
            <span class="circle">
               <i :class="item.icon" aria-hidden="true"></i>
            </span>
            <span class="settingText">{{ item.title }}</span>
         </a>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      settingInfo: {
         type: Object,
         required: true
      }
   },
   computed: {
      settingList() {
         return this.settingInfo.lists;
      }
   },
}
</script>