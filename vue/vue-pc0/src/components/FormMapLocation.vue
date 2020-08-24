<template>
  <div class="map">
    <el-form-item label="经度" :required="false" style="width:auto;margin-bottom:0;max-width:120px">
      <el-input
        :inline="true"
        v-model="form.data[item.target.lng]"
        style="width:auto;margin-right:10px"
        :disabled="item.disabled"
        @input="
          form.data[item.target.lng] = $event.replace(/[^0-9\.]/g, '')
          form.data[key] = $event.length && form.data[item.target.lat].length ? 1 : ''
        "
      />
    </el-form-item>
    <el-form-item label="纬度" :required="false" style="width:auto;margin-bottom:0;max-width:120px"
      ><el-input
        v-model="form.data[item.target.lat]"
        style="width:auto;margin-right:10px"
        :disabled="item.disabled"
        @input="
          form.data[item.target.lat] = $event.replace(/[^0-9\.]/g, '')
          form.data[key] = $event.length && form.data[item.target.lng].length ? 1 : ''
        "
      />
    </el-form-item>
    <el-button type="primary" @click="!item.disabled ? $set(item, 'mapShow', true) : () => {}">
      <i class="el-icon-location"></i>
      <span>定位</span>
    </el-button>
    <!-- 给地图加点击事件getLocation，点击地图获取位置相关的信息，经纬度啥的 -->
    <!-- scroll-wheel-zoom：是否可以用鼠标滚轮控制地图缩放，zoom是视图比例 -->
    <div
      class="map-container"
      style="position:fixed;z-index:2;overflow:hidden;display:flex;flex-flow:column nowrap;width:92%;height:92%;top:4%;left:4%;background-color:#fff;border:#eee solid 1px;border-radius:4px"
      v-show="item.mapShow"
      v-if="!item.disabled"
    >
      <div class="title" style="padding:4px 20px;background-color:#eee;flex:none">
        <span>请选择地址</span>
      </div>
      <div style="display:flex;flex-flow:column nowrap;flex:auto">
        <baidu-map
          v-if="item.mapShow"
          @click="getLocation($event, item.target)"
          @ready="bmapReady"
          :scroll-wheel-zoom="true"
          :center="form.data[item.target.lng] ? { lng: form.data[item.target.lng], lat: form.data[item.target.lat] } : '宜宾市'"
          :zoom="item.zoom ? item.zoom : 15"
          style="position:relative;flex:auto"
        >
          <bm-control :offset="{ width: '10px', height: '10px' }" style="margin:20px">
            <bm-auto-complete v-model="map.keyword" :sugStyle="{ zIndex: 99999 }">
              <el-form-item :required="false" :rules="{}" :show-message="false">
                <el-input :placeholder="item.placeholder ? item.placeholder : '搜索地区名称'" v-model="map.search" />
              </el-form-item>
            </bm-auto-complete>
          </bm-control>
          <bm-marker
            :position="{ lng: form.data[item.target.lng] || map.lng, lat: form.data[item.target.lat] || map.lat }"
            :dragging="true"
            animation="BMAP_ANIMATION_BOUNCE"
            v-show="map.markerShow"
            @dragend="getLocation($event, item.target)"
          >
            <bm-label :content="map.address" :offset="{ width: -35, height: 30 }" style="border-width:0" />
          </bm-marker>
          <bm-local-search
            :keyword="map.keyword"
            :auto-viewport="true"
            @infohtmlset="getLocation($event, item.target)"
            style="position:absolute;right:0px;bottom:0px;overflow:auto;max-height:100%;width:20%;z-index:1;"
          ></bm-local-search>
        </baidu-map>
        <div style="display:flex;flex:none;justify-content:center;margin:10px">
          <el-button
            @click="
              map.lat = form.data[item.target.lat] = originLat
              map.lng = form.data[item.target.lng] = originLng
              $set(form.label[key], 'mapShow', false)
              $set(form.data, key, 1)
            "
          >
            <span>取消</span>
          </el-button>
          <el-button
            type="primary"
            @click="
              locationComplete(item.target)
              $set(form.label[key], 'mapShow', false)
              $set(form.data, key, 1)
            "
          >
            <span>确定</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let BMap = null
export default {
  name: 'FormMapLocation',
  data() {
    return {
      form: this.formConfig,
      map: {
        lng: 104.650553,
        lat: 28.761047,
        address: '宜宾市',
        keyword: '',
        search: '',
        areaCode: ''
      },
      key: this.field,

      // 源数据
      originLat: 28.77,
      originLng: 104.62,
      originAddress: '宜宾市'
    }
  },
  model: {
    prop: 'bind',
    event: 'bind'
  },
  props: {
    // 是否填写有效值,表单验证用
    bind: {
      type: (() => String | Number)()
    },
    // 当前操作对象的字段名
    field: String,
    // 当前地图操作对象
    item: Object,
    // 表单操作对象
    formConfig: Object,
    // 清除表单验证方法
    clearValidate: Function
  },
  watch: {
    bind(val) {
      val += ''
      if (val && val.length) {
        this.clearValidate()
      }
    }
  },
  methods: {
    /**
     * 百度地图回调方法
     **/
    // 初始化完成
    bmapReady(res) {
      // 存储源数据
      this.originLng = this.form.data[this.item.target.lng]
      this.originLat = this.form.data[this.item.target.lat]
      this.originAddress = this.form.data[this.item.target.address]

      BMap = res.BMap
      if (this.item.getCurrentPosition) {
        this.item.mapShow = false
        this.getCurrentPosition(this.item.getCurrentPosition)
      }
    },
    // 获取地址详细信息
    getLocation(e) {
      this.map.lat = this.form.data[this.item.target.lat] = e.point.lat
      this.map.lng = this.form.data[this.item.target.lng] = e.point.lng

      /* 创建地址解析器的实例 */
      let geoCoder = new BMap.Geocoder()
      if (e.address) {
        this.map.address = e.address
      } else {
        /* 利用坐标获取地址的详细信息 */
        geoCoder.getLocation(e.point, res => {
          this.map.address = res.address
        })
      }

      /* 利用坐标获取地址的地区码 */
      this.getDetails({ lat: e.point.lat, lng: e.point.lng }).then(res => {
        this.map.areaCode = res.addressComponent.adcode
      })
    },
    // 完成定位
    locationComplete(target) {
      Object.keys(target).forEach(key => {
        this.$set(this.form.data, target[key], this.map[key])
      })
    },
    // 获取当前定位
    getCurrentPosition(callback) {
      let myCity = new BMap.LocalCity()
      myCity.get(res => {
        this.map.lat = res.center.lat
        this.map.lng = res.center.lng
        this.getDetails(res.center).then(res => {
          this.map.address = res.formatted_address
          this.map.areaCode = res.addressComponent.adcode
          this.locationComplete(this.item.target)
          callback(res)
        })
      })
    },
    // 根据经纬度获取地址详细信息
    getDetails({ lat, lng }) {
      return this.$jsonp('http://api.map.baidu.com/geocoder/v2/', {
        params: {
          ak: 'Ya2nSaqjT3vNrIgba1v4nfWzSxGdtgZD',
          location: `${lat},${lng}`,
          output: 'json'
        }
      })
    }
  },
  updated() {
    if (this.form.data[this.item.target.lat] && this.form.data[this.item.target.lng]) {
      this.$emit('bind', 1)
    } else {
      this.$emit('bind', '')
    }
  }
}
</script>

<style></style>
