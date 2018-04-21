<template>
  <section>
    <!--显示菜单路径-->
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/admin/index' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>教师信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="教师名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getMasterPage">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="teas" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="teaName" label="姓名" width="120" sortable></el-table-column>
      <el-table-column prop="teaSex" label="性别" width="90" :formatter="formatSex" sortable></el-table-column>
      <el-table-column prop="teaEmail" label="邮箱" width="120" sortable></el-table-column>
      <el-table-column prop="teaPhone" label="电话" width="120" sortable></el-table-column>
      <el-table-column prop="zongName" label="时区" min-width="150" sortable></el-table-column>
      <el-table-column prop="teaSchoolCh" label="学校CN" width="120" sortable></el-table-column>
      <el-table-column prop="teachoolEn" label="学校EN" width="120" sortable></el-table-column>
      <el-table-column prop="teaStatus" label="状态" width="100" :formatter="formatStatus" sortable></el-table-column>
      <el-table-column label="操作" min-width="200">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button size="small" @click="transferStu(scope.$index, scope.row)">学生</el-button>
          <el-button size="small" @click="transferStu(scope.$index, scope.row)">课表</el-button>
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
        <el-form-item label="课程项目" prop="courseIdsArray">
          <el-checkbox-group v-model="editForm.courseIdsArray">
            <el-checkbox v-for="item in courseList"
                         :key="item.courseId"
                         :label="item.courseId"
                         :value="item.courseName">{{item.courseName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="教师名字" prop="teaName">
          <el-input v-model="editForm.teaName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="teaSex">
          <el-radio-group v-model="editForm.teaSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="teaPhone">
          <el-input v-model="editForm.teaPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="teaEmail">
          <el-input v-model="editForm.teaEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时区" prop="teaTimeZone">
          <el-select v-model="editForm.teaTimeZone" placeholder="请选择时区">
            <el-option v-for="item in dictList"
                       :key="item.paramId"
                       :label="item.paramValue"
                       :value="item.paramId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校CN" prop="teaSchoolCh">
          <el-input v-model="editForm.teaSchoolCh" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校EN" prop="teachoolEn">
          <el-input v-model="editForm.teachoolEn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="teaProfiles">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editForm.teaProfiles"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="teaStatus">
          <el-radio-group v-model="editForm.teaStatus">
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
        <el-form-item label="课程项目" prop="courseIdsArray">
          <el-checkbox-group v-model="addForm.courseIdsArray">
            <el-checkbox v-for="item in courseList"
                         :key="item.courseId"
                         :label="item.courseId"
                         :value="item.courseName">{{item.courseName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="教师名字" prop="teaName">
          <el-input v-model="addForm.teaName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="teaSex">
          <el-radio-group v-model="addForm.teaSex">
            <el-radio class="radio" :label="0">男</el-radio>
            <el-radio class="radio" :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="teaPhone">
          <el-input v-model="addForm.teaPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="teaEmail">
          <el-input v-model="addForm.teaEmail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时区" prop="teaTimeZone">
          <el-select v-model="addForm.teaTimeZone" placeholder="请选择时区">
            <el-option v-for="item in dictList"
                       :key="item.paramId"
                       :label="item.paramValue"
                       :value="item.paramId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校CN" prop="teaSchoolCh">
          <el-input v-model="addForm.teaSchoolCh" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学校EN" prop="teachoolEn">
          <el-input v-model="addForm.teachoolEn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="teaProfiles">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addForm.teaProfiles"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="teaStatus">
          <el-radio-group v-model="addForm.teaStatus">
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

    <!--分配学生-->
    <el-dialog title="分配学生" :visible.sync="transFormVisible" :close-on-click-modal="false">
      <el-form :model="transForm" label-width="80px" :rules="transFormRules" ref="transForm">
        <el-form-item label="课程项目" prop="courseId">
          <el-select v-model="transForm.courseId" placeholder="请选择课程" @change="transCourseStu">
            <el-option v-for="item in courseList"
                       :key="item.courseId"
                       :label="item.courseName"
                       :value="item.courseId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配学生" prop="stuIdsArray">
          <el-transfer
            filterable
            :titles="['可选学生', '已分配学生']"
            filter-placeholder="请输入学生名字"
            v-model="transForm.stuIdsArray"
            :data="allstuList">
          </el-transfer>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click.native="transFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="transferSubmit" :loading="transferLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {
    getMasterPage, saveMaster, getMaster,
    deleteMaster, updateMaster, getCourseList, getZoneList, getCourseByTea, getAllStu, getStuByTea, relationTeaStu
  } from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        teas: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          teaName: [
            {required: true, message: '请输入教师名字', trigger: 'blur'}
          ],
          teaEmail: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'}
          ],
          // courseIdsArray:[
          // 	{ required: true, message: '请选择课程', trigger: 'blur' }
          // ],
        },
        //编辑界面数据
        editForm: {
          teaId: 0,
          courseIds: '',
          courseIdsArray: [],
          teaName: '',
          teaSex: 0,
          teaPhone: '',
          teaEmail: '',
          teaTimeZone: '',
          teaSchoolCh: '',
          teachoolEn: '',
          teaProfiles: '',
          teaStatus: 0
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          teaName: [
            {required: true, message: '请输入教师名字', trigger: 'blur'}
          ],
          teaEmail: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'}
          ],
          // teaTimeZone: [
          // 	{ required: true, message: '请选择时区', trigger: 'blur' }
          // ],
          // courseIdsArray:[
          // 	{ required: true, message: '请选择课程', trigger: 'blur' }
          // ],

        },
        //新增界面数据
        addForm: {
          courseIds: '',
          courseIdsArray: [],
          teaName: '',
          teaSex: 0,
          teaPhone: '',
          teaEmail: '',
          teaTimeZone: '',
          teaSchoolCh: '',
          teachoolEn: '',
          teaProfiles: '',
          teaStatus: 0
        },
        dictList: [],
        courseList: [],
        allstuList: [],
        //分配学生
        transFormVisible: false,
        stus: [], //分配学生数据源
        transForm: {
          teaId: '',
          stuIds: '',
          stuIdsArray: [],
          courseId: ''
        },
        transFormRules: {
          // courseId: [
          // 	{ required: true, message: '请选择课程项目', trigger: 'blur' }
          // ]
        },
        transferLoading: false
      }
    },
    methods: {
      //状态显示转换
      formatStatus: function (row, column) {
        return row.teaStatus == 0 ? '启用' : row.teaStatus == 1 ? '停用' : '未知';
      },
      formatSex: function (row, column) {
        return row.teaSex == 0 ? '男' : row.teaSex == 1 ? '女' : '未知';
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getMasterPage();
      },
      //获取用户列表
      getMasterPage() {
        let param = new URLSearchParams();
        param.append("str", this.filters.name);
        param.append("pageNo", this.page);
        param.append("pageSize", 20);
        this.listLoading = true;
        //NProgress.start();
        getMasterPage(param).then((res) => {
          let {message, status, datas} = res;
          if (status !== 0) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            this.total = datas.total;
            this.teas = datas.list;
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
          let para = {teaId: row.teaId};
          deleteMaster(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getMasterPage();
            }

          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {

        let param = new URLSearchParams();
        param.append("teaId", row.teaId);
        getCourseList(param).then((res) => {
          this.courseList = res.datas;
        });
        getZoneList(param).then((res) => {
          this.dictList = res.datas;
        });
        //NProgress.start();
        getMaster(param).then((res) => {
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
        let param = new URLSearchParams();
        getCourseList(param).then((res) => {
          this.courseList = res.datas;
        });
        getZoneList(param).then((res) => {
          this.dictList = res.datas;
        });
        this.addFormVisible = true;
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              this.editForm.courseIds = this.editForm.courseIdsArray.toString();
              let para = Object.assign({}, this.editForm);
              updateMaster(para).then((res) => {
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
                  this.getMasterPage();
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
              this.addForm.courseIds = this.addForm.courseIdsArray.toString();
              let param = Object.assign({}, this.addForm);
              saveMaster(param).then((res) => {
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
                  this.getMasterPage();
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
        var ids = this.sels.map(item => item.teaId).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {teaId: ids};
          deleteMaster(para).then((res) => {
            this.listLoading = false;
            let {message, status, datas} = res;
            if (status !== 0) {
              this.$message({
                message: message,
                type: 'error'
              });
            } else {
              this.getMasterPage();
            }
          });
        }).catch(() => {

        });
      },
      //显示分配学生
      transferStu: function (index, row) {
        this.transForm.teaId = row.teaId;
        let param = new URLSearchParams();
        param.append("teaId", row.teaId);
        getCourseByTea(param).then((res) => {
          this.courseList = res.datas;
          this.transForm.courseId = res.datas[0].courseId;
        });
        this.transFormVisible = true;
      },
      //分配学生页面选择课程时触发切换方法
      transCourseStu: function () {
        let param = new URLSearchParams();
        param.append("teaId", this.transForm.teaId);
        param.append("courseId", this.transForm.courseId);
        //查所有可选学生
        getAllStu(param).then((res) => {
          var _this = this;
          this.allstuList = [];
          this.transForm.stuIdsArray = [];
          res.datas.forEach(function (stu) {
            _this.allstuList.push({
              key: stu.stuId,
              label: stu.stuName
            });
          });
        });
        //根据老师和课程查关联学生
        getStuByTea(param).then((res) => {
          this.transForm.stuIdsArray = res.datas;
        });
        this.transFormVisible = true;
      },
      //提交分配学生
      transferSubmit: function () {
        this.$refs.transForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              //NProgress.start();
              this.transForm.stuIds = this.transForm.stuIdsArray.toString();
              let param = Object.assign({}, this.transForm);
              relationTeaStu(param).then((res) => {
                this.addLoading = false;
                let {message, status, datas} = res;
                if (status !== 0) {
                  this.$message({
                    message: message,
                    type: 'error'
                  });
                } else {
                  // this.$refs['transForm'].resetFields();
                  this.transFormVisible = false;
                  this.getMasterPage();
                }
              });
            });
          }
        });
      }
    },
    mounted() {
      this.getMasterPage();
    }
  }

</script>

<style scoped>

</style>
