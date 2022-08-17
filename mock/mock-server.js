const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const Mock = require('mockjs')

// process.cwd() 是当前执行node命令时候的文件夹地址
const mockDir = path.join(process.cwd(), 'mock')

function registerRoutes(app) {
    let mockLastIndex
    const { mocks } = require('./index.js')
    const mocksForServer = mocks.map(route => {
        return responseFake(route.url, route.type, route.response)
    })
    for (const mock of mocksForServer) {
        app[mock.type](mock.url, mock.response)
        mockLastIndex = app._router.stack.length
    }
    const mockRoutesLength = Object.keys(mocksForServer).length
    return {
        mockRoutesLength: mockRoutesLength,
        mockStartIndex: mockLastIndex - mockRoutesLength
    }
}

// 包装url，添加baseURL前缀，并全部转成正则表达式
// 如果response参数是一个函数，执行函数，返回执行函数的返回值；否则直接返回response本身
const responseFake = (url, type, respond) => {
    return {
        url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
        type: type || 'get',
        response(req, res) {
            console.log('request invoke:' + req.path)
            res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
        }
    }
}

// 遍历require的缓存，如果缓存里面含有mock目录下的内容，delete它
// 这里应该是涉及到webpack较底层的工作原理了，暂时不懂
function unregisterRoutes() {
    Object.keys(require.cache).forEach(i => {
        if (i.includes(mockDir)) {
            delete require.cache[require.resolve(i)]
        }
    })
}

// 模块导出一个函数，为什么是函数？这个函数在哪被调用？
module.exports = app => {
    // parse app.body
    // https://expressjs.com/en/4x/api.html#req.body
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    const mockRoutes = registerRoutes(app)
    var mockRoutesLength = mockRoutes.mockRoutesLength
    var mockStartIndex = mockRoutes.mockStartIndex

    // watch files, hot reload mock server
    chokidar.watch(mockDir, {
        ignored: /mock-server/,         //忽略监视此代码文件自身
        ignoreInitial: true
    }).on('all', (event, path) => {
        if (event === 'change' || event === 'add') {
            try {
                // remove mock routes stack
                app._router.stack.splice(mockStartIndex, mockRoutesLength)

                // clear routes cache
                unregisterRoutes()

                const mockRoutes = registerRoutes(app)
                mockRoutesLength = mockRoutes.mockRoutesLength
                mockStartIndex = mockRoutes.mockStartIndex

                console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`))
            } catch {
                console.log(chalk.redBright(error))
            }
        }
    })
}