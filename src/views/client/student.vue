<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/index' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>学生信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="学生名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getStudentPage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleShare">分享链接</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <!-- <el-table-column type="index" width="60"></el-table-column> -->
      <el-table-column prop="stuId" label="学生ID" width="100" sortable></el-table-column>
      <el-table-column prop="stuName" label="学生姓名" width="120" sortable></el-table-column>
      <el-table-column prop="stuMail" label="用户名" width="120" sortable></el-table-column>
      <el-table-column prop="stuSex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="stuPhone" label="手机号" width="130" sortable></el-table-column>
      <el-table-column prop="stuAddress" label="地址" min-width="150" sortable></el-table-column>
      <el-table-column prop="stuStatus" label="状态" width="100" :formatter="formatStatus" sortable></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <!-- <el-button type="warning"  size="small"  @click="handleIsStart(scope.$index, scope.row)">禁用</el-button> -->
          <!-- <el-button type="primary" :disabled="scope.row.state === 0" size="small" @click="dialogFormVisible = false">禁用</el-button> -->
          <!-- <el-button type="success"  size="small"  @click="handleSeeCourse(scope.$index, scope.row)">查看课表</el-button> -->
          <el-button type="small" @click="dialogTableVisible = true">课程</el-button>
          <el-button type="small" @click="dialogTableVisible = true">课表</el-button>
          <!-- 状态开关   v-model="switchStatus"-->
          <!-- <el-switch  v-model="value2"  @click="handleStudentStatus(scope.$index, scope.row)"  active-color="#13ce66"  inactive-color="#ff4949"></el-switch> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 学生关联课程弹出框-->
    <el-dialog title="所选课程列表" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="courseName" label="课程名称" width="150"></el-table-column>
        <el-table-column property="courseTotalnum" label="课时数" width="120"></el-table-column>
        <el-table-column property="maxCancelNul" label="可取消次数" width="120"></el-table-column>
        <el-table-column property="cancelTotal" label="累计次数" width="120"></el-table-column>
        <el-table-column prop="courseStatus" label="状态" width="100" :formatter="formatCourseStatus" sortable></el-table-column>
        <el-table-column label="操作" min-width="140">
          <template scope="scope">
            <el-button size="small" @click="handleStopCourse(scope.$index, scope.row)">结课</el-button>
            <el-button type="danger" size="small" @click="handleScore(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="editForm.stuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-radio-group v-model="editForm.stuSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="stuPhone">
          <el-input v-model="editForm.stuPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="stuAddress">
          <el-input v-model="editForm.stuAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="stuMail">
          <el-input v-model="editForm.stuMail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="stuPwd">
          <el-input v-model="editForm.stuPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-select v-model="editForm.deptId" placeholder="请选择部门名称">
            <el-option label="新东方前途事业部" value="001"></el-option>
            <el-option label="欧亚事业部" value="002"></el-option>
            <el-option label="美研一部" value="003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="stuStatus">
          <el-radio-group v-model="editForm.stuStatus">
            <el-radio class="radio" :label="0">启用</el-radio>
            <el-radio class="radio" :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除" prop="flag">
          <el-radio-group v-model="editForm.flag">
            <el-radio class="radio" :label="0">是</el-radio>
            <el-radio class="radio" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        <el-button @click.native="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="addForm.stuName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="stuSex">
          <el-radio-group v-model="addForm.stuSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="stuPhone">
          <el-input v-model="addForm.stuPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="stuAddress">
          <el-input v-model="addForm.stuAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="stuMail">
          <el-input v-model="addForm.stuMail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="stuPwd">
          <el-input v-model="addForm.stuPwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称">
          <el-select v-model="addForm.deptId" placeholder="请选择部门名称">
            <el-option label="新东方前途事业部" value="001"></el-option>
            <el-option label="欧亚事业部" value="002"></el-option>
            <el-option label="美研一部" value="003"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="stuStatus">
          <el-radio-group v-model="addForm.stuStatus">
            <el-radio class="radio" :label="0">启用</el-radio>
            <el-radio class="radio" :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否删除" prop="flag">
          <el-radio-group v-model="addForm.flag">
            <el-radio class="radio" :label="0">是</el-radio>
            <el-radio class="radio" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        <el-button @click.native="addFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {getStudentPage, saveStudent, getStudent, deleteStudent, updateStudent, ShareToStudent} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        users: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          stuName: [
            {required: true, message: '请输入学生姓名', trigger: 'blur'}
          ]
        },
        // 测试状态开关
        value1: true,
        value2: true,
        // 测试表格
        gridData: [{
          courseName: 'English center1',
          courseTotalnum: 10,
          maxCancelNul: 5,
          cancelTotal: 3,
          courseStatus: 0
        }, {
          courseName: 'English center1',
          courseTotalnum: 10,
          maxCancelNul: 5,
          cancelTotal: 3,
          courseStatus: 0
        }, {
          courseName: 'English center1',
          courseTotalnum: 10,
          maxCancelNul: 5,
          cancelTotal: 3,
          courseStatus: 1
        }, {
          courseName: 'English center1',
          courseTotalnum: 10,
          maxCancelNul: 5,
          cancelTotal: 3,
          courseStatus: 1
        }],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px',
        //编辑界面数据
        editForm: {
          stuId: 0,
          stuName: '',
          stuSex: '',
          stuPhone: '',
          stuAddress: '',
          deptId: '',
          stuMail: '',
          stuPwd: '',
          stuStatus: 0,
          flag: 1
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          stuName: [
            {required: true, message: '请输入学生姓名', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          stuName: '',
          stuSex: '',
          stuPhone: '',
          stuAddress: '',
          deptId: '',
          stuMail: '',
          stuPwd: '',
          stuStatus: 0,
          flag: 1
        }


      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.stuStatus == 0 ? '启用' : row.stuStatus == 1 ? '停用' : '未知';
      },
      formatFlag: function (row, column) {
        return row.flag == 0 ? '否' : row.flag == 1 ? '是' : '未知';
      },
      formatSex: function (row, column) {
        return row.stuSex == 0 ? '男' : row.stuSex == 1 ? '女' : '未知';
      },
      formatDept: function (row, column) {
        return row.deptId == 0 ? '欧亚事业部' : row.deptId == 1 ? '前途出国' : '未知';
      },
      formatCourseStatus: function (row, column) {
        return row.courseStatus == 0 ? '正常' : row.courseStatus == 1 ? '已结课' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getStudentPage();
      },

      //获取用户列表
      getStudentPage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getStudentPage(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            this.total = datas.total;
            this.users = datas.list;
            this.listLoading = false;
          }
          //NProgress.done();
        });
      },
      //状态改变
      handleStudentStatus: function (index, row) {
        this.$confirm('是否改变状态吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {"stuId": row.stuId};
          deleteStudent(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getStudentPage();
            }

          });
        }).catch(() => {

        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {"stuId": row.stuId};
          deleteStudent(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getStudentPage();
            }

          });
        }).catch(() => {

        });
      },
      //是否启用
      handleIsStart: function (index, row) {
        this.$confirm('确认操作该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {"stuId": row.stuId};
          isStatus(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getStudentPage();
            }

          });
        }).catch(() => {

        });
      },

      //分享链接
      handleShare: function () {
        this.$confirm('确认分享链接吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {"context": "测试数据"};
          ShareToStudent(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.$message({
                message: message,
                type: 'success'
              });
              this.getStudentPage();
            }

          });
        }).catch(() => {

        });
      },
      //查看课表并对课表进行逻辑操作（结课~~~~~~）
      handleSeeCourse: function (index, row) {
        this.$confirm('确认查看课程列表吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {"stuId": row.stuId};
          CourseList(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getStudentPage();
            }

          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        let param = new URLSearchParams();
        param.append("stuId", row.stuId);
        //NProgress.start();
        getStudent(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            this.editFormVisible = true;
            this.editForm = Object.assign(datas, row);
          }
          //NProgress.done();
        });
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          stuName: '',
          stuSex: '',
          stuPhone: '',
          stuAddress: '',
          deptId: '',
          stuMail: '',
          stuPwd: '',
          stuStatus: 0,
          flag: 1
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              updateStudent(para).then((res) => {
                console.log(res)
                this.editLoading = false;
                let {message, status, datas} = res;
                if (status !== 0) {
                  this.$message({
                    message: message,
                    type: 'error'
                  });
                } else {
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getStudentPage();
                }
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let param = Object.assign({}, this.addForm);
              saveStudent(param).then((res) => {
                this.addLoading = false;
                let {message, status, datas} = res;
                if (status !== 0) {
                  this.$message({
                    message: message,
                    type: 'error'
                  });
                } else {
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getStudentPage();
                }
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.stuId).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {stuId: ids};
          deleteStudent(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getStudentPage();
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getStudentPage();
    }
  }

</script>

<style scoped>

</style>
