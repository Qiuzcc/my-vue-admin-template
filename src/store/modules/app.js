import Cookies from 'js-cookie'
// 使用cookie来保存用户的设置（这里只保存了侧边栏状态一个数据），当网页或浏览器关闭时，cookie仍然会记录响应信息（直到cookie过期）
// 目的：为了记住用户的设置，下次打开网页时能够复现相同的设置
// 所以这个看似多余的操作，实则是有它的目的的

const state = {
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
        withoutAnimation: false
    },
    device: 'desktop'
}
// opened表示是否展开侧边栏，但是withoutAnimation表示是什么意思？？？
// devie这个变量又在哪里用到了？？？

const mutations = {
    TOGGLE_SIDEBAR: state => {
        state.sidebar.opened = !state.sidebar.opened
        state.sidebar.withoutAnimation = false
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1)
        } else {
            Cookies.set('sidebarStatus', 0)
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        Cookies.set('sidebarStatus', 0)
        state.sidebar.opened = false
        state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device
    }
}

const actions = {
    toggleSidebar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    closeSidebar({ commit }, { withoutAnimation }) {
        commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
        commit('TOGGLE_DEVICE', device)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

// 默认情况下，模块内部的 action、mutation 和 getter 是注册在全局命名空间的，这样使得多个模块能够对同一 mutation 或 action 作出响应
// 如果希望你的模块具有更高的封装度和复用性，此时就用到了命名空间这个概念
// 在单个模块中通过添加namespaced：true的方式使其成为带命名空间的模块
// 访问时，需要加上模块名，格式：store.state.模块名.模块属性，（可以看看getter.js是如何访问的）