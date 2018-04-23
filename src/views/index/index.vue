<template lang="html">
  <section>
    <section class="cal_head">
      <div class="cal_sel">
        <!--<span>周</span>-->
        <el-select v-model="value" placeholder="" @change="getNowCourse">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :selected="item.selected"></el-option>
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
        <el-row>
          <el-col :span="3">
            <div><img src="../../assets/logo.png" alt="teacher">
              <p>teacher's name</p></div>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div><img src="../../assets/logo.png" alt="teacher">
              <p>teacher's name</p></div>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div><img src="../../assets/logo.png" alt="teacher">
              <p>teacher's name</p></div>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
          <el-col :span="3">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </section>
  </section>
</template>

<script>
  import {indexGetNowCourse, indexGetNowDate} from '../../api/api';

  export default {
    data() {
      return {
        options: [{
          value: '选项1',
          label: '课程1'
        }, {
          value: '选项2',
          label: '课程5'
        }, {
          value: '选项3',
          label: '课程2',
          selected: true
        }, {
          value: '选项4',
          label: '课程3'
        }, {
          value: '选项5',
          label: '课程4'
        }],
        value: '课程5',
        //日历头部信息
        isToBack: {
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
      getNowCourse(value) {
        // console.log(this);
        let obj = {};
        obj = this.options.find((item) => {
          return item.value === value;
        });
        // console.log(obj);
        indexGetNowCourse(obj).then((res) => {
          let {message, status, datas} = res;
          // console.log(datas)
        })
      },
      getNowDate() {
        let nowDate = Object.assign({}, this.isToBack);
        indexGetNowDate(nowDate).then((res) => {
          let {message, status, datas} = res;
          this.dateList = res.datas.list
          this.storeTimeBaseDay = res.datas.timeBaseDay
          this.timeYear = res.datas.timeYear
          this.timeMonth = this.toDouble(res.datas.timeMonth)
          this.timeDay = res.datas.timeDay
          var _this = this;
          res.datas.list.forEach(function (val, key) {
            val.week = _this.weeks[key].value;
          });
        })
      },
      indexToFront() {
        this.isToBack.timeBaseDay = this.storeTimeBaseDay
        this.isToBack.flag = -1;
        this.getNowDate()
      },
      indexToNext() {
        this.isToBack.timeBaseDay = this.storeTimeBaseDay
        this.isToBack.flag = 1;
        this.getNowDate()
      },
      toDouble(num) {
        return num < 10 ? '0' + num : num;
      }
    },
    mounted() {
      this.getNowDate();
      var localZone = new Date().getTimezoneOffset() / 60;
      this.isToBack.timeZone = localZone;
    },
    updated() {
    },
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common.scss";
  @import "../../assets/styles/index.scss";
</style>
