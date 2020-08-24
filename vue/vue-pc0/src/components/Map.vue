<template>
  <div class="container">
    <el-row class="search" :gutter="20">
      <el-col :span="6">
        <div>
          <el-input :placeholder="`请输入地区码`" v-model="keyword">
            <template slot="prepend">关键词</template>
          </el-input>
        </div>
      </el-col>
    </el-row>
    <baidu-map class="map-baidu" center="宜宾" :min-zoom="5" :zoom="zoom" :scroll-wheel-zoom="true">
      <!-- <bm-point-collection
        :points="points"
        shape="BMAP_POINT_SHAPE_CIRCLE"
        color="#4E97D9"
        size="BMAP_POINT_SIZE_NORMAL"
        @click="showInfo"
      ></bm-point-collection> -->
      <bm-label
        v-for="(item, key) in points"
        :key="key"
        :position="{ lng: item.lng, lat: item.lat }"
        :content="item.name"
        :labelStyle="{
          display: 'none',
          padding: '6px 10px',
          backgroundColor: '#222222cc',
          borderWidth: 0,
          borderRadius: '2px',
          color: 'white',
          fontSize: '16px',
          lineHeight: '16px',
          left: '50%',
          transform: 'translate(-40%,88%)'
        }"
        @click="showInfo"
      />
      <!-- <bm-marker v-for="(item,key) in points" :key="key" :position="{ lng: item.lng, lat: item.lat }" animation="BMAP_ANIMATION_BOUNCE">
        <bm-label :content="item.name" :labelStyle="{ display:display,padding:'6px 10px',backgroundColor:'#222222cc',borderWidth:0,borderRadius:'2px',color: 'white', fontSize: '16px',lineHeight:'16px',left:'50%',transform:'translate(-40%,88%)' }" @click="showInfo" />
      </bm-marker> -->
      <bm-info-window :show="info.show" :position="info.position" :title="info.title">
        <p v-text="info.title"></p>
      </bm-info-window>
    </baidu-map>
  </div>
</template>
<script>
export default {
  data() {
    return {
      location: '宜宾市',
      keyword: 5115,
      points: [{}],
      zoom: 8,
      display: 'none',
      info: {
        show: false,
        position: { lng: 0, lat: 0 },
        title: ''
      }
    }
  },
  props: {
    // 名称
    name: {
      type: String,
      default: ''
    },
    // 搜索接口地址
    searchUrl: String
  },
  watch: {
    keyword() {
      this.getPoints()
    }
  },
  created() {
    this.getPoints()
  },
  methods: {
    /**
     * 显示详情
     **/
    showInfo(e) {
      console.log(e)
    },

    /**
     * gps查询
     **/
    getPoints() {
      this.$debounce(() => {
        this.$http
          .get(this.searchUrl, {
            params: {
              code: this.keyword
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.points = data.map(item => ({
                lng: item.longitude,
                lat: item.latitude,
                address: item.address,
                name: item.name,
                id: item.id,
                showInfo: false
              }))
            }
          })
      }, 1000)()
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  height: 100%;

  .search {
    position: relative;
    z-index: 2;
  }

  .map-baidu {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

    .hide {
      display: none;
    }
  }
}
</style>
