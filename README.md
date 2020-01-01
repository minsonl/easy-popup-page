# easy-popup-page

## Install
```
npm install easy-popup-page --save
```
## Usage
```
-main.js

import easyPopupPage from 'easy-popup-page'
Vue.use(easyPopupPage);

import test001 from "./components/test001";
Vue.prototype.$epp.add({
	width: 800,
	height: 500,
	minHeight:100,
	minHeight:100,
	title: "test001-title",
	name: 'test001', //required (必填)
	component: test001, //required (必填)
});
```
## Events

```
-app.vue

this.$epp.open('test001')
```
