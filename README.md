# 从零搭建vue-admin-template项目

目录
- 项目配置
- 后台主页
- 导航权限
- 全局utils
- 全局components
- 全局styles
- store
- 路由
- Mock
- 运行build结果
- 问题合集
- 部署到github page

## 项目配置

- @vue/cli 4.2.3
- vue 2
- node 12.2.0
- npm 6.9.0



## 一、后台主页

在src目录下新建layout文件夹，创建如下图：然后依次编辑代码

![image-20220813213641553](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202208132136598.png)

### 1、sidebar组件（✓）

##### 1）SidebarItem（✓）

侧边栏导航中每一个单独的元素，即每一行

1. props，传入参数

   | 参数     | 是否必需 | 默认值 | 含义                 |
   | -------- | -------- | ------ | -------------------- |
   | item     | ✓        |        | 侧边栏的项，不限级数 |
   | isNest   | ×        | false  | 是否有子项           |
   | basePath | ×        | 空     | 子路由的路径         |

2. data()属性，声明一个变量 onlyOneChild ，用于保存没有子项的导航项的信息

3. methods属性

   | 函数               | 参数                   | 返回值  | 作用                                                         |
   | ------------------ | ---------------------- | ------- | ------------------------------------------------------------ |
   | hasOneShowingChild | *children*=[],*parent* | boolean | 判断是否小于等于一个要显示的子项,如果多于一个，返回false。如果一个没有或者只有一个，返回true，并给onlyOneChild赋值 |
   | resolvePath        | routePath              | string  | 如果传入参数是外部链接，直接返回。如果basePath是外链，直接返回。否则返回basePath与参数合并后的路径 |

4. 外部操作

   安装path@0.12.7包到依赖，并引入

   创建src/utils/validate/isExternal，引入

   创建Item、AppLink组件，并引入

   使用了Element-UI，安装Element UI@2.13.2包，在main.js文件中导入element ui 和它的css文件，并让Vue使用它

##### 2）AppLInk（✓）

侧边栏导航每个元素里面的链接

1. props

   | 参数 | 是否必需 | 含义     |
   | ---- | -------- | -------- |
   | to   | ✓        | 链接地址 |

2. computed

   | 属性       | 含义                                                         |
   | ---------- | ------------------------------------------------------------ |
   | isExternal | 是否外链，true/false                                         |
   | type       | 返回当前链接节点的类型，如果是外链使用a，如果是内部链接，返回router-link |

3. methods

   | 函数      | 参数 | 返回值     | 作用                                                         |
   | --------- | ---- | ---------- | ------------------------------------------------------------ |
   | linkProps | to   | 节点的属性 | 根据链接类型，返回对应的属性，如果是内链，返回to本身；<br />如果是外链，返回href、target、rel三个属性。用于绑定到链接节点上 |

##### 3）Item（✓）

无状态、无实例的函数化组件。根据传入的icon名称、title，生成图标和标题，并返回

1. props

   | 参数  | 默认值   | 含义     |
   | ----- | -------- | -------- |
   | icon  | 空String | 图标名称 |
   | title | 空String | 标题     |

2. 外部操作

   注册全局svg-icon组件，跳转到 【一/5】

##### 4）Logo（✓）

侧边栏顶部的Logo标志

1. props

   | 参数     | 备注              | 含义           |
   | -------- | ----------------- | -------------- |
   | collapse | 必需，Boolean类型 | 是否折叠Logo栏 |

2. data

   | 参数  | 含义       |
   | ----- | ---------- |
   | title | logo栏标题 |
   | logo  | logo链接   |

##### 5）index（✓）

根据全局路由对象router的所有路由信息，动态生成侧边栏

1. components

   | 组件        | 说明                 |
   | ----------- | -------------------- |
   | Logo        | 侧边导航栏的顶部Logo |
   | SidebarItem | 侧边导航栏的每个子项 |

