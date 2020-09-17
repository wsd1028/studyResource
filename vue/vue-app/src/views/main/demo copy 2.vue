<template>
  <div class="demo">
    <van-popup class="myDia" position="top" v-model="searchProject.dialog">
      <div class="top">
        <van-search @cancel="searchProject.dialog = false" @search="select(1)" placeholder="请输入搜索关键词" show-action v-model="searchProject.searchValue" />
      </div>
      <div class="searchList">
        <van-pull-refresh @refresh="select(1)" v-model="searchProject.refreshloading">
          <van-list :finished="searchProject.finished" @load="select" finished-text="没有更多了" v-model="searchProject.loading">
            <div>
              <div :key="index" @click="handelSearchItem(item)" class="searchItem" v-for="(item, index) in list">
                <h3 class="projectName" v-text="item.projectName"></h3>
                <p class="projectAddress">
                  地址:
                  <span v-text="item.address"></span>
                </p>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </van-popup>
    <div class="dfsb header">
      <div class="dfsb">
        <van-image :src="require('@/assets/image/项目.png')" height="20" width="20" />
        <span class="count">123</span>
      </div>
      <div>
        <van-dropdown-menu>
          <van-dropdown-item :options="areaList" @change="changeArea" v-model="searchProject.areaCode" />
        </van-dropdown-menu>
      </div>
      <div>
        <van-image :src="require('@/assets/image/搜索.png')" @click="handelSearch" height="20" width="20" />
      </div>
    </div>
    <div class="level">
      <div class="item">
        <div class="box level1"></div>
        <span class="text">严重</span>
      </div>
      <div class="item">
        <div class="box level2"></div>
        <span class="text">重度</span>
      </div>
      <div class="item">
        <div class="box level3"></div>
        <span class="text">中度</span>
      </div>
      <div class="item">
        <div class="box level4"></div>
        <span class="text">轻度</span>
      </div>
      <div class="item">
        <div class="box level5"></div>
        <span class="text">良</span>
      </div>
      <div class="item">
        <div class="box level6"></div>
        <span class="text">优</span>
      </div>
    </div>
    <baidu-map
      :center="mapConfig.center"
      :dragging="mapConfig.dragging"
      :scroll-wheel-zoom="true"
      :zoom="mapConfig.zoom"
      @dragend="ondDragend"
      @ready="onBaiduMapReady"
      @touchend="mapTouchend"
      @touchmove="mapTouchmove"
      @zoomend="onZoomend"
      class="bm-view"
    >
      <!-- 区域点 -->
      <div v-if="mapConfig.zoom < 12">
        <bm-marker
          :icon="{
            url: require('@/assets/svg/triangle.svg'),
            size: { width: 20, height: 20 }
          }"
          :key="index"
          :position="item.position"
          :zIndex="10"
          @click="handelCityIcon($event, item)"
          v-for="(item, index) in cityList"
        >
          <bm-label :content="item.name + '<br/>' + item.value" :labelStyle="cityLabel" :offset="{ width: -30, height: -32 }" :position="item.position" />
        </bm-marker>
      </div>
      <bm-marker
        :icon="{
          url: require('@/assets/svg/location.svg'),
          size: { width: 80, height: 80 }
        }"
        :position="mapConfig.position"
        :zIndex="100"
      ></bm-marker>
      <div v-if="mapConfig.zoom > 11">
        <bm-marker
          :icon="item.active ? activeIcon : normalIcon"
          :key="index"
          :position="item.position"
          @click="handelProjectIcon($event, item)"
          v-for="(item, index) in projectList"
        >
          <bm-label :content="item.name" :labelStyle="item.active ? activeLable : normalLabel" :offset="{ width: 54, height: 30 }" />
        </bm-marker>
      </div>
    </baidu-map>
    <van-action-sheet :close-on-click-overlay="projectDetail.mark" class="projectDetail" title=" " v-model="projectDetail.dialog">
      <div class="content">
        <van-image :src="require('@/assets/image/top_arrow.png')" style="margin-top:10px" width="40" />
        <div class="top">
          <div class="msgItem">
            <van-image :src="require('@/assets/image/map_icon1.png')" height="18" width="18" />
            <span class="text" style="fontWeight:800;color:#333;font-size:18px">项目</span>
          </div>
          <div class="msgItem dfsb">
            <van-icon class="myIcon" color="#6c6c6c" name="location" size="18" />
            <p class="textFlowP">
              <span class="text textFlow">地址</span>
            </p>
          </div>
        </div>
        <div class="bottom dfsb">
          <span>房建工程</span>
          <span class="btn">详细</span>
        </div>
      </div>
    </van-action-sheet>
    <aside>
      <div style="margin-top:20px">
        <van-image :src="require('@/assets/image/扬尘.png')" height="40" width="40" />
      </div>
      <div style="margin-top:20px">
        <van-image :src="require('@/assets/image/实名制.png')" height="40" width="40" />
      </div>
      <div @click="handelBack" style="margin-top:20px">
        <van-image :src="require('@/assets/image/返回.png')" height="40" width="40" />
      </div>
    </aside>
  </div>
