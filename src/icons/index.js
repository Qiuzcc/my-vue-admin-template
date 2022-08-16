import Vue from "vue";
import SvgIcon from '@/components/SvgIcon'

Vue.component('svg-icon',SvgIcon)

const req = require.context('./svg',false,/\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

// 注册svg-icon全局组件
// 引入svg目录下所有svg文件

/**
 * require.context，可以使用 require.context() 方法来创建自己的（模块）上下文，这个方法有 3 个参数：
 * 要搜索的文件夹目录
 * 是否还应该搜索它的子目录，
 * 以及一个匹配文件的正则表达式。
 * 
 * require.context模块导出（返回）一个（require）函数
 * 导出的方法有 3 个属性： resolve, keys, id。
 * keys 也是一个函数，它返回一个数组，由所有可能被上下文模块处理的请求组成
 */