import Vue from 'vue'
import App from './App.vue'
import epp from '../packages/'
Vue.use(epp);

import test001 from "./components/test001";

Vue.prototype.$epp.add({
	width: 800,
	height: 500,
	title: "test001标题",
	name: 'test001',
	component: () => ({
		component: import('./components/test001')
	})
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