</template>

<script>
import { getArea } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      areaList: [], //区域列表
      list: ['#6b0020', '#ab0044', '#fb1e1e', '#fba01e', '#fbcf1e', '#10be76'], //项目列表
      colorList: [],
      projectDetail: {
        //当前选择项目
        mark: false,
        dialog: false,
        data: {}
      }, //选中项目
      searchProject: {
        //搜索条件
        dialog: false,
        areaCode: 5115,
        refreshloading: false,
        loading: false,
        finished: false,
        searchValue: '',
        searchId: '',
        limit: 10,
        page: 1
      },
      //地图配置
      mapConfig: {
        zoom: 10,
        dragging: true,
        center: {}, //地图中心
        position: {}, //当前定位
        showMark: false
      },
      activeIcon: {
        url: require('@/assets/svg/activeProject.svg'),
        size: { width: 80, height: 80 }
      },
      normalIcon: {
        url: require('@/assets/svg/normalProject.svg'),
        size: { width: 80, height: 80 }
      },
      normalLabel: {
        color: '#666',
        fontSize: '13px',
        fontWeight: 900,
        border: 0,
        '-webkit-text-stroke': '0.4px #fff',
        backgroundColor: 'transparent'
      },
      cityLabel: {
        color: '#fff',
        fontSize: '13px',
        border: 0,
        zIndex: 20,
        width: '80px',
        display: 'block',
        'text-align': 'center',
        backgroundColor: 'rgb(42, 130, 254)'
      },
      activeLable: {
        color: 'rgb(42, 130, 254)',
        fontSize: '13px',
        fontWeight: 900,
        border: 0,
        '-webkit-text-stroke': '0.4px #fff',
        backgroundColor: 'transparent'
      },
      //城市列表
      cityList: [],
      //项目列表
      projectList: [
        {
          position: {
            lng: 104.63351906,
            lat: 28.7706748
          },
          name: '宜宾扬尘项目',
          active: true
        },
        {
          position: {
            lng: 104.63351906,
            lat: 28.7746748
          },
          name: '宜宾扬尘项目1',
          active: false
        },
        {
          position: {
            lng: 104.63351906,
            lat: 28.7796748
          },
          name: '宜宾扬尘项目2',
          active: false
        }
      ]
    }
  },
  components: {},
  mounted() {
    this.getArea()
    this.getCity()
  },
  methods: {
    //得到城市列表
    getCity() {
      this.cityList = [
        {
          name: '翠屏区',
          value: 0.75,
          position: {
            lng: 104.62,
            lat: 28.77
          }
        },
        {
          name: '屏山县',
          value: 0.75,
          position: {
            lng: 104.33,
            lat: 28.83
          }
        },
        {
          name: '珙县',
          value: 0.75,
          position: {
            lng: 104.72,
            lat: 28.45
          }
        }
      ]
    },
    //查询项目
    async select(page) {
      if (page) {
        this.searchProject.page = page
        this.list = []
      }
      let resp = await this.$http.get(
        `/carp/business/a/q/project/area/name?areaCode=${this.searchProject.areaCode}&name=${this.searchProject.searchValue}&limit=${this.searchProject.limit}&page=${this.searchProject.page}`
      )
      if (resp.code == 0) {
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.searchProject.loading = false
        this.searchProject.refreshloading = false
        this.searchProject.page = this.searchProject.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.searchProject.finished = true
        }
      } else {
        this.$dialog.alert({
          message: '获取项目失败',
          confirmButtonColor: 'red'
        })
      }
    },
    //点击搜索项
    handelSearchItem(data) {},
    handelSearch() {
      this.searchProject.dialog = true
    },
    //点击项目图标
    handelProjectIcon(e, data) {
      this.projectDetail.dialog = true
      setTimeout(() => {
        this.projectDetail.mark = true
      }, 10)
    },
    //点击城市图标
    handelCityIcon(e, data) {},
    //拖动地图结束
    ondDragend(e) {
      let { lng, lat } = e.target.getCenter()
      this.mapConfig.center = { lng, lat }
    },
    //改变地图缩放
    onZoomend(e) {
      let { lng, lat } = e.target.getCenter()
      this.mapConfig.center = { lng, lat }
      let zoom = e.target.getZoom()
      this.mapConfig.zoom = zoom
    },
    //触摸移动时触发此事件
    mapTouchmove(e) {
      this.mapConfig.dragging = true
    },
    //触摸结束时触发此事件
    mapTouchend(e) {
      this.mapConfig.dragging = false
    },
    //关闭mark层
    infoWindowClose() {
      this.mapConfig.showMark = false
    },
    //地图初始化时,定位当前位置
    onBaiduMapReady(e) {
      const that = this
      this.BMap = e.BMap
      if (this.BMap) {
        let geolocation = new BMap.LocalCity()
        geolocation.get(res => {
          const { lng, lat } = res.center
          this.mapConfig.center = res.center
          this.mapConfig.position = res.center
        })
      }
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //点击返回
    handelBack() {
      let geolocation = new BMap.LocalCity()
      geolocation.get(res => {
        const { lng, lat } = res.center
        this.mapConfig.center = { lng, lat }
        this.mapConfig.position = { lng, lat }
      })
    },
    changeArea() {
      let areaLocation = this.$dictionaries.areaLocation
      for (let i = 0; i < areaLocation.length; i++) {
        if (areaLocation[i].areaCode == this.searchProject.areaCode) {
          this.mapConfig.center = areaLocation[i].location
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.demo {
  height: 100%;
  width: 100%;
  position: relative;
  .myDia {
    padding: 10px;
    padding-top: 20px;
    height: 80%;
    display: flex;
    flex-direction: column;
    .top {
      flex-shrink: 0;
    }
    .searchList {
      flex-grow: 1;
      overflow: auto;
      text-align: left;
      .searchItem {
        border-bottom: 1px solid #efefef;
        padding: 10px;
        .projectName {
          font-size: 16px;
          color: #313131;
        }
        .projectAddress {
          margin-top: 10px;
          color: #929292;
          font-size: 14px;
        }
      }
    }
  }
  aside {
    position: fixed;
    right: 20px;
    bottom: 60px;
  }
  .projectDetail {
    padding-bottom: 30px;
    .content {
      .top {
        text-align: left;
        padding: 10px 20px;
        .msgItem {
          .text {
            margin-left: 10px;
            color: #666;
            font-size: 16px;
          }
        }
      }
      .bottom {
        padding: 0px 20px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        .btn {
          width: 100px;
          background-color: #2a82fe;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          line-height: 30px;
          border-radius: 30px;
        }
      }
    }
  }
  .header {
    height: 40px;
    position: absolute;
    width: 100%;
    padding: 0 10px;
    .count {
      font-size: 16px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
    .van-dropdown-menu {
      height: auto;
    }
  }
  .level {
    padding: 0 10px 10px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    position: fixed;
    left: 20px;
    top: 60px;
    z-index: 2;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;
      .level1 {
        background: #6b0020;
      }
      .level2 {
        background: #ab0044;
      }
      .level3 {
        background: #fb1e1e;
      }
      .level4 {
        background: #fba01e;
      }
      .level5 {
        background: #fbcf1e;
      }
      .level6 {
        background: #10be76;
      }
      .box {
        width: 40px;
        height: 20px;
        margin-right: 10px;
      }
      .text {
        width: 35px;
        text-align: center;
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .bm-view {
    height: 100%;
    width: 100%;
    padding-top: 40px;
  }
}
</style>
