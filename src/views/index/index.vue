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
        <i class="el-icon-arrow-left"></i><span>2018年4月</span><i class="el-icon-arrow-right"></i>
      </div>
      <div class="cre_meeting">
        <span>新建会议</span>
      </div>
    </section>

    <section class="cal_body">
      <div class="cal_time">
        <el-row>
          <el-col :span="3"><span>&nbsp;</span></el-col>
          <el-col :span="3"><span>4/15&nbsp;&nbsp;星期日</span></el-col>
          <el-col :span="3"><span>4/16&nbsp;&nbsp;星期一</span></el-col>
          <el-col :span="3"><span>4/17&nbsp;&nbsp;星期二</span></el-col>
          <el-col :span="3"><span>4/18&nbsp;&nbsp;星期三</span></el-col>
          <el-col :span="3"><span>4/19&nbsp;&nbsp;星期四</span></el-col>
          <el-col :span="3"><span>4/20&nbsp;&nbsp;星期五</span></el-col>
          <el-col :span="3"><span>4/21&nbsp;&nbsp;星期六</span></el-col>
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
  import {indexGetNowCourse} from '../../api/api';

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
        value: '课程5'
      }
    },
    methods: {
      getNowCourse(value) {
        // console.log(this);
        let obj = {};
        obj = this.options.find((item) => {
          return item.value === value;
        });
        console.log(obj);
        indexGetNowCourse(obj).then((res) => {
          console.log(res)
        })
      }
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/common.scss";
  @import "../../assets/styles/index.scss";
</style>
