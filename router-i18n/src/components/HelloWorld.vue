<template>
<div class="helloworld">
{{ $t('hello', {name: 'merry'}) }}
<button @click="clickHandler">click</button>
</div>
</template>

<script>
export default {
	methods: {
		clickHandler() {
			console.log(this.$i18n.locale)
		}
	}
}
</script>

