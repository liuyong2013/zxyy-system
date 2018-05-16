<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <div class="topbar-logo topbar-btn">
        <a href="/"><img src="../assets/logo.png" style="padding-left:15px;"></a>
      </div>
      <div class="topbar-logos" v-show="!collapsed">
        <a href="/"><img src="../assets/logotxt.png"></a>
      </div>
      <div class="tools">在线预约系统</div>
      <div class="userinfo" @click="logout">
        <span class="el-dropdown-link userinfo-inner"><img src="../assets/head.jpg"/> {{sysUserName}}</span>
        <!--<el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner"><img src="../assets/head.jpg"/> {{sysUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的消息</el-dropdown-item>
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
    </el-col>
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="{showSidebar:!collapsed}">
        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-icon-menufold" v-show="!collapsed"></i>
          <i class="iconfont icon-icon-menuunfold" v-show="collapsed"></i>
        </div>
        <!--展开折叠开关...-->

        <!--导航菜单-->
        <el-menu :default-active="$route.path" router :collapse="collapsed">
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu v-if="!item.leaf" :index="index+''" :key="index+''">
              <template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
              <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="!term.hidden" :class="$route.path==term.path?'is-active':''">
                <span slot="title">{{term.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" :class="$route.path==item.children[0].path?'is-active':''" :key="index+''">
              <i :class="item.iconCls"></i><span slot="title">{{item.children[0].name}}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <!--导航菜单...-->
      </aside>
      <!--左侧导航...-->
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        sysName: 'VUEADMIN',
        collapsed: false,
        sysUserName: '',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    methods: {
      //退出登录
      logout: function () {
        // let _this = this;
        this.$confirm('确认退出吗?', '提示', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
        }).then(() => {
          sessionStorage.removeItem('user');
          this.$router.push('/login');
          // setTimeout(() => {
          //   window.location.reload();
          //   _this.$router.push('/login');
          // }, 0)
        }).catch((err) => {
          console.log('logout-err', err);
        });
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      showMenu(i, status) {
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      }
    },
    mounted() {
      let user = sessionStorage.getItem('user');
      if (user) {
        user = JSON.parse(user);
        this.sysUserName = user.userLoginName || '';
        // this.sysUserAvatar = user.avatar || '';
      }
      // console.log(this.$router.options.routes)
    }
  }
</script>

<style scoped lang="scss">

  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .header {
      height: 50px;
      line-height: 50px;
      background: #000408;
      position: relative;
      .userinfo {
        text-align: right;
        position: absolute;
        right: 30px;
        top: 0;
        .userinfo-inner {
          cursor: pointer;
          color: #FF9D00;
          img {
            width: 30px;
            height: 30px;
            border-radius: 20px;
            margin: 10px 0px 10px 10px;
            float: right;
          }
        }
      }
      .topbar-btn {
        color: #fff;
      }
      .topbar-logo {
        float: left;
        width: 59px;
        line-height: 26px;
        background-color: #000408;
      }
      .topbar-logos {
        float: left;
        width: 120px;
        line-height: 26px;
        background-color: #000408;
      }
      .topbar-logo img, .topbar-logos img {
        height: 40px;
        margin-top: 5px;
        margin-left: 2px;
      }
      .topbar-title {
        float: left;
        text-align: left;
        width: 200px;
        padding-left: 10px;
        border-left: 1px solid #000;
      }
      .logo {
        //width:230px;
        height: 50px;
        font-size: 22px;
        padding-left: 20px;
        padding-right: 20px;
        border-color: rgba(238, 241, 146, 0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color: #fff;
        }
      }
      .logo-width {
        width: 120px;
      }
      .logo-collapse-width {
        width: 60px
      }
      .tools {
        padding: 0px 10px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        color: #FF9D00;
        text-align: center;
        /*border-left: 1px solid #000;*/
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
      aside {
        min-width: 50px;
        background: #111111;
        &::-webkit-scrollbar {
          display: none;
        }

        &.showSidebar {
          overflow-x: hidden;
          overflow-y: auto;
        }

        .el-menu {
          height: 100%; /*写给不支持calc()的浏览器*/
          height: -moz-calc(100% - 80px);
          height: -webkit-calc(100% - 80px);
          height: calc(100% - 80px);
          border-radius: 0px;
          background-color: #111111;
          border-right: 0px;
        }
        .el-submenu .el-menu-item {
          min-width: 60px;
        }
        .el-menu {
          width: 180px;
        }
        .el-menu--collapse {
          width: 60px;
        }

        .el-menu .el-menu-item, .el-submenu .el-submenu__title {
          height: 46px;
          line-height: 46px;
        }

        .el-menu-item:hover, .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
          background-color: #000408;
        }
      }
      .menu-collapsed {
        flex: 0 0 60px;
        width: 60px;
      }
      .menu-expanded {
        flex: 0 0 180px;
        width: 180px;
      }

      .menu-toggle {
        background: #111111;
        text-align: center;
        color: white;
        height: 26px;
        line-height: 30px;
      }

      .content-container {
        background: #fff;
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        padding-bottom: 1px;

        .content-wrapper {
          background-color: #fff;
          box-sizing: border-box;
        }
      }

    }
  }
</style>
