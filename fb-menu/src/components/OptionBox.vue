<template>
   <div class="optionBox">
      <div class="optionTitle">
         <span class="circle">
            <i :class="modeIcon" aria-hidden="true"></i>
         </span>
         <p>{{ modeTitle }}</p>
      </div>
      <div class="optionList">
         <OptionItem
            v-for="option in modeList"
            :modeId="modeId"
            :key="option.id"
            :optionTitle="option.title"
            :optionValue="option.value"
            :modeValue="modeValue"
            :radioName="radioName"
            @modeA="changeMode"
         ></OptionItem>
      </div>
   </div>
</template>

<script>
import OptionItem from './OptionItem.vue';
export default {
   props: {
      modeId: {
         type: String,
         required: true,
      },
      modeTitle: {
         type: String,
         required: true
      },
      modeIcon: {
         type: String,
         required: true
      },
      modeValue: {
         type: Boolean,
         required: true
      },
      modeList: {
         type: Array,
         required: true
      },
      radioName: {
         type: String,
         required: true
      }
   },
   methods: {
      changeMode(payload) {
         this.$emit('modeB', payload);
      }
   },
   components: {
      OptionItem
   }
}
</script>