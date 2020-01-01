<template>
    <transition name="bounce">
        <div class="epp-container" :id="page_id" v-show="isShow" :style="{ 'z-index':zIndex  }"
             @mousedown="containerMouseDown($event)" ref="eppContainer">
            <div class="epp-title" @mousedown="titleMouseDown($event)">
                <div class="tit-left">{{title}}</div>
                <div class="tit-right" @click="destroyElement">+</div>
            </div>
            <div class="epp-content" :class="{'scroll-x':scrollX,'scroll-y':scrollY}">
                <template v-if="isload">
                    <component :is="component" :param="param" :page_id="page_id"
                               @setTitle="(tit)=>{this.title = tit}"></component>
                </template>
            </div>
            <div class="epp-scale" ref="scale" @mousedown="scaleMouseDown($event)"></div>
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            width: {
                default: 100
            },
            height: {
                default: 100
            },
            minWidth: {
                default: 100
            },
            minHeight: {
                default: 100
            },
            title: {
                default: 100
            },
            component: {
                default: {}
            },
            scrollX: {
                default: false
            },
            scrollY: {
                default: true
            },
            param: {
                default: {}
            },
            page_id: {
                default: ''
            },
			minIndex:{
				default: 1000
			},
			isZoom:{
				default: true
			},
			isMove:{
				default: true
			},
        },
        data() {
            return {
                isShow: false, //开关动画
                'zIndex': 0,
                'isload': false,
				'opencount':0
            }
        },
        created() {
            this.isload = true;
			let count = 0;
			for (let key in this.$epp.store) {
			    if(this.$epp.store[key].isOpen){
					count++
				}
			}
			this.opencount = count;
            this.$nextTick(() => {
                this.init();
                this.createdIndex();
            });
        },
        methods: {
            init() {
                this.isShow = true;
                let box = this.$refs.eppContainer;
                box.style.width = this.width + 'px';
                box.style.height = this.height + 'px';
                box.style.left = (document.documentElement.clientWidth - this.width) / 2 + (this.opencount*10) + 'px';
                box.style.top = (document.documentElement.clientHeight - this.height) / 2 + (this.opencount*10) + 'px';
            },
            containerMouseDown(e) {
                let num = 0;
                let store = this.$epp.store;
                for (let key in this.$epp.store) {
                    if (store[key] && store[key].isOpen) {
                        num++
                    }
                }
                if (num < 2) {
                    return
                }
                this.createdIndex();
            },
            titleMouseDown(event) {
				if(!this.isMove){
					return
				}
                let fa = document.body;
                let box = this.$refs.eppContainer;
                let disX = event.clientX - box.offsetLeft;
                let disY = event.clientY - box.offsetTop;
                window.onmousemove = (e) => {
                    e.preventDefault();
                    var x = e.clientX - disX;
                    var y = e.clientY - disY;

                    // 图形移动的边界判断
                    x = x <= 0 ? 0 : x;
                    x = x >= fa.offsetWidth - box.offsetWidth ? fa.offsetWidth - box.offsetWidth : x;
                    y = y <= 0 ? 0 : y;
                    y = y >= fa.offsetHeight - box.offsetHeight ? fa.offsetHeight - box.offsetHeight : y;
                    box.style.left = x + 'px';
                    box.style.top = y + 'px';
                };
                // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
                window.onmouseleave = function () {
                    window.onmousemove = null;
                    window.onmouseup = null;
                }
                // 鼠标弹起后停止移动
                window.onmouseup = function () {
                    window.onmousemove = null;
                    window.onmouseup = null;
                }
            },
            scaleMouseDown(event) {
				if(!this.isZoom){
					return
				}
                // 阻止冒泡,避免缩放时触发移动事件
                event.stopPropagation();
                event.preventDefault();
                let box = this.$refs.eppContainer;
                let fa = document.body;
                var pos = {
                    'w': box.offsetWidth,
                    'h': box.offsetHeight,
                    'x': event.clientX,
                    'y': event.clientY
                };
                window.onmousemove = (e) => {
                    e.preventDefault();
                    // 设置最小宽高
                    var w = Math.max(this.minWidth, e.clientX - pos.x + pos.w)
                    var h = Math.max(this.minHeight, e.clientY - pos.y + pos.h)
                    // 设置最大宽高
                    w = w >= fa.offsetWidth - box.offsetLeft ? fa.offsetWidth - box.offsetLeft : w;
                    h = h >= fa.offsetHeight - box.offsetTop ? fa.offsetHeight - box.offsetTop : h;
                    box.style.width = w + 'px';
                    box.style.height = h + 'px';
                };
                window.onmouseleave = function () {
                    window.onmousemove = null;
                    window.onmouseup = null;
                }
                window.onmouseup = function () {
                    window.onmousemove = null;
                    window.onmouseup = null;
                }
            },
            createdIndex() {
				let maxIndex = [...document.all].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0);
				if(maxIndex<this.minIndex){
					this.zIndex = this.minIndex;
				}else{
					if(this.zIndex != maxIndex){
						this.zIndex = maxIndex  + 1;
					}
				}
            },
            destroyElement() { //关闭弹窗事件
                this.isShow = false;
                setTimeout(() => {
                    this.$emit('close');
                }, 300)
                // this.$destroy(true);
                // this.$el.parentNode.removeChild(this.$el);
            }
        },
        beforeDestroy() {
            this.isShow = false;
        }
    }
</script>
<style>
	html,body{
		width: 100%;
		height: 100%;
	}
    body {
        position: relative;
    }

    .bounce-enter-active {
        animation: bounce-in .2s;
    }

    .bounce-leave-active {
        animation: bounce-in .2s reverse;
    }

    @keyframes bounce-in {
        0% {
            opacity: 0.2;
            transform: scale(0.9);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }

    .epp-container {
        width: 100px;
        height: 100px;
        position: fixed;
        background-color: #fff;
        border-radius: 2px;
        border: 1px solid rgba(0, 0, 0, .1);
        box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
    }

    .epp-title {
        width: 100%;
        height: 40px;
        /*cursor: move;*/
        position: absolute;
        top: 0;
        left: 0;
        background-color: #F8F8F8;
        border-radius: 2px 2px 0 0;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        user-select: none;
    }

    .epp-title .tit-left {
        line-height: 40px;
        float: left;
        font-size: 14px;
        color: #333;
        padding: 0 10px;
    }

    .epp-title .tit-right {
        float: right;
        font-size: 30px;
        line-height: 40px;
        color: #444;
        cursor: pointer;
        padding: 0 5px;
        margin-top: -2px;
        -o-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
    }

    .epp-title .tit-right:hover {
        color: #888;
    }

    .epp-title .tit-right:active {
        color: #333;
    }

    .epp-content {
        width: 100%;
        height: 100%;
        border-top: solid 40px #F8F8F8;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .epp-content.scroll-x {
        overflow-x: scroll;
    }

    .epp-content.scroll-y {
        overflow-y: scroll;
    }

    .epp-scale {
        width: 10px;
        height: 10px;
        overflow: hidden;
        cursor: se-resize;
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
