import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,   // url = base url + request url
    timeout:5000
})

service.interceptors.request.use(
    config=>{
        //在这里定义 request请求被发送前需要完成的 操作
        if(store.getters.token){
            // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error=>{
        console.log(error)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    // 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
    // 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
    // If you want to get http information such as headers or status
    // Please return  response => response
    // 通过自定义状态码来识别请求状态，这里只是一个例子，你也可以通过http状态码来判断状态

    response => {
        const res = response.data

        // 这里的200是自己在Mock返回的数据中定义的
        if(res.code!==200){
            Message({
                message:res.message || 'Error',
                type:'error',
                duration: 5*1000
            })

            if(res.code===50008 || res.code===50012 || res.code===50014){
                Message.confirm('你已经登出','留在本页或者跳转到登陆页面',{
                    confirmButtonText:'重新登陆',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    store.dispath('user/resetToken').then(()=>{
                        location.reload()   
                        //重新加载url，在导航路由守卫中定义了：“如果没有token，所有页面重定向到登陆页”，因此在重置了token后会实现跳转登陆页
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        }else{
            return res
        }
    },
    error=>{
        console.log('err',error)
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service