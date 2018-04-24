import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
//业务部分
import Dept from './views/dept/dept.vue'
import User from './views/user/user.vue'
import SysIndex from './views/index/index.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-home',
        leaf: true,//只有一个节点
        children: [
            { path: '/system/index', component: AdminIndex, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'iconfont icon-books',//图标样式class
        children: [
            { path: '/system/dept', component: Dept, name: '部门管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-users',
        leaf: true,//只有一个节点
        children: [
            { path: '/system/user', component: User, name: '分管用户' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;