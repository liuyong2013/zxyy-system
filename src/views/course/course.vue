<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/index' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>课程信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="课程名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getCoursePage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="courseId" label="课程ID" width="120" sortable></el-table-column>
      <el-table-column prop="courseName" label="课程名称" min-width="180" sortable></el-table-column>
      <el-table-column prop="chName" label="中文名" width="100" sortable></el-table-column>
      <el-table-column prop="enName" label="英文名" width="120" sortable></el-table-column>
      <el-table-column prop="courseTotalnum" label="课时数" width="120" sortable></el-table-column>
      <el-table-column prop="courseStatus" label="状态" width="100" :formatter="formatStatus" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="课程名字" prop="courseName">
          <el-input v-model="editForm.courseName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="chName">
          <el-input v-model="editForm.chName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="enName">
          <el-input v-model="editForm.enName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="courseTotalnum">
          <el-input-number v-model="editForm.courseTotalnum" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="courseStatus">
          <el-radio-group v-model="editForm.courseStatus">
            <el-radio class="radio" :label="0">启用</el-radio>
            <el-radio class="radio" :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="课程名字" prop="courseName">
          <el-input v-model="addForm.courseName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="中文名" prop="chName">
          <el-input v-model="addForm.chName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="enName">
          <el-input v-model="addForm.enName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="courseTotalnum">
          <el-input-number v-model="addForm.courseTotalnum" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="courseStatus">
          <el-radio-group v-model="addForm.courseStatus">
            <el-radio class="radio" :label="0">启用</el-radio>
            <el-radio class="radio" :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {getCoursePage, saveCourse, getCourse, deleteCourse, updateCourse} from '../../api/api';

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
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          courseId: 0,
          courseName: '',
          chName: '',
          enName: '',
          courseTotalnum: -1,
          courseStatus: 0
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          courseName: '',
          chName: '',
          enName: '',
          courseTotalnum: -1,
          courseStatus: 0
        }

      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.courseStatus == 0 ? '启用' : row.courseStatus == 1 ? '停用' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getCoursePage();
      },
      //获取用户列表
      getCoursePage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getCoursePage(param).then((res) => {
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
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {courseId: row.courseId};
          deleteCourse(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getCoursePage();
            }

          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        let param = new URLSearchParams();
        param.append("courseId", row.courseId);
        //NProgress.start();
        getCourse(param).then((res) => {
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
          courseName: '',
          chName: '',
          enName: '',
          courseTotalnum: 0,
          courseStatus: 0
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
              updateCourse(para).then((res) => {
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
                  this.getCoursePage();
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
              saveCourse(param).then((res) => {
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
                  this.getCoursePage();
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
        var ids = this.sels.map(item => item.courseId).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {courseId: ids};
          deleteCourse(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getCoursePage();
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getCoursePage();
    }
  }

</script>

<style scoped>

</style>
