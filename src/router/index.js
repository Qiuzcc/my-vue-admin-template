import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import Layout from '@/layout'

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

/**
 * 基础路由，所有用户都有权限访问，但是要登陆
 * 所有组件采用懒加载方式
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/tree',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Form',
      component: () => import('@/views/form/index'),
      meta: { title: 'Form', icon: 'form' }
    }]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: { title: 'Nested', icon: 'nested' },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        component: () => import('@/views/nested/menu1/index'),
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1/index'),
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            name: 'Menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2/index'),
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                name: 'Menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1/index'),
                meta: { title: 'Menu1-2-1' },
              },
              {
                path: 'menu1-2-2',
                name: 'Menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2/index'),
                meta: { title: 'Menu1-2-2' },
              }
            ]
          },
          {
            path: 'menu1-3',
            name: 'Menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3/index'),
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'Menu2' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://www.timegogo.top',
      meta: { title: '外链', icon: 'link' }
    }]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter()

export default router;