2. computed

   | 变量       | 说明                                                         |
   | ---------- | ------------------------------------------------------------ |
   | sidebar    | 映射到store.getters中的sidebar                               |
   | routes     | 获取$roter全局路由对象中所有的路由信息，options.routes       |
   | activeMenu | 如果当前路由通过meta指定了path，高亮指定的path<br />如果没有通过meta指定，高亮当前路由的path |
   | showLogo   | 返回store.settings中的sidebarLogo参数，boolean值，是否显示顶部Logo |
   | variables  | @/styles/variables.scss中关于侧边栏的样式变量                |
   | isCollapse | boolean值，第一个变量sidebar的属性opened的相反值，是否折叠侧边栏 |

3. 外部操作

   创建 src/styles/variables.scss，跳到【六/1】

   编辑store代码，创建getters，跳到【七】



### 2、navbar组件（✓）

1. 外部操作

   创建src/components/Breadcrumb 和 Hamburger，并导入，跳到【五/2、3】

   创建store/module/user，跳到【七/2/3)】（涉及到太多功能），先在getters里面硬编码返回一个avatar

2. computed

   | 参数    | 说明                                 |
   | ------- | ------------------------------------ |
   | sidebar | mapGetters映射sotre.getters的sidebar |
   | avatar  | 同上                                 |

3. methods

   | 函数          | 说明                                                         |
   | ------------- | ------------------------------------------------------------ |
   | toggleSidebar | 切换侧边栏展开/折叠                                          |
   | logout        | 登出，异步函数，调用store.app的logout，然后路由跳转到登陆页面 |



### 3、AppMian组件（✓）

除了导航外，页面显示区域，views组件渲染的地方

computed

| key  | 确保router-view不被直接覆盖渲染 |
| ---- | ------------------------------- |



### 4、Layout布局组件（✓）

集成Sidebar、Navbar、AppMain，作为后台页面的主面板布局组件，所有的一级路由使用该组件。二级之后的路由使用AppMain组件。

fixedHeader值的含义，顶部导航栏是否宽度自适应。

1. computed

   | 变量        | 说明                                       |
   | ----------- | ------------------------------------------ |
   | sidebar     | $store.app的sidebar对象                    |
   | device      | $store.app的device值                       |
   | fixedHeader | $store.settings的fixedHeader值，顶部导航栏 |
   | classObj    | 根据sidebar和device的值，生成css类         |

2. methods

   | 函数               | 作用                                   |
   | ------------------ | -------------------------------------- |
   | handleClickOutside | 处理点击侧边栏以外区域事件，收起侧边栏 |



### 5、自定义SvgIcon（✓）

侧边导航栏，每个菜单项目的图标，做到自动区分element ui自带的图标、内部svg、外部svg，并使用对应不同的标签

1. 创建全局components/SvgIcon，跳到【五/1】

2. 建立src/icons文件夹，如下图

   ![image-20220814000800377](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202208140008181.png)

3. index.js，注册svg-icon全局组件；引入svg目录下所有svg文件

4. （在文件管理器中）把svg文件复制到./svg文件夹下

