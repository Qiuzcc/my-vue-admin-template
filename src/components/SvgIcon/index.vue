<template>
    <div v-if="isExternal" class="svg-external-icon svg-icon" :style="styleExternalIcon"></div>
    <svg v-else :class="svgClass" aria-hidden="true">
        <use :xlink:href='iconName'/>
    </svg>
</template>
// use使用示例如下
// import '@/src/icons/qq.svg; //引入图标
// <svg><use xlink:href="#qq" /></svg>  //使用图标

<style scoped>
.svg-icon{
    width:1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.svg-external-icon{
    background-color: currentColor;
    mask-size: cover!important;
    display: inline-block;
}
</style>

<script>
import {isExternal} from '@/utils/validate'
export default {
    name:'SvgIcon',
    props:{
        iconClass:{
            type:String,
            required:true
        },
        className:{
            type:String,
            default:''
        }
    },
    computed:{
        isExternal(){
            return isExternal(this.iconClass)
        },
        iconName(){
            return `#icon-${this.iconClass}`    //这里的#icon-[]，需要与webpack的配置结合，参考https://juejin.cn/post/6844903517564436493#heading-8
        },
        svgClass(){
            if(this.className){
                return 'svg-icon' + this.className
            }else{
                return 'svg-icon'
            }
        },
        styleExternalIcon(){
            return{
                mask:`url(${this.iconClass}) no-repeat 50% 50%`,
                'webkit-mask':`url(${this.iconClass} no-repeat 50% 50%)`
            }
        }
    }
}
</script>
// 如果是通过外部链接提供的图标，那么直接通过style样式mask引入
// 否则，通过iconName引用内部svg