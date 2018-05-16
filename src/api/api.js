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
// axios.defaults.baseURL = 'http://10.149.0.173:7081';
axios.defaults.baseURL = 'http://10.149.0.114:7081';
// axios.defaults.baseURL = 'http://10.149.0.202:7081';
// axios.defaults.baseURL = 'http://127.0.0.1:7081';
// axios.defaults.baseURL = 'http://10.202.203.57:7081';
axios.defaults.timeout = 1000 * 30;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.get['Content-Type'] = 'application/json';

//公共登陆部分
export const requestToken = params => {
  return axios.post('/oauth/token', params).then(res => res.data);
};
export const requestUser = params => {
  return axios.post('/auth/getUserInfo', params).then(res => res.data);
};

//分管用户信息
export const getFgUserPage = params => {
  return axios.post('/zxyy/FgPersion/select', params).then(res => res.data);
};
export const getFgUser = params => {
  return axios.post('/zxyy/FgPersion/selectId', params).then(res => res.data);
};
export const saveFgUser = params => {
  return axios.post('/zxyy/FgPersion/insert', qs.stringify(params)).then(res => res.data);
};
export const updateFgUser = params => {
  return axios.post('/zxyy/FgPersion/update', qs.stringify(params)).then(res => res.data);
};
export const deleteFgUser = params => {
  return axios.post('/zxyy/FgPersion/delete', qs.stringify(params)).then(res => res.data);
};

//部门信息维护
export const getDepartPage = params => {
  return axios.post('/zxyy/department/getDepartList', params).then(res => res.data);
};
export const getDepartUser = params => {
  return axios.post('/zxyy/department/getDepartById', params).then(res => res.data);
};
export const saveDepartUser = params => {
  return axios.post('/zxyy/department/insert', qs.stringify(params)).then(res => res.data);
};
export const updateDepartUser = params => {
  return axios.post('/zxyy/department/update', qs.stringify(params)).then(res => res.data);
};
export const deleteDepartUser = params => {
  return axios.post('/zxyy/department/delete', qs.stringify(params)).then(res => res.data);
};

