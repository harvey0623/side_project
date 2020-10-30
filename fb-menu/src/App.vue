<template>
   <div id="app">
      <div class="settingBox">
         <div class="triggerBox" @click="openMenu">
            <span>Dropdown</span>
            <i class="fa fa-caret-down" aria-hidden="true"></i>
         </div>
         <dropdown-box :isOpen="openDropdown"></dropdown-box>
      </div>
   </div>
</template>

<script>
import DropdownBox from '@/components/DropdownBox.vue';
export default {
	name: 'App',
	data: () => ({
		openDropdown: true
	}),
	methods: {
		openMenu(evt) {
			evt.stopPropagation();
			// this.openDropdown = !this.openDropdown;
		},
		docClick(evt) {
			// this.openDropdown = false;
		}
	},
	mounted() {
		document.addEventListener('click', this.docClick);
	},
	beforeDestroy() {
		document.removeEventListener('click', this.docClick);
	},
	components: {
		DropdownBox
   },
};
</script>

<style src="./App.css"></style>
