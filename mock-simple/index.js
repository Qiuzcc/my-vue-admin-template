const Mock = require('mockjs')
const {param2Obj} = require('./utils')

const baseURL = process.env.VUE_APP_BASE_API

const tableData = Mock.mock({
    'items|30':[{
        id:'@id',
        title:'@sentence(5,10)',
        'status|1':['published','draft','deleted'],
        author:'name',
        display_time:'@datetime',
        pageviews:'@integer(30,5000)'
    }]
})
Mock.mock(baseURL+'/table/list','get',()=>{
    const items = tableData.items
    return {
        code:200,
        data:{
            total:items.length,
            items
        }
    }
})

const tokens = {
    admin:{
        token:'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}
const users = {
    'admin-token':{
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token':{
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}
Mock.mock(baseURL+'/user/login','post',({body})=>{
    const bodyObj = JSON.parse(body)    //因为body是字符串格式，所以需要通过JSON解析成object
    const {username} = bodyObj
    const token = tokens[username]
    if(!token){
        return{
            code:60204,
            message:'账号或密码不对'
        }
    }
    return{
        code:200,
        data:token
    }
})
Mock.mock(new RegExp(baseURL+'/user/info\.*'),'get',({url,type,body})=>{
    const {token} = param2Obj(url)
    const info = users[token]
    if(!info){
        return{
            code:50008,
            message:'无法获取用户信息'
        }
    }
    return{
        code:200,
        data:info
    }
})
Mock.mock(baseURL+'/user/logout','post',({body})=>{
    const bodyObj = JSON.parse(body)
    const {token} = bodyObj     //这里token暂时没有用上，但是返回token这个设计我觉得是合理需要的，可以让后端获取用户的登陆状态
    return{
        code:200,
        message:'success'
    }
})