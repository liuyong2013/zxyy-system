<template>
  <div class="login_box" style="background-image: url(./static/pc_bg.jpg)">
    <img src="../assets/long_logo.png" alt="logo" class="long_logo">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {requestUser, requestToken} from '../api/api';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            //{ validator: validaePass }
          ],
          checkPass: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            let params = new URLSearchParams();
            params.append("username", "system@|" + this.ruleForm2.account);
            params.append("password", this.ruleForm2.checkPass);
            params.append("grant_type", "password");
            params.append("scope", "read");
            params.append("client_id", "rajithapp");
            params.append("client_secret", "secret");
            requestToken(params).then(data => {
              var token = data.value;
              this.logining = false;
              if (token) {
                sessionStorage.setItem('token', token);
                let params = new URLSearchParams();
                requestUser(params).then(data => {
                  this.logining = false;

                  //NProgress.done();
                  let {message, status, datas} = data;
                  if (status !== 0) {
                    this.$message({
                      message: message,
                      type: 'error'
                    });
                  } else {
                    sessionStorage.setItem('user', JSON.stringify(datas));
                    this.$router.push({path: '/system/dept'});
                  }
                });
              } else {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                this.$message({
                  message: "用户名密码错误",
                  type: 'error'
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
      var that = this;
      $(document).keydown(function (ev) {
        if (ev.keyCode == '13' || ev.keyCode == 'enter') {
          that.handleSubmit2()
        }
      })
    },
  }
</script>

<style lang="scss" scoped>
  .login_box {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    border-top: 1px solid transparent;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    position: relative;
    .long_logo {
      width: 210px;
      height: 34px;
      position: absolute;
      top: 80px;
      left: 50%;
      margin-left: -105px;
    }
    .login-container {
      -webkit-border-radius: 5px;
      border-radius: 5px;
      -moz-border-radius: 5px;
      background-clip: padding-box;
      margin: 180px auto;
      width: 350px;
      padding: 35px 35px 15px 35px;
      background: #fff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 40px 6px #cac6c6;
      .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
      }
      .remember {
        margin: 0px 0px 35px 0px;
      }
    }
  }
</style>
