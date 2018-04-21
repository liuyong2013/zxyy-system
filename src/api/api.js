import qs from 'qs';
import axios from 'axios';


axios.defaults.validateStatus = status => {
  return status < 500
}
// 设置请求token
axios.interceptors.request.use(config => {
  var token = sessionStorage.getItem('token')
  config.headers['Authorization'] = 'Bearer ' + token
  console.log(config)
  return config
})
// 接口错误拦截

axios.interceptors.response.use(res => {
  if (res.status === 401) {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('token')
    router.push({path: '/login'});
    return res
  } else {
    return res
  }
}, err => {
  return Promise.reject(err)
})


let base = 'http://10.149.0.173:7081';

//公共登陆部分
export const requestToken = params => {
  return axios.post(`${base}/oauth/token`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const requestUser = params => {
  return axios.post(`${base}/auth/getUserInfo`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};

//课程维护方法
export const getCoursePage = params => {
  return axios.post(`${base}/zxyy/course/select`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const saveCourse = params => {
  return axios.post(`${base}/zxyy/course/insert`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const getCourse = params => {
  return axios.post(`${base}/zxyy/course/getCourseByID`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const updateCourse = params => {
  return axios.post(`${base}/zxyy/course/update`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const deleteCourse = params => {
  return axios.post(`${base}/zxyy/course/delete`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};

//教师维护方法
export const getMasterPage = params => {
  return axios.post(`${base}/zxyy/teacher/getTeacherPage`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const saveMaster = params => {
  return axios.post(`${base}/zxyy/teacher/saveTeacher`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const getMaster = params => {
  return axios.post(`${base}/zxyy/teacher/getTeacherByID`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const updateMaster = params => {
  return axios.post(`${base}/zxyy/teacher/changeOne`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const deleteMaster = params => {
  return axios.post(`${base}/zxyy/teacher/deleteTeacher`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const getCourseList = params => {
  return axios.post(`${base}/zxyy/course/findAllBydeptId`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const getZoneList = params => {
  return axios.post(`${base}/zxyy/teacher/findAllTimeZone`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
//根据教师查课程列表
export const getCourseByTea = params => {
  return axios.post(`${base}/zxyy/teacher/findcoursBytea`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
//查询所有部门学生列表
export const getAllStu = params => {
  return axios.post(`${base}/zxyy/Student/findStuByDept`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
//根据老师和课程查所有已分配学生
export const getStuByTea = params => {
  return axios.post(`${base}/zxyy/teacher/findstuByCour`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
//分配老师
export const relationTeaStu = params => {
  return axios.post(`${base}/zxyy/teacher/relationTeaAndStu`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};


//审核信息维护方法
export const getAuditPage = params => {
  return axios.post(`${base}/zxyy/Audit/seeALl`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const getAudit = params => {
  return axios.post(`${base}/zxyy/Audit/seeOne`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
export const auditData = params => {
  return axios.post(`${base}/zxyy/Audit/aduitbyId`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};


//学生维护方法
// 获取列表
export const getStudentPage = params => {
  return axios.post(`${base}/zxyy/Student/select`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
// 新增
export const saveStudent = params => {
  return axios.post(`${base}/zxyy/Student/insert`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
//根据当前学生ID获取用户信息
export const getStudent = params => {
  return axios.post(`${base}/zxyy/Student/getStudentId`, params,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
// 修改
export const updateStudent = params => {
  return axios.post(`${base}/zxyy/Student/update`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
// 删除
export const deleteStudent = params => {
  return axios.post(`${base}/zxyy/Student/delete`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};
// 分享链接
export const ShareToStudent = params => {
  return axios.post(`${base}/zxyy/Student/ShareToStudent`, qs.stringify(params),
    {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}}).then(res => res.data);
};

//示例：mock方法，无后台
export const getUserList = params => {
  return axios.get(`${base}/admin/test`, {params: params});
};
export const getUserListPage = params => {
  return axios.get(`${base}/user/listpage`, {params: params});
};
export const removeUser = params => {
  return axios.get(`${base}/user/remove`, {params: params});
};
export const batchRemoveUser = params => {
  return axios.get(`${base}/user/batchremove`, {params: params});
};
export const editUser = params => {
  return axios.get(`${base}/user/edit`, {params: params});
};
export const addUser = params => {
  return axios.get(`${base}/user/add`, {params: params});
};
