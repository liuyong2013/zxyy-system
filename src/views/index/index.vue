<template lang="html">
  <section>
    <section class="cal_head">
      <div class="cal_sel">
        <!--<span>周</span>-->
        <el-select v-model="courseId" placeholder="请选择课程" @change="getCourseTable">
          <el-option v-for="item in options" :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
        </el-select>
      </div>
      <div class="time_sel">
        <i class="el-icon-arrow-left" @click="indexToFront"></i><span>{{this.timeYear}}年{{this.timeMonth}}月</span><i class="el-icon-arrow-right" @click="indexToNext"></i>
      </div>
      <div class="cre_meeting">
        <span>新建会议</span>
      </div>
    </section>

    <section class="cal_body">
      <div class="cal_time">
        <el-row>
          <el-col :span="3"><span>&nbsp;</span></el-col>
          <el-col :span="3" v-for="(item,index) in this.dateList"><span>{{item.value}}&nbsp;{{item.week}}</span></el-col>
        </el-row>
      </div>

      <div class="cal_lists">
        <el-row v-for="(item,index) in this.courseList">
          <el-col :span="3">
            <div><img :src="item.tea_picture" alt="teacher">
              <p>{{item.tea_name}}</p></div>
          </el-col>
          <el-col :span="3" v-for="(itemChild,indexChild) in item.sevenList">
            <ul>
              <li v-for="(itemGrandson,indexGrandson) in itemChild.courseList">{{itemGrandson.tea_ch_time}}:00&nbsp;&nbsp;{{itemGrandson.stu_name}}</li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </section>
  </section>
</template>

<script>
  import {} from '../../api/api';

  export default {
    data() {
      return {
        //课程信息
        courseId: '',
        courseList: [],
        options: [],
        // initVal: '',
        //课程信息...
        //日历头部信息
        isToBackDate: {
          timeBaseDay: '',
          flag: '0',
          timeZone: ''
        },
        dateList: [],
        storeTimeBaseDay: '',
        weeks: [{
          value: '星期日',
        }, {
          value: '星期一',
        }, {
          value: '星期二',
        }, {
          value: '星期三',
        }, {
          value: '星期四',
        }, {
          value: '星期五',
        }, {
          value: '星期六',
        }],
        timeYear: '',
        timeMonth: '',
        timeDay: '',
        //日历头部信息...
      }
    },
    methods: {
      getCourseInfo() {
        indexGetCourseInfo().then((res) => {
          this.options = res.datas;
          // this.initVal = res.datas[0].courseName;
          this.courseId = res.datas[0].courseId;
        })
      },
      getCourseTable(value) {
        // let courseName = {};
        // courseName = this.options.find((item) => {
        //   return item.courseName === value;
        // });
        // this.getCourseInfo(value)
        this.courseId = value;
        var toBackCouseInfo = {};
        toBackCouseInfo.timeBaseDay = this.storeTimeBaseDay;
        toBackCouseInfo.courId = this.courseId;
        let courseInfo = Object.assign({}, toBackCouseInfo);
        console.log(courseInfo)
        indexGetCourseTable(courseInfo).then((res) => {
          this.courseList = res.datas;
        })
      },
      getNowDate() {
        let nowDate = Object.assign({}, this.isToBackDate);
        indexGetNowDate(nowDate).then((res) => {
          // let {message, status, datas} = res;
          this.dateList = res.datas.list
          this.storeTimeBaseDay = res.datas.timeBaseDay
          this.timeYear = res.datas.timeYear
          this.timeMonth = this.toDouble(res.datas.timeMonth)
          this.timeDay = res.datas.timeDay
          var _this = this;
          res.datas.list.forEach(function (val, key) {
            val.week = _this.weeks[key].value;
          });
          this.getCourseTable(this.courseId);
        })
      },
      indexToFront() {
        this.isToBackDate.timeBaseDay = this.storeTimeBaseDay
        this.isToBackDate.flag = -1;
        this.getNowDate();
      },
      indexToNext() {
        this.isToBackDate.timeBaseDay = this.storeTimeBaseDay
        this.isToBackDate.flag = 1;
        this.getNowDate();
      },
      toDouble(num) {
        return num < 10 ? '0' + num : num;
      }
    },
    mounted() {
      this.getNowDate();
      this.getCourseInfo();
      var localZone = new Date().getTimezoneOffset() / 60;
      this.isToBackDate.timeZone = localZone;
    },
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common.scss";
  @import "../../assets/styles/index.scss";
</style>
