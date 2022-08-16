import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' 
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']    // 免登陆白名单

router.beforeEach(async(to,from,next)=>{
    NProgress.start()
    document.title = getPageTitle(to.meta.title)    //设置页面标题
    const token = getToken()

    if(token){
        if(to.path === '/login'){
            next({path:'/'})
            NProgress.done()
        }else{
            const hasGetUserInfo = store.getters.name
            if(hasGetUserInfo){
                next()
            }else{
                try{
                    await store.dispatch('user/getInfo')
                    next()
                }catch(err){
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(err || 'Has error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    }else{
        if(whiteList.indexOf(to.path)!==-1){
            next()
        }else{
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(()=>{
    NProgress.done()
})