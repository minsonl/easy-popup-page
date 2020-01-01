/*
* 全局弹窗页面
*
* ==== Vue.prototype.$epp.add(options) 注册组件 ====
*   ->@param {number} options[width] 弹窗默认宽度
*   ->@param {number} options[height] 高度
*   ->@param {string} options[title] 弹窗标题
*   ->@param {string} options[name] 弹窗名(不能重复)
*   ->@param {vue component} options[component] 要显示的vue组件
*   ->@param {boolean} options[scrollX] default:false 弹窗是否x轴滚动条
*   ->@param {boolean} options[scrollY] default:true 弹窗是否y轴滚动条
*   ->@param {number} options[minIndex] 最小z-index(默认1000)
*   ->@param {boolean} options[isZoom] 是否开启缩放(默认true)
*   ->@param {boolean} options[isMove] 是否开启拖动(默认true)
*   ->@param {function} options[open] 显示弹窗回调
*   ->@param {function} options[close] 关闭弹窗回调
* ====================================================
*
* ==== Vue.prototype.$epp.open(name,param,closeCb,openCb) 打开注册组件 ====1
*   ->@param {string} name 注册弹窗时设置的 弹窗名
*   ->@param {object} param 向子组件传递数据 (子组件通过 props:['param'] 接收)
*   ->@param {function} closeCb 用于覆盖显示弹窗回调 (例:A页面内点击下单并传递更新订单方法,弹窗关闭后会更新A页面订单列表)
*   ->@param {function} openCb 用于覆盖显示弹窗回调
* ==========================================================
*
* ==== Vue.prototype.$epp.close(name) 关闭注册组件 ====
*   ->@param {string} name 注册弹窗时设置的 弹窗名
* ===========================================================
*
* ==== Vue.prototype.$epp.closeAll() 关闭所有注册组件 ====
*   -
* ==============================================================
*
*  ====================== 子组件注入方法 =========================
*   this.$emit('setTitle','new title'); 子组件内重置弹窗标题
* ================================================================
* */
import mainVue from './src/main';
export default {
    //配置公用方法
    install: function (Vue) {
        Vue.prototype.$epp = {
            store: {},
            add(options) {
                if (!options.name) {
                    //弹窗页面name不能为空
                    this.error("popuPage 'name' cannot be empty!");
                    return
                } else if (this.store.hasOwnProperty(options.name)) {
                    //弹窗页面name不能重复
                    this.error("popuPage 'name' cannot be repeated!");
                    return
                }
                this.store[options.name] = {
                    isOpen: false,
                    options: options,
                    instance: null,
                    vm: null,
                    openCb: options.open || function () {
                    },
                    closeCb: options.close || function () {
                    }
                }
            },
            open(name, param = {}, closeCb = function () {}, openCb = function () {}) {
                if (!this.store.hasOwnProperty(name)) {
                    //不存在name
                    this.error(`popuPage '${name}' not exist!`);
                    return
                }
                let storeTarget = this.store[name];
                if (!storeTarget.options.component) {
                    //需要传入vue组件
                    this.error(`popuPage 'component' must be vue component!`);
                    return
                }
                if (storeTarget.isOpen) {
                    //弹窗页面name不能重复打开
                    //this.error("popuPage cannot be repeated open!");
                    return
                }
                storeTarget.openCb = openCb;
                storeTarget.closeCb = closeCb;
                let construct = Vue.extend(mainVue);
                storeTarget.instance = new construct({
                    propsData: {
                        ...storeTarget.options,
                        param: param,
                        page_id: 'epp_' + storeTarget.options.name,
                    }
                });
                storeTarget.instance.$on("close", () => {
                    this.close(name);
                });
                storeTarget.vm = storeTarget.instance.$mount();
                document.body.appendChild(storeTarget.vm.$el);
                storeTarget.isOpen = true;
                storeTarget.openCb();
            },
            close(name) {
                if (!this.store.hasOwnProperty(name)) {
                    //不存在name
                    this.error(`popuPage '${name}' not exist!`);
                    return
                }
                let storeTarget = this.store[name];
                document.body.removeChild(storeTarget.vm.$el);
                storeTarget.instance.$destroy();
                storeTarget.vm = storeTarget.instance = null;
                storeTarget.isOpen = false;
                storeTarget.closeCb();
            },
            closeAll() {
                for (let key in this.store) {
                    this.store[key].isOpen && this.close(key);
                }
            },
            error(msg) {
				throw msg;
            }
        }
    }
};
