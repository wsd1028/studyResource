<template>
  <div class="MyMap">
    <van-field center clearable label="地址" label-width="40" left-icon="search" placeholder="请输入搜索地址" v-model="mapConfig.keyword"></van-field>
    <van-field
      center
      class
      disabled
      label="选中地址"
      label-width="70"
      left-icon="location"
      placeholder="当前选中地址"
      style
      v-if="onlyReady"
      v-model="mapConfig.chooseAddress"
    >
      <template #button>
        <van-button @click="handelAddressYes" size="small" type="primary">确认</van-button>
      </template>
    </van-field>
    <baidu-map
      :center="mapConfig.center"
      :dragging="mapConfig.dragging"
      :scroll-wheel-zoom="true"
      :style="{ height: !onlyReady ? '300px' : '' }"
      :zoom="mapConfig.zoom"
      @click="getPoint"
      @ready="onBaiduMapReady"
      @touchend="mapTouchend"
      @touchmove="mapTouchmove"
      class="bm-view"
    >
      <bm-view class="map" v-if="onlyReady"></bm-view>
      <bm-view class="map" v-else></bm-view>
      <bm-marker :dragging="false" :position="mapConfig.position" @click="handelMask">
        <bm-info-window :show="mapConfig.showMark" style="font-size: 14px" v-on:close="infoWindowClose">
          <p>地址：{{ mapConfig.markAddress }}</p>
        </bm-info-window>
      </bm-marker>
      <bm-local-search :auto-viewport="true" :keyword="mapConfig.keyword" @infohtmlset="handelSearch" class="searchMap" v-if="onlyReady"></bm-local-search>
    </baidu-map>
  </div>
</template>
<script>
export default {
  name: 'myMap',
  data() {
    return {
      addressData: {}, //选中地图信息
      //地图弹框
      mapDia: false,
      searchValue: '',
      onlyReady: true,
      //地图配置
      mapConfig: {
        zoom: 18,
        dragging: true,
        center: {}, //地图中心
        position: {}, //定位
        showMark: false,
        markAddress: '', //点击地图获得的地址
        loaction: '', //搜索的城市
        keyword: '', //详细地址
        chooseAddress: '' //详细地址
      }
    }
  },
  props: {
    position: {
      type: Object,
      default: function() {
        return {}
      }
    },
    needCode: {
      type: Boolean,
      default: false
    },
    address: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    window.setLocation = this.setLocation2
  },
  methods: {
    //点击标注
    handelMask(e) {
      this.mapConfig.dragging = false
      let geocoder = new BMap.Geocoder() //创建地址解析器的实例
      geocoder.getLocation(e.target.point, rs => {
        //地址描述
        this.mapConfig.position = e.target.point
        this.mapConfig.chooseAddress = rs.address
        this.mapConfig.markAddress = rs.address
        rs.chooseAddress = rs.address
        this.addressData = rs
      })
      this.mapConfig.showMark = true
      return false
    },
    //安卓回传经纬度
    async setLocation2(data) {
      if (data) {
        let androidLocatoin = data
        let addressRes = await this.getAddress(androidLocatoin)
        if (addressRes) {
          addressRes.center = addressRes.location
          addressRes.point = addressRes.location
          addressRes.name = addressRes.formatted_address
          this.mapConfig.center = addressRes.center
          this.mapConfig.position = addressRes.center
          this.mapConfig.showMark = true
          this.mapConfig.markAddress = addressRes.name
          this.mapConfig.chooseAddress = addressRes.name
          //this.handelAddressYes('e', true)
        }
      }
    },
    //调用安卓接口获取经纬度
    getLocation() {
      if (window.jsCall) window.jsCall.getLocation()
    },
    //通过经纬度查询地址
    getAddress(location) {
      return this.$addJsonP('http://api.map.baidu.com/reverse_geocoding/v3/', {
        params: {
          ak: this.$dictionaries.ak,
          output: 'json',
          location: `${location.lat},${location.lng}`
        }
      })
    },
    //打开地图弹窗
    showMap() {
      this.mapDia = !this.mapDia
    },
    //触摸移动时触发此事件
    mapTouchmove(e) {
      this.mapConfig.dragging = true
    },
    //触摸结束时触发此事件
    mapTouchend(e) {
      this.mapConfig.dragging = false
    },
    //得到区域code
    async getAreaCode(lat, lng) {
      let resp = await this.$addJsonP('http://api.map.baidu.com/reverse_geocoding/v3/', {
        params: {
          ak: this.$dictionaries.ak,
          output: 'json',
          location: `${lat},${lng}`
        }
      })
      if (resp.code == 0) {
        this.addressData.areaCodeMsg = resp
      } else {
        this.$dialog.alert({
          message: '获取区域代码失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //点击地图
    async getPoint(e) {
      this.mapConfig.dragging = false
      let geocoder = new BMap.Geocoder() //创建地址解析器的实例
      geocoder.getLocation(e.point, rs => {
        //地址描述
        this.mapConfig.position = e.point
        this.mapConfig.chooseAddress = rs.address
        this.mapConfig.markAddress = rs.address
        rs.chooseAddress = rs.address
        this.addressData = rs
      })
      this.mapConfig.showMark = true
    },
    //关闭mark层
    infoWindowClose() {
      this.mapConfig.showMark = false
    },
    //点击搜索的地区
    handelSearch(e) {
      this.mapConfig.chooseAddress = e.address
      e.chooseAddress = e.address
      this.addressData = e
      this.mapConfig.zoom = 18
    },
    //地图初始化时,定位当前位置
    onBaiduMapReady(e) {
      const that = this
      this.BMap = e.BMap
      if (this.BMap) {
        var myCity = new BMap.LocalCity()
        myCity.get(async res => {
          if (JSON.stringify(this.position) != '{}') {
            res.center = this.position
          }
          res.point = res.center
          if (JSON.stringify(this.position) == '{}') this.getLocation()
          let addressRes = await this.getAddress(res.center)
          if (addressRes) {
            addressRes.center = addressRes.location
            addressRes.point = addressRes.location
            addressRes.name = addressRes.formatted_address
            res = addressRes
          }
          this.addressData = res
          if (JSON.stringify(this.position) == '{}') {
            this.mapConfig.center = res.center
            this.mapConfig.position = res.center
            this.mapConfig.showMark = true
            this.mapConfig.markAddress = res.name
            this.mapConfig.chooseAddress = res.name
          } else {
            this.onlyReady = false
            this.mapConfig.center = this.position
            this.mapConfig.position = this.position
            this.mapConfig.showMark = true
            this.mapConfig.markAddress = this.addressData.name
          }
          if (this.address) {
            this.mapConfig.keyword = this.address
            this.searchValue = this.address
          }
          this.handelAddressYes('e', true)
        })
      }
    },
    //确认地址
    async handelAddressYes(e, type = false) {
      this.addressData.bool = type
      if (this.needCode && this.addressData.point) {
        await this.getAreaCode(this.addressData.point.lat, this.addressData.point.lng)
      }
      this.$emit('chooseAddress', this.mapConfig.chooseAddress, type, this.addressData)
    }
  },
  beforeDestroy() {
    window.setLocation = null
  }
}
</script>

<style lang="less">
.MyMap {
  .map {
    height: 300px;
  }
  .searchMap {
    max-height: 200px;
    overflow: auto;
  }
  .bm-view {
    width: 100%;
    .searchMap {
      margin-top: 4px;
      .van-cell {
        padding: 2px 0;
      }
    }
  }
}
</style>
