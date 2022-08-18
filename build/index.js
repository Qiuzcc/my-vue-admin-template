/**预览build效果，在package.json中设置preview的scripts脚本命令，通过npm run previes即可运行一个http服务器，
 * 查看项目运行
 */
const { run } = require('runjs')
const chalk = require('chalk')
const config = require('../vue.config.js')
const rawArgv = process.argv.slice(2)
const args = rawArgv.join(' ')

if (process.env.npm_config_preview || rawArgv.includes('--preview')) {
    const report = rawArgv.includes('--report')
  
    // 如果已经运行build命令，生成了dist目录，可以把这行代码注释掉，避免重复build项目浪费时间
    // run(`vue-cli-service build ${args}`)
  
    const port = 9526
    const publicPath = config.publicPath
  
    var connect = require('connect')            //一个http中间件，提供了很多中间件，如：日志、静态文件服务器，seesion等功能
    var serveStatic = require('serve-static')   //这个中间间的功能是吧用户设置的目录引射在根路径“/”下，快速解决目录下所有文件的路由问题
    const app = connect()
  
    app.use(
      publicPath,
      serveStatic('./dist', {
        index: ['index.html', '/']
      })
    )
  
    app.listen(port, function () {
      console.log(chalk.green(`> Preview at  http://localhost:${port}${publicPath}`))
      if (report) {
        console.log(chalk.green(`> Report at  http://localhost:${port}${publicPath}report.html`))
      }
  
    })
  } else {
    // run(`vue-cli-service build ${args}`)
  }