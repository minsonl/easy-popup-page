<template>
	<div id="app">
		<button @click="openTest001">open test001</button>
		<button @click="app_method">app_method</button>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data(){
			return{
				appvueData:'app.vue appvueData'
			}
		},
		methods:{
			openTest001(){
				this.$epp.open('test001',this)
			},
			app_method(){
				this.appvueData = new Date();
			},
		}
	}
</script>

<style>
	html,body{width: 100%;height: 100%;margin: 0;padding: 0;}
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
	}
</style>