5. 修改webpack配置中，关于svg的部分，做法可参考[手摸手，带你优雅的使用 icon - 掘金 (juejin.cn)](https://juejin.cn/post/6844903517564436493#heading-8)。这部分比较难，因为参考文档使用的是build目录下的webpack.base.conf.js文件。但是该项目通过@vul/cli 4.2.3创建出来的项目结构里面已经没有了这个build目录和对应的conf文件。所以需要在根目录下添加一个vue.config.js文件，并通过函数方式添加配置

   创建vue.config.js，并添加如下

   ![image-20220814103355146](https://qiuzcc-typora-images.oss-cn-shenzhen.aliyuncs.com/images/2022/202208141037226.png)

6. 安装svg-sprite-loader@4.1.3到依赖项

7. 完成

8. svgo是一个svg文件压缩工具，[SVG精简压缩工具svgo简介和初体验 ](https://www.zhangxinxu.com/wordpress/2016/02/svg-compress-tool-svgo-experience/)，看了文档应该是要手动操作压缩，这里的svg文件并不多，对性能影响不大，所以不使用它。



### 6、Views（✓）

| 视图      | 说明     |
| --------- | -------- |
| dashboard | 仪表盘   |
| form      | 编辑表单 |
| login     | 登录表单 |
| nested    | 嵌套菜单 |
| table     | 表格数据 |
| tree      | 树形组件 |
| 404       | 404页    |



## 三、导航权限（✓）

#### src/permisssion.js（✓）

安装nprogress@0.2.0包

添加全局前置守卫，在进行每次导航之前，判断本地（cookie）是否已有token。如果没有重定向到登陆页；如果有，判断store中是否已经有userInfo，如果没有调用对应的actions函数获取；如果是导航到登陆页，重定向到首页

在main.js文件中import导入permission



## 四、全局utils

### 1、validate（✓）

| 函数          | 作用                                                         |
| ------------- | ------------------------------------------------------------ |
| isExternal    | 判断链接是否外部链接                                         |
| validUsername | 判断用户名是否在有效范围，当前硬编码为admin、editor两个用户名 |

### 2、request（✓）

1. 外部操作

   引入axios@0.18.1 ，先安装它

   创建src/utils/auth ，并从中引入getToken

   配置环境变量。配置方法参考：[模式和环境变量 | Vue CLI (vuejs.org)](https://cli.vuejs.org/zh/guide/mode-and-env.html#环境变量)，当前只设置了`.env.development`

   创建store/module/user，并从中引入resetToken（重置或删除token）

2. 作用：

   创建axios实例，并设置baseURL（实际url为baseURL+request url）

   设置request拦截器，为所有request请求头部添加token

   设置response拦截器，为返回状态码不为20000（Mock中自定义的数字）定义处理逻辑，首先报错；然后检查是否用户已登出，如果登出给出是否跳转登陆页的选项



### 3、auth（✓）

使用js-cookie包，通过cookie来保存、获取、设置、删除token。TokenKey为'vue_admin_template_token'



#### 4、get-page-title（✓）

获取每个页面的标题。传入路由的meta.title，返回settings里的title加上传入的参数。如果传入参数为空，返回settings的title



## 五、全局components（✓）

### 1、SvgIcon（✓）

如果是通过外部链接提供的图标，那么直接通过style样式mask引入。否则，通过iconName引用内部svg。iconName等于''#icon'加上iconClass

1. props

   | 参数      | 备注             | 含义                                  |
   | --------- | ---------------- | ------------------------------------- |
   | iconClass | 必需             | icon的类，用来组成iconName（引用svg） |
   | className | 默认值为空字符串 | 内部图标（引用svg）的class属性        |


### 2、Breadcrumb（✓）

根据当前页面的路由$route.matched属性，生成面包屑导航。面包屑的每个子项根据route.redirect属性、或者是否为最后$route.matched的最后一项（也就是当前页面）来决定该项是否可以点击跳转

1. 安装path-to-regexp@2.4.0到依赖，并导入

2. data()

   | 变量      | 含义                                                    |
   | --------- | ------------------------------------------------------- |
   | levellist | 面包屑的路由数组，初始化为null，在getBreadcrumb()中获取 |

3. watch

   | 变量   | 含义                                          |
   | ------ | --------------------------------------------- |
   | $route | 监测当前页面路由的变化，调用getBreadcrumb方法 |

4. created()，加载页面时调用getBreadcrumb方法，初始化levelList的值

5. methods

   | 函数          | 作用                                       |
   | ------------- | ------------------------------------------ |
   | getBreadcrumb | 根据$route对象，获取levelList              |
   | isDashboard   | 判断是否是dashboard路由                    |
   | pathCompile   | 解决面包屑导航不支持/:id/xxx导航方式的问题 |
   | handleLink    | 处理面包屑的导航链接                       |

### 3、Hamburger（✓）

顶部导航栏Navbar左侧的一个按钮组件，设置了一个点击事件（在Navbar中被用来控制侧边栏状态）

1. props

   | 变量     | 默认值 | 含义                                                |
   | -------- | ------ | --------------------------------------------------- |
   | isActive | false  | boolean值，跟侧边栏状态间接相关，跟图标样式直接相关 |

2. methods

   | 函数        | 作用                               |
   | ----------- | ---------------------------------- |
   | toggleClick | 处理点击事件，向父组件传递函数接口 |



## 六、styles（✓）

| 文件            | 作用                                       |
| --------------- | ------------------------------------------ |
| variables.scss  | 定义了侧边导航栏的样式属性（颜色、宽度等） |
| element-ui.scss | 覆盖一些element-ui自带的样式               |
| sidebar.scss    | 定义sidebar的样式                          |
| transition.scss | 全局的过渡动画样式                         |
| mixin.scss      | **暂时未知？？？**                         |
| index.scss      | 合并以上所有，再加入其余全局样式           |

在main.js文件中导入，去除App.vue默认的配置



## 七、store对象（✓）

改造默认的stroe，引入module属性，将state、actions、mutations拆分到不同模块里面，对应不同的功能模块。定义一个getters

### 1、getters.js（✓）

| 变量    | 说明                   |
| ------- | ---------------------- |
| sidebar | store.app的sidebar对象 |
| device  | store.app的device对象  |
| avatar  | state.user.avatar      |
| token   | state.user.token       |
| name    | state.user.name        |



### 2、modules（✓）

#### 1）settings.js（✓）

| state变量                     | 说明                     |
| ----------------------------- | ------------------------ |
| fixedHeader                   | 是否fix header，不太理解 |
| sidebarLogo                   | 是否展示侧边导航栏的Logo |
|                               |                          |
| **actions**                   |                          |
| changeSettings({commit},data) | 修改设置                 |

#### 2）app.js（✓）

引入了js-cookie@2.2.0，先安装这个包

| state         | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| sidebar       | sidebar对象，包括2个属性：opened（是否展开侧边栏）、withoutAnimation |
| device        | 当前设备类型，device/mobile                                  |
|               |                                                              |
| **actions**   |                                                              |
| toggleSidebar | 切换侧边栏状态：展开/折叠                                    |
| closeSidebar  | 关闭侧边栏，还携带了一个对象参数{ *withoutAnimation* }       |
| toggleDevice  | 切换设备类型，携带了一个参数device                           |

#### 3）user.js（✓）

创建src/api/user，并引入login, logout, getInfo3个函数

在src/router中添加resetRouter函数，并引入

| state       |                                                              |
| ----------- | ------------------------------------------------------------ |
| token       | 用户（签名）token，调用getToken从cookie中获取                |
| name        | 用户名                                                       |
| avator      | 头像链接                                                     |
|             |                                                              |
| **actions** |                                                              |
| login       | 调用api的login函数，传入用户名和密码；回调之后分别在state和cookie中设置新的token |
| getInfo     | 调用api的getIfon函数，传入token；回调之后，在state中设置获取到的name和avatar |
| logout      | 调用api的logout函数，传入token；回调之后，删除cookie中的token、重置路由、重置state |
| resetToken  | 删除cookie中的token、重置state                               |



## 八、路由（✓）

```
/**
 * 子菜单仅在子路由数组的长度>1时才出现
 * 参数解析：
 * hidden：true/false     如果为true，不显示在侧边栏导航里
 * alwaysShow：true/false 如果为true，将总是显示根路由。如果不设置这个值，当路由拥有超过1个子路由时，它将变成嵌套式菜单；其它情况只显示根路由
 * redirect：noRedirect   如果设置为noRedirect，面包屑导航中将不能点击跳转
 * name：router-name      路由对象的名称，被用在配合<keep-alive>标签使用，必须设置（目测该项目当前没有用到keep-alive，应该是在tab-views导航栏中使用）
 * meta:{
 *  roles:['admin','editor']      控制页面权限，表示当前页面需要什么角色才有权限访问
 *  title:'title'                 路由的title，被展示在侧边栏和面包屑导航中
 *  icon:'svg-name' / 'el-icon-x' 路由的icon，被展示在侧边栏导航中
 *  breadcrumb:false              如果设置为false，该路由不会被显示在面包屑导航中，默认为true
 *  activeMenu:'/example/list'    如果设置了该值，跳转到该路由页面时，该值指定的path对应的侧边栏对象会被高亮（默认情况下高亮当前页面路由对应的侧边栏对象）
 * }
 */
```

提前完成了/login和table的路由，所有静态路由已编写好



## 九、Mock

**api需求：**（以下的url省略了baseURL，实际url为baseURL+url）

| url                   | 请求类型 | 传入参数                               | 期待返回值                                                   |
| --------------------- | -------- | -------------------------------------- | ------------------------------------------------------------ |
| /table/list           | get      | 空                                     | object数组<br />title：string<br />author：string<br />pageViews：number<br />status：string<br />display_time |
| /user/login           | post     | object<br />username：<br />password： | {data:{token:xxx},...}                                       |
| /user/info/?token=xxx | get      | 空                                     | {data:{name:xx,avatar:xx},...}                               |
| /user/logout          | post     | token                                  | 状态码即可                                                   |

dev环境下：baseURL：`/dev-api`

安装mockjs@1.0.1-beta3

在main.js引入mock-simple



## 十、查看build项目

运行`npm run build`后，生成了dist目录，但是如何查看生成的结果呢？（直接点击index.html是没有响应的）

这涉及到/build目录，和package.json的scripts都preview命令

## 十一、部署到github page

部署原理，将dist目录下的所有文件上传到仓库（或者直接上传到github.io），然后就可以直接访问了

1. 在/dist根目录下新建一个git仓库
2. 提交所以内容，并同步在远程仓库（我在这里选择了github.io）
3. 稍等一会儿，即可在线预览

```bash
cd dist 
git init
git add -A
git commit -m 'deploy部署'
git remote add origin git@github.com:Qiuzcc/Qiuzcc.github.io.git
git push -u origin master
```

以上操作方式的缺陷在于，它是一次性部署，如果项目更改了，重新build了项目，只能再次手动提交修改，做不到自动化（或说半自动化部署）

## 附：问题合集

1. componets/SvgIcon/index.vue文件里，computed属性里，svgClass，第一个'svg-icon'后面是否还要再加一个'-'，即'svg-icon-'

2. 处理bug，安装normalize.css@7.0.0

3. bug，图标没显示。没有在main.js引入icons文件夹，引入解决

4. bug，侧边栏标题没显示，全部为undefined。文本插值使用了双重大括号，正确用法应为单重大括号，纠正后解决

5. bug，点击顶部导航【切换】按钮，无响应。Navbar组件中方法名前后拼写不一致，纠正拼写解决

6. bug，form页面不显示，提示没有name属性。data定义错误，属性没有包裹在form对象内，纠正后解决。

7. bug，面包屑导航不工作不显示。问题一：箭头函数使用错误，函数体使用大括号包裹却没有return值（看了半天才发现这个问题，人傻了）。问题二：一样的错误，levelList后面的箭头函数使用错误，函数体用大括号包裹但是没有return。纠正后解决

8. bug，面包屑导航点击报错不跳转。在pathCompile函数中使用route不正确，原来：`this.route`，错误：少了`$`前缀，正确为：`this.$route`才能正确访问到当前页面路由对象。纠正后解决

9. 问题，点击面包屑导航重定向到当前页时，控制台会输出一个红色提示：

   ```
   Uncaught (in promise) NavigationDuplicated: Avoided redundant navigation to current location:
   ```

   意思是避免冗余的重定向，虽然不影响正常功能，但是控制台输出一大段红色提示很不好看，这个问题应该怎么解决？？？

10. bug，right menu样式不正确，占用到了AppMain的位置，而且被覆盖了。right menu的el-dropdown的类名拼写错误，原本：`class=avator-container`，错误：a写成了o，正确应该为：'class=avatar-container'。纠正后解决

11. bug，Table中的数据显示不出来。获取返回的数据格式不对，应该是接收数组，但是接收到了object。纠正后解决