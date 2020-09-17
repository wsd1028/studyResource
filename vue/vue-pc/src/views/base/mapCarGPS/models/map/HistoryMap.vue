<template>
  <el-dialog :before-close="close" :title="title" :visible.sync="dialogVisible" center class="historyMap" width="50%">
    <div class="diaTop">
      <el-date-picker
        :clearable="false"
        :picker-options="pickerOptions"
        @change="changTime"
        align="right"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        type="datetimerange"
        v-model="chooseTime"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-select placeholder="请选择播放速度" style="margin-left:10px" v-model="playSpeed">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in playArr"></el-option>
      </el-select>
      <el-button :disabled="carList.length == 0" @click="playCar" style="padding:7px 10px" type="primary">
        <i class="el-icon-video-pause" style="font-size:24px" v-if="isPlay"></i>
        <i class="el-icon-video-play" style="font-size:24px" v-else></i>
      </el-button>
    </div>

    <baidu-map :center="mapConfig.center" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="ready" class="baidu-map" style="height:600px">
      <bm-boundary :fillOpacity="0.08" :strokeWeight="2" fillColor="#F56C6C" name="宜宾市" strokeColor="#F56C6C"></bm-boundary>
      <bm-polyline :editing="false" :path="carList" :stroke-weight="5" :strokeOpacity="1" stroke-color="#4285F4"></bm-polyline>
      <div v-if="startCarData.longitudeBD09">
        <!--车辆起始点-->
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/start.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: startCarData.longitudeBD09, lat: startCarData.latitudeBD09 }"
          :zIndex="100"
        ></bm-marker>
      </div>
      <div v-if="endCarData.longitudeBD09">
        <!--车辆终点-->
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/end.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: endCarData.longitudeBD09, lat: endCarData.latitudeBD09 }"
          :zIndex="100"
        ></bm-marker>
      </div>
      <div v-if="nowCarData.longitudeBD09">
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/historyCar.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: nowCarData.longitudeBD09, lat: nowCarData.latitudeBD09 }"
          :zIndex="100"
        >
          <bm-info-window :closeOnClick="false" :offset="{ width: 0, height: -40 }" :show="true" title="当前位置">
            <p class="mapText">时间:{{ nowCarData.timestamp }}</p>
            <p class="mapText">速度:{{ nowCarData.speed }}km/h</p>
          </bm-info-window>
        </bm-marker>
      </div>
    </baidu-map>
  </el-dialog>
</template>

<script>
export default {
  name: 'historyMap',

  data() {
    return {
      isPlay: false,
      playSpeed: 1, //播放速度
      playCount: 0, //车辆位置下标
      playArr: [
        {
          value: 1,
          label: '1倍速'
        },
        {
          value: 2,
          label: '2倍速'
        },
        {
          value: 4,
          label: '4倍速'
        },
        {
          value: 8,
          label: '8倍速'
        },
        {
          value: 16,
          label: '16倍速'
        },
        {
          value: 32,
          label: '32倍速'
        }
      ],
      chooseTime: [
        this.$moment()
          .subtract(24, 'hours')
          .format('YYYY-MM-DD HH:mm:ss'),
        this.$moment().format('YYYY-MM-DD HH:mm:ss')
      ], //选择到时间
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate()))
          return time > nowData
        }
      },
      title: '', //标题
      carMessage: null,
      dialogVisible: false,
      mapConfig: {
        zoom: 13,
        dragging: true,
        center: {
          lat: 28.756994,
          lng: 104.641929
        } //地图中心
      },
      //当前地图对象
      map: null,
      carImg: null,
      nowCarData: {}, //当前车辆位置信息
      startCarData: {}, //车辆开始位置信息
      endCarData: {}, //车辆结束位置信息
      //车辆数据
      carList: []
    }
  },

  methods: {
    //关闭弹出框
    close(done) {
      //清空时间延时
      clearInterval(this.myTime)
      this.myTime = null
      //清空车辆信息,同时解决弹出dialog时第一次不会制图像问题
      this.nowCarData = {}
      this.startCarData = {}
      this.endCarData = {}
      done()
    },
    // 百度地图初始化完成
    ready(res) {},
    async watchHistoy(carMessage, date) {
      //设置初始时间
      if (date) {
        this.chooseTime = date
      }
      this.isPlay = false
      if (carMessage) {
        this.carMessage = carMessage
      }
      let t1 = this.$moment(this.chooseTime[0]).valueOf()
      let t2 = this.$moment(this.chooseTime[1]).valueOf()
      let hours = (t2 - t1) / 1000 / 60 / 60
      //只允许查24小时数据
      if (hours > 24) {
        this.$message.error('一次最多查看24小时的记录')
        return
      }
      this.dialogVisible = true
      this.title = this.carMessage.licensePlate
      let resp = await this.$http.get('/carp/business/a/q/hbase/util/gps/history/page', {
        params: {
          licensePlate: this.carMessage.licensePlate,
          startTime: this.chooseTime[0],
          endTime: this.chooseTime[1]
        }
      })
      if (resp.code == 0) {
        if (resp.data.length == 0) {
          let geolocation = new BMap.LocalCity()
          geolocation.get(res => {
            this.mapConfig.center = res.center
          })
        } else {
          //取车辆初始点作为地图中心
          this.mapConfig.center = {
            lng: resp.data[0].longitudeBD09,
            lat: resp.data[0].latitudeBD09
          }
        }
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].lng = resp.data[i].longitudeBD09
          resp.data[i].lat = resp.data[i].latitudeBD09
        }
        this.carList = resp.data
        this.startCarData = resp.data[0] || {}
        this.endCarData = resp.data[resp.data.length - 1] || {}
      } else {
        this.$message.error('获取车辆轨迹失败' + resp.message)
      }
    },
    //改变时间
    changTime() {
      this.watchHistoy()
    },
    //播放车辆轨迹
    playCar() {
      this.isPlay = !this.isPlay
      if (this.isPlay && !this.myTime) {
        this.myTime = setInterval(() => {
          this.nowCarData = this.carList[this.playCount]
          this.playCount += this.playSpeed
          if (this.playCount > this.carList.length - this.playSpeed) {
            if (this.playCount != this.carList.length - 1) this.nowCarData = this.carList[this.carList.length - 1]
            this.playCount = 0
            clearInterval(this.myTime)
            this.isPlay = false //车辆轨迹播放结束
            this.myTime = null
          }
        }, 1000)
      }
      if (!this.isPlay) {
        if (this.myTime) {
          clearInterval(this.myTime)
          this.myTime = null
        }
      }
    }
  },

  mounted() {}
}
</script>

<style lang="less">
.historyMap {
  .el-dialog__body {
    padding-top: 10px;
  }
  img[src="https://api.map.baidu.com/images/iw_close1d3.gif"] {
    display: none;
  }
  p {
    margin: 0;
  }
  .BMap_bubble_title {
    text-align: center;
    background-color: #4285f4;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    padding: 2px 0;
  }
  .mapText {
    font-size: 12px;
    margin-top: 6px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding-left: 6px;
  }
  .el-dialog__title {
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(66, 133, 244, 1);
  }
  .diaTop {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
