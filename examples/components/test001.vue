<template>
	<div>
		<h3>test001</h3>
		<div>{{param.appvueData}}</div>
		<button @click="param.app_method">app.vue methods</button>
	</div>
</template>

<script>
	export default {

		props: ['param']
	}
</script>

<style>
</style>
