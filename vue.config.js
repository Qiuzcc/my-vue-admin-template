// 1.为了配置svg-loader而创建，同时添加了一些其余配置，但不包括dev-server等（后续还要继续补充）

'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue admin template'

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528    // dev port

module.exports = {
    /**
  * You will need to set publicPath if you plan to deploy your site under a sub path,
  * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
  * then publicPath should be set to "/bar/".
  * In most cases please use '/' !!!
  * Detail: https://cli.vuejs.org/config/#publicpath
  */
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,          //原来的值为：process.env.NODE_ENV === 'development',
    productionSourceMap: false,

    // mock-server配置
    devServer: {
        port: port,     //指定监听请求的端口号
        open: true,     //告诉 dev-server 在服务器已经启动后打开浏览器。设置其为 true 以打开你的默认浏览器
        overlay: {      //当出现编译错误或警告时，在浏览器中显示全屏覆盖，且只显示错误信息
            warning: false,
            errors: true
        },
        before: require('./mock/mock-server.js'),
        // 提供在服务器内部执行自定义中间件的能力，优于所有其他中间件。这可用于定义自定义处理程序
        // https://www.webpackjs.com/configuration/dev-server/

        // 将接口代理到 mock 服务上
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://localhost:${port}/mock`,
                changeOrigin: true,
                pathRewrite: {
                    ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
            // 现在，对 /dev-api 的请求会将请求代理到 http://localhost:port/api
            // 并且重写了路径，不会传递/dev-api（没理解啥意思）
        }
    },

    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },

    chainWebpack(config) {
        // it can improve the speed of the first screen, it is recommended to turn on preload
        config.plugin('preload').tap(() => [
            {
                rel: 'preload',
                // to ignore runtime.js
                // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
                fileBacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: 'initial'
            }
        ])

        // when there are many pages, it will cause too many meaningless requests
        config.plugins.delete('prefetch')

        // set svg-sprite-loader
        // 把src/icons目录从原来.svg对应loader配置中去除，原来的loader是url-loader或者file-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        // 添加针对自定义svg的loader规则
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

        // 非开发模式下的配置
        // 需要安装script-ext-html-webpack-plugin@2.1.3到开发依赖
        // 自定义webpack的打包配置
        config.when(process.env.NODE_ENV !== 'development', config => {
            config.plugin('ScriptExtHtmlWebpackPlugin')
                .after('html')
                .use('script-ext-html-webpack-plugin', [{
                    // `runtime` must same as runtimeChunk name. default is `runtime`
                    inline: /runtime\..*\.js$/
                }])
                .end()
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'chunk-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial' // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: 'chunk-elementUI', // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                    },
                    commons: {
                        name: 'chunk-commons',
                        test: resolve('src/components'), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true
                    }
                }
            })
            // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
            config.optimization.runtimeChunk('single')
        })
    }
}