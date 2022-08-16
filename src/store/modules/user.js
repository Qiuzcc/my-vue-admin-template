import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: ''
    }
}
const state = getDefaultState()
// 以函数的形式获得对象数据，这样每个对象都有一个单独的函数闭包，这样做可以避免共享数据，可是为什么要这么做呢？

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState()) //getDefaultState会覆盖掉state的所有相同属性（它也没有不同属性）
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    }
}

const actions = {
    login({ commit }, userinfo) {
        const { username, password } = userinfo
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password }).then(res => {
                const { data } = res
                commit('SET_TOKEN', data.token)
                setToken(data.token)
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token).then(res => {
                const { data } = res
                if (!data) {
                    return reject('验证失败，请重新登录')
                }
                const { name, avatar } = data
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first，因为后面commit('RESET_STATE'）中调用了getToken，如果先removeToken，则会获取到之前的token，造成错误
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },
    resetToken({ commit }) {
        //在axios拦截器中会调用该函数，当拦截器根据response状态码判断到用户处于登出状态时，就会调用这个函数
        return new Promise(resolve => {
            removeToken()
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}