import qs from 'qs';
import axios from 'axios';


axios.defaults.validateStatus = status => {
  return status < 500;
};
// 设置请求token
axios.interceptors.request.use(config => {
  var token = sessionStorage.getItem('token');
  config.headers['Authorization'] = 'Bearer ' + token;
  console.log(config);
  return config;
});
// 接口错误拦截

axios.interceptors.response.use(res => {
  if (res.status === 401) {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    router.push({path: '/login'});
    return res;
  } else {
    return res;
  }
}, err => {
  return Promise.reject(err)
});


// let base = 'http://10.149.0.114:7081';
/*10.149.0.173:7081*/
// axios.defaults.baseURL = 'http://10.202.203.57:7081';
// axios.defaults.baseURL = 'http://10.149.0.173:7081';
axios.defaults.baseURL = 'http://10.149.0.114:7081';
axios.defaults.timeout = 1000 * 15;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
axios.defaults.headers.get['Content-Type'] = 'application/json'

//公共登陆部分
export const requestToken = params => {
  return axios.post('/oauth/token', params).then(res => res.data);
};
export const requestUser = params => {
  return axios.post('/auth/getUserInfo', params).then(res => res.data);
};

//分管用户信息
export const getFGUser = params => {
  return axios.post('/auth/getUserInfo', params).then(res => res.data);
};