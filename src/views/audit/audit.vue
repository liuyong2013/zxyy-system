<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/index' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>审核信息</el-breadcrumb-item>
        <el-breadcrumb-item>审核</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名字、标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getAuditPage">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="audit_type" label="审批类型" width="120" :formatter="formatType" sortable></el-table-column>
      <el-table-column prop="audit_name" label="标题" min-width="180" sortable></el-table-column>
      <el-table-column prop="stu_name" label="学生名字" min-width="100" sortable></el-table-column>
      <el-table-column prop="stu_username" label="学生用户名" width="180" sortable></el-table-column>
      <el-table-column prop="stu_phone" label="学生电话" width="120" sortable></el-table-column>
      <el-table-column prop="cour_name" label="课程名字" width="120" sortable></el-table-column>
      <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus" sortable></el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">审批通过</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--审核界面-->
    <el-dialog title="审核" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio class="radio" :label="1">同意</el-radio>
            <el-radio class="radio" :label="2">不同意</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="beizhu">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.beizhu"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {getAuditPage, getAudit, auditData} from '../../api/api';

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
          auditId: 0,
          status: '',
          beizhu: ''
        },
      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.status == 0 ? '待审批' : row.status == 1 ? '审批通过' : row.status == 2 ? '审批驳回' : '未知';
      },
      //显示审核状态
      formatType: function (row, column) {
        return row.audit_type == 0 ? '学生注册' : row.audit_type == 1 ? '学生选课' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getAuditPage();
      },
      //获取用户列表
      getAuditPage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getAuditPage(param).then((res) => {
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
      //显示编辑界面
      handleEdit: function (index, row) {
        let param = new URLSearchParams();
        param.append("auditId", row.audit_id);
        //NProgress.start();
        getAudit(param).then((res) => {
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
                  this.getAuditPage();
                }
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量审核
      batchRemove: function () {
        var ids = this.sels.map(item => item.courseId).toString();
        this.$confirm('确认批量通过选中记录吗？', '提示', {
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
              this.getAuditPage();
            }
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getAuditPage();
    }
  }

</script>

<style scoped>

</style>
