<template>
<div id="app">
	<div>
		<button 
			v-for="lang in langList"
			:key="lang"
			@click="changeLocale(lang)"
		>{{ lang }}
		</button>
	</div>
	<router-link :to="$i18nRoute({ name: 'home' })">
		{{ $t('page.home') }}
	</router-link>
	<router-link :to="$i18nRoute({ name: 'about' })">
		{{ $t('page.about') }}
	</router-link>
	<router-view></router-view>
</div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import { SUPPORTED_LANGUAGES } from '@/plugins/i18n/config.js';
import translate from '@/plugins/i18n/translation.js';
export default {
	data: () => ({
		langList: [],
		isFirst: true,
		isButtonTrigger: false
	}),
	methods: {
		async changeLocale(lang) {
			if (this.$i18n.locale === lang) return;
			const to = this.$router.resolve({ params: { locale: lang }});
			// await translate.changeLanguage(lang).then(res => res);
			this.$router.push(to.location, () => {
				this.isButtonTrigger = true;
				localStorage.setItem('lang', lang);
				location.reload();
			});
		}
	},
   mounted() {
		this.langList = SUPPORTED_LANGUAGES;
	},
	watch: {
		// $route(val, oldVal) {
		// 	if (this.$router.mode !== 'hash') return;
		// 	if (!this.isFirst) {
		// 		if (val.params.locale !== oldVal.params.locale && !this.isButtonTrigger) {
		// 			location.reload();
		// 		}
		// 	}
		// 	this.isFirst = false;
		// }
	}
};
</script>

<style lang="scss">
#app {
	max-width: 576px;
	margin: 0 auto;
}

span {
	display: inline-block;
	font-size: 18px;
	margin-right: 15px;
	cursor: pointer;
}
</style>
