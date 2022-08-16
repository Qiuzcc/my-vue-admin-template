import request from '@/utils/request'

export function login(data){
    return request({
        url:'/user/login',
        method:'post',
        data
    })
}
 
export function getInfo(token){
    return request({
        url:'/user/info',
        method:'get',
        params:{token}
    })
}

// 发出登出请求时，携带上token，这样在后台也可以记录用户的登陆状态
export function logout(token){
    return request({
        url:'/user/logout',
        method:'post',
        data:{token}
    })
}