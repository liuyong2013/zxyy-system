import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, {locale})
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont.css'
import '@/assets/styles/main.scss'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//去掉引用的mock
// import Mock from './mock'
//Mock.bootstrap();

import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  console.log({'user': user});
  if (!user && to.path != '/login') {
    next({path: '/login'});
  } else {
    next();
  }
});

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')


window.router = router;
