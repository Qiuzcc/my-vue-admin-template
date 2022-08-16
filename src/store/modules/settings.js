import defaultSettings from '@/settings'

const { fixedHeader, sidebarLogo } = defaultSettings

const state = {
    fixedHeader,
    sidebarLogo
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSettings({ commit }, data) {
        commit('CHANGE_SETTING', data)
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