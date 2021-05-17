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
            meta: { title: '首页', icon: 'el-icon-data-line' }
        }]
    },

    {
        path: '/system',
        component: Layout,
        redirect: '/system/user',
        name: 'System',
        meta: { title: '系统管理', icon: 'el-icon-first-aid-kit' },
        children: [
            {
                path: 'user',
                name: 'User',
                component: () => import('@/views/system/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user' }
            },
            {
                path: 'admin',
                name: 'Admin',
                component: () => import('@/views/system/admin/index'),
                meta: { title: '医生管理', icon: 'el-icon-monitor' }
            },
            {
                path: 'config',
                name: 'Config',
                component: () => import('@/views/system/config/index'),
                meta: { title: '诊所配置', icon: 'el-icon-set-up' }
            },
        ]
    },

    {
        path: '/application',
        component: Layout,
        redirect: '/application/appointment',
        name: 'Application',
        meta: { title: '申请管理', icon: 'el-icon-s-check' },
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
                meta: { title: '紧急呼救', icon: 'el-icon-phone-outline' }
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
        redirect: '/record/list',
        name: 'MedicalRecord',
        meta: { title: '病历管理', icon: 'el-icon-document' },
        children: [
            {
                path: 'list',
                name: 'MedicalRecord',
                component: () => import('@/views/record/index'),
                meta: { title: '病历管理', icon: 'el-icon-document' }
            },
            {
                path: 'create',
                component: () => import('@/views/record/create'),
                name: 'CreateRecord',
                meta: { title: '新增病历', noCache: true, activeMenu: '/record/list' },
                hidden: true
            },
            {
                path: 'edit/:id',
                component: () => import('@/views/record/edit'),
                name: 'EditRecord',
                meta: { title: '编辑病历', noCache: true, activeMenu: '/record/list' },
                hidden: true
            },
        ]
    },

    {
        path: '/finance',
        component: Layout,
        redirect: '/finance/index',
        name: 'FinanceManagement',
        meta: { title: "财务管理", icon: 'el-icon-wallet' },
        children: [
            {
                path: 'order',
                name: 'Order',
                component: () => import('@/views/finance/order'),
                meta: { title: '订单管理', icon: 'el-icon-collection-tag' }
            },
            {
                path: 'statistics',
                name: 'Statistics',
                component: () => import('@/views/finance/statistics'),
                meta: { title: '财务统计', icon: 'el-icon-coin' }
            }
        ]
    },

    {
        path: '/messageboard',
        component: Layout,
        redirect: '/messageboard/message',
        name: 'MessageBoard',
        meta: { title: "留言管理", icon: 'el-icon-message' },
        children: [
            {
                path: 'message',
                name: 'Message',
                component: () => import('@/views/messageboard/message'),
                meta: { title: '用户留言', icon: 'el-icon-chat-line-square' }
            },
            {
                path: 'evaluate',
                name: 'Evaluate',
                component: () => import('@/views/messageboard/evaluate'),
                meta: { title: '服务评价', icon: 'el-icon-star-off' }
            },
            {
                path: 'suggestion',
                name: 'Suggestion',
                component: () => import('@/views/messageboard/suggestion'),
                meta: { title: '改进建议', icon: 'el-icon-thumb' }
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
