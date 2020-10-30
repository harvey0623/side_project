<template>
   <div class="modeLayout">
      <div class="optionBox">
         <div class="optionTitle">
            <span class="circle">
               <i class="fa fa-moon-o" aria-hidden="true"></i>
            </span>
            <p>夜間模式</p>
         </div>
         <div class="optionList">
            <label>
               <span>關閉</span>
               <input type="radio" name="mode" value="false">
            </label>
            <label>
               <span>開啟</span>
               <input type="radio" name="mode" value="true">
            </label>
         </div>
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
      modeData() {
         return this.settingInfo.lists.mode;
      },
      simplifyData() {
         return this.settingInfo.lists.simplify;
      }
   }
}
</script>

<style>
.optionBox {
   padding: 10px;
   margin-bottom: 15px;
}

.optionTitle {
   display: flex;
   align-items: center;
   margin-bottom: 12px;
   color: var(--primaryColor);
}

.optionTitle > .circle {
   width: 40px;
   height: 40px;
   line-height: 40px;
   text-align: center;
   border-radius: 50%;
   background-color: #2e2f30;
   font-size: 22px;
}

.optionTitle > p {
   margin-left: 10px;
   font-size: #2e2f30;
   font-size: 20px;
   font-weight: bold;
}

.optionList > label {
   display: flex;
   justify-content: space-between;
   align-items: center;
   width: 100%;
   padding-top: 5px;
   padding-bottom: 5px;
   padding-left: 50px;
   padding-right: 15px;
   margin-bottom: 10px;
   cursor: pointer;
}

.optionList > label:last-child {
   margin-bottom: 0;
}

.optionList > label > span {
   color: var(--primaryColor);
   font-size: 18px;
   font-weight: bold;
}

.optionList > label > input {
   width: 18px;
   height: 18px;
}


</style>