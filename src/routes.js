import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
//示例部分
import Table from './views/demo/Table.vue'
import Form from './views/demo/Form.vue'
//业务部分
import AdminIndex from './views/index/index.vue'
import Audit from './views/audit/audit.vue'
import Student from './views/client/student.vue'
import Course from './views/course/course.vue'
import Teacher from './views/master/master.vue'


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
            { path: '/admin/index', component: AdminIndex, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'iconfont icon-books',//图标样式class
        children: [
            { path: '/admin/course', component: Course, name: '课程信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-users',
        leaf: true,//只有一个节点
        children: [
            { path: '/admin/master', component: Teacher, name: '教师信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'iconfont icon-setting1',
        children: [
            { path: '/admin/client', component: Student, name: '学生信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '审核消息',
        iconCls: 'iconfont icon-setting1',
        children: [
            { path: '/admin/audit', component: Audit, name: '审核信息' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;