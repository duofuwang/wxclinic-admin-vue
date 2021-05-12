import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


// //解决vue路由重复导航错误
// //获取原型对象上的push函数
// const originalPush = Router.prototype.push
// //修改原型对象中的push方法
// Router.prototype.push = function push(location) {
//     return originalPush.call(this, location).catch(err => err)
// }

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
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
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: '首页', icon: 'el-icon-s-home' }
        }]
    },

    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        name: 'System',
        meta: { title: '系统管理', icon: 'el-icon-s-tools' },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/system/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user-solid' }
            },
            {
                path: 'admin',
                name: 'Admin',
                component: () => import('@/views/system/admin/index'),
                meta: { title: '管理员', icon: 'el-icon-s-platform' }
            }
        ]
    },

    {
        path: '/application',
        component: Layout,
        redirect: '/application/appointment',
        name: 'Application',
        meta: { title: '申请管理', icon: 'el-icon-tickets' },
        children: [
            {
                path: 'appointment',
                name: 'Appointment',
                component: () => import('@/views/application/appointment/index'),
                meta: { title: '预约申请', icon: 'el-icon-time' }
            },
            {
                path: 'visit',
                name: 'Visit',
                component: () => import('@/views/application/visit/index'),
                meta: { title: '出诊申请', icon: 'el-icon-bicycle' }
            }
        ]
    },

    {
        path: '/emergency',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Emergency',
                component: () => import('@/views/emergency/index'),
                meta: { title: '紧急呼救', icon: 'el-icon-phone' }
            }
        ]
    },

    {
        path: '/article',
        component: Layout,
        redirect: '/article/list',
        name: 'Article',
        meta: { title: '文章管理', icon: 'el-icon-notebook-1' },
        children: [
            {
                path: 'list',
                name: 'ArticleList',
                component: () => import('@/views/article/index'),
                meta: { title: '文章列表', icon: 'el-icon-document' }
            },
            {
                path: 'create',
                name: 'CreateArticle',
                component: () => import('@/views/article/create'),
                meta: { title: '发布文章', icon: 'el-icon-edit-outline' }
            },
            {
                path: 'edit/:id',
                component: () => import('@/views/article/edit'),
                name: 'EditArticle',
                meta: { title: '编辑文章', noCache: true, activeMenu: '/article/list' },
                hidden: true
            },
        ]
    },

    {
        path: '/record',
        component: Layout,
        children: [
            {
                path: 'index',
                name: 'Medical Record',
                component: () => import('@/views/record/index'),
                meta: { title: '病历管理', icon: 'form' }
            }
        ]
    },

    {
        path: '/nested',
        component: Layout,
        redirect: '/nested/menu1',
        name: 'Nested',
        meta: {
            title: 'Nested',
            icon: 'nested'
        },
        children: [
            {
                path: 'menu1',
                component: () => import('@/views/nested/menu1/index'), // Parent router-view
                name: 'Menu1',
                meta: { title: 'Menu1' },
                children: [
                    {
                        path: 'menu1-1',
                        component: () => import('@/views/nested/menu1/menu1-1'),
                        name: 'Menu1-1',
                        meta: { title: 'Menu1-1' }
                    },
                    {
                        path: 'menu1-2',
                        component: () => import('@/views/nested/menu1/menu1-2'),
                        name: 'Menu1-2',
                        meta: { title: 'Menu1-2' },
                        children: [
                            {
                                path: 'menu1-2-1',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                                name: 'Menu1-2-1',
                                meta: { title: 'Menu1-2-1' }
                            },
                            {
                                path: 'menu1-2-2',
                                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                                name: 'Menu1-2-2',
                                meta: { title: 'Menu1-2-2' }
                            }
                        ]
                    },
                    {
                        path: 'menu1-3',
                        component: () => import('@/views/nested/menu1/menu1-3'),
                        name: 'Menu1-3',
                        meta: { title: 'Menu1-3' }
                    }
                ]
            },
            {
                path: 'menu2',
                component: () => import('@/views/nested/menu2/index'),
                name: 'Menu2',
                meta: { title: 'menu2' }
            }
        ]
    },

    {
        path: '/external-link',
        component: Layout,
        children: [
            {
                path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
                meta: { title: 'External Link', icon: 'link' }
            }
        ]
    },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
