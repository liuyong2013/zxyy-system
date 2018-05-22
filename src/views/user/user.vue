<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/system/user' }"><b>分管用户</b></el-breadcrumb-item>
        <el-breadcrumb-item>用户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model.trim="filters.name" placeholder="老师名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getFgUserPage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="#" width="50"></el-table-column>
      <el-table-column prop="fgPersonName" label="分管用户名" min-width="120" sortable></el-table-column>
      <el-table-column prop="fgPersonSex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="fgPersonPhone" label="分管联系电话" min-width="120" sortable></el-table-column>
      <el-table-column prop="fgPersonStatus" label="状态" width="100" :formatter="formatStatus" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
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
    <el-dialog title="编辑" center :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="用户名：" prop="fgPersonName">
          <el-input v-model.trim="editForm.fgPersonName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="fgPersonSex">
          <el-radio-group v-model="editForm.fgPersonSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话：" prop="fgPersonPhone">
          <el-input v-model.trim="editForm.fgPersonPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="fgPersonStatus">
          <el-radio-group v-model="editForm.fgPersonStatus">
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
    <el-dialog title="新增" center :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
        <el-form-item label="用户名：" prop="fgPersonName">
          <el-input v-model.trim="addForm.fgPersonName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="fgPersonSex">
          <el-radio-group v-model="editForm.fgPersonSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
            cd
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话：" prop="fgPersonPhone">
          <el-input v-model.trim="addForm.fgPersonPhone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="fgPersonStatus">
          <el-radio-group v-model="editForm.fgPersonStatus">
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
  import {getFgUserPage, getFgUser, saveFgUser, updateFgUser, deleteFgUser} from '../../api/api';

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
          fgPersonName: [
            {required: true, message: '请输入老师名称', trigger: 'blur'}
          ]
        },
        //编辑界面数据
        editForm: {
          deptId: '',
          deptName: '',
          deptEmail: '',
          deptPassword: '',
          deptStatus: 0
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
        return row.fgPersonStatus === 0 ? '启用' : row.fgPersonStatus === 1 ? '停用' : '未知';
      },
      formatSex: function (row, column) {
        return row.fgPersonSex === 0 ? '男' : row.fgPersonSex === 1 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getFgUserPage();
      },
      //获取用户列表
      getFgUserPage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getFgUserPage(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            if (status === '' || status === undefined || status === null) {
              this.$message({
                type: 'error',
                message: '系统登录超时！',
              })
            } else {
              this.$message({
                message: message,
                type: 'error'
              });
            }
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
          let para = {fgPersonId: row.fgPersonId};
          deleteFgUser(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              if (status === '' || status === undefined || status === null) {
                this.$message({
                  type: 'error',
                  message: '系统登录超时！',
                })
              } else {
                this.$message({
                  message: message,
                  type: 'error'
                });
              }
            } else {
              this.getFgUserPage();
            }
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        let param = new URLSearchParams();
        param.append("fgPersonId", row.fgPersonId);
        //NProgress.start();
        getFgUser(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            if (status === '' || status === undefined || status === null) {
              this.$message({
                type: 'error',
                message: '系统登录超时！',
              })
            } else {
              this.$message({
                message: message,
                type: 'error'
              });
            }
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
          fgPersonName: '',
          fgPersonPhone: '',
          fgPersonSex: 0,
          fgPersonStatus: 0
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
              updateFgUser(para).then((res) => {
                this.editLoading = false;
                let {message, status, datas} = res;
                if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                    this.$message({
                      type: 'error',
                      message: '系统登录超时！',
                    })
                  } else {
                    this.$message({
                      message: message,
                      type: 'error'
                    });
                  }
                } else {
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.getFgUserPage();
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
              saveFgUser(param).then((res) => {
                this.addLoading = false;
                let {message, status, datas} = res;
                if (status !== 0) {
                  if (status === '' || status === undefined || status === null) {
                    this.$message({
                      type: 'error',
                      message: '系统登录超时！',
                    })
                  } else {
                    this.$message({
                      message: message,
                      type: 'error'
                    });
                  }
                } else {
                  this.$refs['addForm'].resetFields();
                  this.addFormVisible = false;
                  this.getFgUserPage();
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
        let ids = this.sels.map(item => item.fgPersonId).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {fgPersonId: ids};
          deleteFgUser(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              if (status === '' || status === undefined || status === null) {
                this.$message({
                  type: 'error',
                  message: '系统登录超时！',
                })
              } else {
                this.$message({
                  message: message,
                  type: 'error'
                });
              }
            } else {
              this.getFgUserPage();
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getFgUserPage();
    }
  }
</script>

<style scoped>

</style>
