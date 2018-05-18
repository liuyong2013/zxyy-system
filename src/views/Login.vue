<template>
  <div class="login_box" style="background-image: url(./static/pc_bg.jpg)">
    <img src="../assets/long_logo.png" alt="logo" class="long_logo">
    <el-form :model="loginInfo" :rules="rules2" ref="loginInfo" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="loginInfo.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginInfo.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item class="verify" prop="iptVerifyCode">
        <el-input type="text" name="iptVerifyCode" v-model="loginInfo.iptVerifyCode" ref="iptVerifyCode" auto-complete="off" placeholder="验证码"></el-input>
        <span class="verify_code" ref="verifyCode" @click="createCode">{{verifyCode}}</span>
      </el-form-item>
      <el-checkbox v-model="isRememberPsw" class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {requestUser, requestToken, loginVerify} from '../api/api';

  let code;
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        verifyCode: '',
        rejectSubmit: false,
        logining: false,
        loginInfo: {
          account: '',
          password: '',
          iptVerifyCode: '',
        },
        rules2: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          iptVerifyCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
          ]
        },
        isRememberPsw: localStorage.getItem('isRememberPsw') === 'true' ? true : false
      };
    },
    methods: {
      handleReset2() {
        this.$refs.loginInfo.resetFields();
      },
      handleSubmit2(ev) {
        let _this = this;
        this.$refs.loginInfo.validate((valid) => {
          if (valid) {
            if (this.rejectSubmit === true) return false;
            //_this.$router.replace('/table');
            this.logining = true;
            let params = new URLSearchParams();
            params.append("username", "system@|" + this.loginInfo.account + ';' + this.loginInfo.iptVerifyCode.toLowerCase() + ';' + sessionStorage.getItem('catoken'));
            params.append("password", this.loginInfo.password);
            params.append("grant_type", "password");
            params.append("scope", "read");
            params.append("client_id", "rajithapp");
            params.append("client_secret", "secret");
            requestToken(params).then(data => {
              let token = data.value;
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
                  message: "输入信息错误！",
                  type: 'error'
                });
              }
              this.createCode()
            });
            this.rememberPsw();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //是否记住密码？？
      rememberPsw() {
        localStorage.setItem('isRememberPsw', this.isRememberPsw);
        if (this.isRememberPsw === true) {
          localStorage.setItem('loginInfo', JSON.stringify(this.loginInfo))
        } else {
          let loginInfo = {
            account: '',
            password: ''
          };
          localStorage.setItem('loginInfo', JSON.stringify(loginInfo))
        }
      },
      // 图片验证码
      createCode() {
        loginVerify().then(res => {
          let {message, status, datas} = res;
          if (status === 0) {
            let {captcha, catoken} = datas;
            this.verifyCode = captcha;
            sessionStorage.setItem('catoken', catoken);
          } else {
            this.$message({
              type: 'error',
              message: message,
            })
          }
        });
      }
    },
    mounted() {
      if (localStorage.getItem('loginInfo')) {
        let loginInfo = localStorage.getItem('loginInfo');
        let loginJSON = JSON.parse(loginInfo);
        // let {account, password} = loginJSON;
        this.$set(this.loginInfo, 'account', loginJSON.account);
        this.$set(this.loginInfo, 'password', loginJSON.password);
      }
      this.createCode();
      window.addEventListener('keydown', (e) => {
        if (e.keyCode === 13 || e.keyCode === 'enter') {
          this.handleSubmit2()
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
    overflow: hidden;
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
        margin: 0 auto 40px auto;
        text-align: center;
        color: #505458;
      }
      .remember {
        margin: 0 0 35px 0;
      }
      .verify {
        line-height: 1;
        user-select: none;
        -ms-user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        .el-input {
          width: 50%;
          user-select: auto;
          -ms-user-select: auto;
          -moz-user-select: auto;
          -webkit-user-select: auto;
        }
        .verify_code {
          width: 28%;
          margin-left: 20%;
          height: 30px;
          line-height: 30px;
          display: inline-block;
          background: rgba(43, 43, 43, .6) url("../assets/verify.jpg") no-repeat;
          border: 1px solid #333333;
          vertical-align: middle;
          color: #333333;
          font-size: 18px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
  }
</style>
