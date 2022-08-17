const tokens = {
    admin: {
        token: 'admin-token'
    },
    editor: {
        token: 'editor-token'
    }
}
const users = {
    'admin-token': {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
    },
    'editor-token': {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
    }
}

// baseURL在继承数据之后添加，统一添加提高效率
module.exports = [
    {
        url: '/user/login',
        type: 'post',
        response: ({ body }) => {

            // 这里不要再使用JSON解析了，因为在mock-server中已经使用了body-parser对发送的数据进行解析了
            // const bodyObj = JSON.parse(body)    //因为body是字符串格式，所以需要通过JSON解析成object
            // const { username } = bodyObj
            const {username} = body

            const token = tokens[username]
            if (!token) {
                return {
                    code: 60204,
                    message: '账号或密码不对'
                }
            }
            return {
                code: 200,
                data: token
            }
        }
    },
    {
        url: '/user/info\.*',
        type: 'get',
        response: ({ query }) => {
            const { token } = query
            const info = users[token]
            if (!info) {
                return {
                    code: 50008,
                    message: '无法获取用户信息'
                }
            }
            return {
                code: 200,
                data: info
            }
        }
    },
    {
        url: '/user/logout',
        type: 'post',
        response: ({ body }) => {

            // 道理同上
            // const bodyObj = JSON.parse(body)
            // const { token } = bodyObj   
            const { token } = body
            //这里token暂时没有用上，但是返回token这个设计我觉得是合理需要的，可以让后端获取用户的登陆状态
            return {
                code: 200,
                data: 'success'
            }
        }
    }
]