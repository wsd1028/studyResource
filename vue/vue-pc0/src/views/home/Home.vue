<template>
  <div class="manage">
    <el-scrollbar class="custom-scrollbar">
      <el-row class="home" :gutter="20" style="margin:0">
        <el-col :span="8">
          <el-card shadow="hover" style="overflow:visible">
            <div class="user">
              <img ref="avatar" :src="avatar" @error="avatar = require('@/assets/images/user.png')" />
              <div class="userinfo">
                <p class="name" v-text="user.accountBaseDto.name"></p>
                <p class="access" v-cloak>
                  {{
                    {
                      '0': '系统管理员',
                      '10': '公司内部',
                      '20': '安装运维',
                      '30': '项目人员',
                      '40': '银行',
                      '50': '主管部门',
                      '60': '消纳站',
                      '70': '运输公司'
                    }[user.accountTypeDto.type]
                  }}
                </p>
              </div>
            </div>
            <div class="login-info">
              <p>
                上次登录时间：
                <span>2019-10-20</span>
              </p>
              <p>
                上次登录地点：
                <span>宜宾</span>
              </p>
            </div>
          </el-card>
          <el-card shadow="hover" style="height:522px;margin-top:20px;overflow:visible">
            <el-table :data="tableData">
              <el-table-column show-overflow-tooltip v-for="(val, key) in tableLabel" :key="key" :prop="key" :label="val"></el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="16">
          <div class="num">
            <el-card
              shadow="hover"
              v-for="item in countData"
              :key="item.name"
              :body-style="{ display: 'flex', alignItems: 'stretch', padding: 0 }"
              style="overflow:visible"
            >
              <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
              <div class="detail">
                <p class="num">{{ item.value }}</p>
                <p class="txt">{{ item.name }}</p>
              </div>
            </el-card>
          </div>
          <el-card shadow="hover" style="overflow:visible">
            <echart style="height: 280px" :chartData="echartData.order"></echart>
          </el-card>
          <div class="graph">
            <el-card shadow="hover" style="overflow:visible">
              <echart :chartData="echartData.user" style="height: 260px"></echart>
            </el-card>
            <el-card shadow="hover" style="overflow:visible">
              <echart :chartData="echartData.video" style="height: 260px" :isAxisChart="false"></echart>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import Echart from '../../components/EChart'
import { mapState } from 'vuex'
export default {
  components: {
    Echart
  },
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  },
  data() {
    return {
      avatar: this.$store.state.config.convertImgUrl(this.$store.state.user.userInfo.accountBaseDto.photo) || require('@/assets/images/user.png'),
      countData: [
        {
          name: '今日排放',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '本月排放',
          value: 210,
          icon: 'star-on',
          color: '#ffb980'
        },
        {
          name: '总排放',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef'
        },
        {
          name: '今日违规',
          value: 1234,
          icon: 'success',
          color: '#2ec7c9'
        },
        {
          name: '本月违规',
          value: 210,
          icon: 'star-on',
          color: '#ffb980'
        },
        {
          name: '总违规',
          value: 1234,
          icon: 's-goods',
          color: '#5ab1ef'
        }
      ],
      tableData: [],
      tableLabel: {
        name: '建渣类型',
        todayBuy: '今日排放',
        monthBuy: '本月排放',
        totalBuy: '总排放'
      },
      echartData: {
        order: {
          xData: [],
          series: []
        },
        user: {
          xData: [],
          series: []
        },
        video: {
          series: []
        }
      }
    }
  },
  methods: {
    getTableData() {
      this.$http.get('/home/getData').then(res => {
        this.tableData = res.data.tableData
        // 订单折线图
        const order = res.data.orderData
        this.echartData.order.xData = order.date
        // 第一步取出series中的name部分——键名
        let keyArray = Object.keys(order.data[0])
        // 第二步，循环添加数据
        keyArray.forEach(key => {
          this.echartData.order.series.push({
            name: key,
            data: order.data.map(item => item[key]),
            type: 'line'
          })
        })
        // 用户柱状图
        this.echartData.user.xData = res.data.userData.map(item => item.date)
        this.echartData.user.series.push({
          name: '违规排放',
          data: res.data.userData.map(item => item.new),
          type: 'bar'
        })
        this.echartData.user.series.push({
          name: '正常排放',
          data: res.data.userData.map(item => item.active),
          type: 'bar',
          barGap: 0
        })
        // 视频饼图
        this.echartData.video.series.push({
          data: res.data.videoData,
          type: 'pie'
        })
      })
    }
  },
  created() {
    this.getTableData()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/home';
@import '~@/assets/less/common';
</style>
