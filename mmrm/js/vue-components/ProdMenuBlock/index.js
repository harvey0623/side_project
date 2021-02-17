Vue.component('prod-menu-block', {
	props: {
		menu: {
			type: Object,
			required: true
		},
		isOtherLayout: {
			type: Boolean,
			required: true
		},
		pageurl: {
			type: String,
			required: true
		}
	},
	computed: {
		categoryText() {
			return `${this.menu.parentTitle} / ${this.menu.title}`;
		}
	},
	template: `
      <div class="prodMenuBlock" :class="{other:isOtherLayout}">
         <p>{{ categoryText }}</p>
			<div class="prodItemOuter">
				<prod-item
					v-for="prod in menu.menuInfo"
					:key="prod.menu_item_id"
					:prod="prod"
					:pageurl="pageurl"
				></prod-item>
			</div>
      </div>`
});