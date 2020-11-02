<template>
   <div class="modeLayout">
      <OptionBox
         :modeId="modeData.modeId"
         :modeTitle="modeData.title"
         :modeIcon="modeData.icon"
         :modeValue="modeData.value"
         :modeList="modeData.modeList"
         radioName="mode"
         @modeB="changeMode"
      ></OptionBox>
      <OptionBox
         :modeId="simplifyData.modeId"
         :modeTitle="simplifyData.title"
         :modeIcon="simplifyData.icon"
         :modeValue="simplifyData.value"
         :modeList="simplifyData.modeList"
         radioName="simply"
         @modeB="changeMode"
      ></OptionBox>
   </div>
</template>

<script>
import OptionBox from './OptionBox.vue';
export default {
   props: {
      settingInfo: {
         type: Object,
         required: true
      }
   },
   computed: {
      modeData() {
         return this.settingInfo.lists.mode;
      },
      simplifyData() {
         return this.settingInfo.lists.simplify;
      }
   },
   methods: {
      changeMode(payload) {
         this.$emit('modeC', payload);
      }
   },
   components: {
      OptionBox
   }
}
</script>

<style src="@/assets/css/ModeLayout.css"></style>