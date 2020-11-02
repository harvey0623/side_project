<template>
   <label class="optionItem">
      <span>{{ optionTitle }}</span>
      <input type="radio" :name="radioName" :value="optionValue" v-model="currentValue">
   </label>
</template>

<script>
export default {
   props: {
      modeId: {
         type: String,
         required: true
      },    
      optionTitle: {
         type: String,
         required: true
      },
      optionValue: {
         type: Boolean,
         required: true
      },
      modeValue: {
         type: Boolean,
         required: true
      },
      radioName: {
         type: String,
         required: true
      }
   },
   computed: {
      currentValue: {
         get() {
            return this.modeValue;
         },
         set(val) {
            this.$emit('modeA', {
               modeId: this.modeId,
               modeValue: val
            });
         }
      }
   }
}
</script>