<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/system/dept' }"><b>部门管理</b></el-breadcrumb-item>
        <el-breadcrumb-item>部门信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getDepartPage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表  totest-->
    <el-table :data="depts" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="deptCode" label="部门编号" width="120" sortable></el-table-column>
      <el-table-column prop="deptName" label="部门名称" width="180" sortable></el-table-column>
      <el-table-column prop="deptEmail" label="部门邮箱" min-width="120" sortable></el-table-column>
      <el-table-column prop="deptStatus" label="部门状态" width="100" :formatter="formatStatus" sortable></el-table-column>
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
        <el-form-item label="部门编号：" prop="deptCode">
          <el-input v-model="editForm.deptCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="deptName">
          <el-input v-model="editForm.deptName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门邮箱：" prop="deptEmail">
          <el-input v-model="editForm.deptEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱密码：" prop="deptPassword">
          <el-input v-model="editForm.deptPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="deptStatus">
          <el-radio-group v-model="editForm.deptStatus">
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
        <el-form-item label="部门编号：" prop="deptCode">
          <el-input v-model="addForm.deptCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="deptName">
          <el-input v-model="addForm.deptName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门邮箱：" prop="deptEmail">
          <el-input v-model="addForm.deptEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱密码：" prop="deptPassword">
          <el-input v-model="addForm.deptPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="deptStatus">
          <el-radio-group v-model="addForm.deptStatus">
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
  import {getDepartPage, getDepartUser, saveDepartUser, updateDepartUser, deleteDepartUser} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        depts: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          deptCode: [
            {required: true, message: '请输入部门编号', trigger: 'blur'}
          ],
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ],
          deptEmail: [
            {required: true, message: '请输入部门邮箱', trigger: 'blur'}
          ],
          deptPassword: [
            {required: true, message: '请输入邮箱密码', trigger: 'blur'}
          ]

        },
        //编辑界面数据
        editForm: {
          deptId: 0,
          deptName: '',
          deptEmail: '',
          deptPassword: '',
          deptStatus: -1
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          deptCode: [
            {required: true, message: '请输入部门编号', trigger: 'blur'}
          ],
          deptName: [
            {required: true, message: '请输入部门名称', trigger: 'blur'}
          ],
          deptEmail: [
            {required: true, message: '请输入部门邮箱', trigger: 'blur'}
          ],
          deptPassword: [
            {required: true, message: '请输入邮箱密码', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {
          deptCode: '',
          deptName: '',
          deptEmail: '',
          deptPassword: '',
          deptStatus: -1
        }

      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.deptStatus === 0 ? '启用' : row.deptStatus === 1 ? '停用' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getDepartPage();
      },
      //获取用户列表
      getDepartPage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getDepartPage(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            this.total = datas.total;
            this.depts = datas.list;
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
          let para = {deptId: row.deptId};
          deleteDepartUser(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getDepartPage();
            }

          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        let param = new URLSearchParams();
        param.append("deptId", row.deptId);
        //NProgress.start();
        getDepartUser(param).then((res) => {
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
          deptCode: '',
          deptName: '',
          deptEmail: '',
          deptPassword: '',
          deptStatus: 0
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
              updateDepartUser(para).then((res) => {
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
                  this.getDepartPage();
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
              saveDepartUser(param).then((res) => {
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
                  this.getDepartPage();
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
        let ids = this.sels.map(item => item.deptId).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {deptId: ids};
          deleteDepartUser(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getDepartPage();
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getDepartPage();
    }
  }

</script>

<style scoped>

</style>
