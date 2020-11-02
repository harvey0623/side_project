<template>
   <div 
      class="dropdownBox"
      :style="heightStyle"
      @click="captureClick"
      v-show="isOpen">
      <div
         id="primaryMenu"
         class="menuLayout"
         :class="{ active: isSetting }"
         ref="primary">
         <div class="menu-item">
            <a href="javascript:;" class="profile">
               <img src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png" alt="">
               <div class="profile-content">
                  <p class="name">張曉明</p>
                  <p class="watch">查看你的個人檔案</p>
               </div>
            </a>
         </div>
         <div class="divide"></div>
         <SettingItem
            v-for="primary in primaryList"
            :key="primary.id"
            :id="primary.id"
            :title="primary.title"
            :icon="primary.icon"
            @setting="openSub"
         ></SettingItem>
      </div>
      <div
         id="subMenu"
         class="menuLayout"
         :class="{ active: isSetting }"
         ref="sub">
         <div class="backBlock">
            <span class="circle" @click="openSub('')">
               <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
            </span>
            <span class="backText">{{ subMenuName }}</span>
         </div>
         <component
            :is="layoutName"
            v-if="hasSetting"
            :settingInfo="settingInfo"
            @modeC="changeMode"
         ></component>
      </div>
   </div>
</template>

<script>
import dropdownList from './dropdownList.js';
import LinkLayout from './LinkLayout';
import ModeLayout from './ModeLayout';
import SettingItem from './SettingItem.vue';
export default {
   props: {
      isOpen: {
         type: Boolean,
         required: true
      }
   },
   data: () => ({
      dropdownList,
      settingId: '',
      adjustHeight: '',
      isSetting: false,
      layoutName: ''
   }),
   computed: {
      primaryList() {
         return this.dropdownList.reduce((prev, current) => {
            let { id, title, icon } = current;
            prev.push({ id, title, icon });
            return prev;
         }, []);
      },
      settingInfo() {
         let result = this.dropdownList.find(item => item.id === this.settingId);
         if (result !== undefined) return result.children;
         else return null;
      },
      hasSetting() {
         return this.settingInfo !== null;
      },
      subMenuName() { //選單名稱
         if (this.hasSetting) return this.settingInfo.menuName;
         else return '';
      },
      heightStyle() { //高度樣式
         if (this.adjustHeight === '') return { height: '' };
         else return { height: `${this.adjustHeight}px` };
      }
   },
   methods: {
      setDefaultHeight(key) {
         this.adjustHeight = this.$refs[key].clientHeight;
      },
      async openSub(id) {
         let isOpenSub = id !== '';
         let targetRef = isOpenSub ? 'sub' : 'primary';
         this.layoutName = id === 'favor' ? 'ModeLayout' : 'LinkLayout';
         if (isOpenSub) {
            this.settingId = id;
            await this.$nextTick();
            this.setDefaultHeight(targetRef);
            this.isSetting = isOpenSub;
         } else {
            let html = document.documentElement;
            let delayTime = window.getComputedStyle(html).getPropertyValue('--moveTime');
            this.setDefaultHeight(targetRef);
            this.isSetting = isOpenSub;
            setTimeout(() => {
               this.settingId = id;
               this.layoutName = '';
            }, parseInt(delayTime));
         }
      },
      captureClick(evt) {
         evt.stopPropagation();
      },
      changeMode({ modeId, modeValue }) { //改變偏好設定
         console.log(modeValue)
         let modeKey = modeId === 'mode-1' ? 'mode' : 'simplify';
         let targetObj = this.dropdownList.find(item => item.id === 'favor');
         targetObj.children.lists[modeKey].value = modeValue;
      }
   },
   watch: {
      isOpen(val) {
         if (val) {
            setTimeout(() => {
               this.setDefaultHeight('primary');
            }, 10);
         } else {
            this.adjustHeight = '';
            this.settingId = '';
            this.isSetting = false;
         }
      }
   },
   components: {
      LinkLayout,
      ModeLayout,
      SettingItem
   }
};
</script>