<template>
  <div :class="['car-search-list-container', active ? 'left' : 'right']">
    <el-input @keyup.enter.native="myPageData(1)" class="input-with-select" placeholder="搜索运渣车" size="small" v-model="searchData.keyword">
      <el-select @change="myPageData(1, 'cahngeType')" placeholder="请选择" slot="prepend" style="width:80px" v-model="searchData.type">
        <el-option label="所有" value></el-option>
        <el-option label="关注" value="true"></el-option>
      </el-select>
      <el-button @click="myPageData(1)" icon="el-icon-search" slot="append"></el-button>
    </el-input>
    <div class="list-wrap">
      <el-scrollbar class="custom-scrollbar">
        <el-table :data="carList" border size="small" style="width: 100%">
          <el-table-column align="center" label="车牌号" prop="licensePlate" width="100"></el-table-column>
          <el-table-column align="center" label="修改时间" prop="syncDate" width="100"></el-table-column>
          <el-table-column align="center" label="显示车辆" width="90">
            <template slot-scope="scope">
              <el-switch
                @change="showCar($event, scope.$index, scope.row)"
                active-color="#13ce66"
                inactive-color="#999"
                v-model="scope.row.showCar"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="关注" width="60">
            <template slot-scope="scope">
              <i :style="{ color: scope.row.checked ? '#409eff' : '', fontSize: '26px' }" class="el-icon-star-on"></i>
            </template>
          </el-table-column>
          <el-table-column align="center" label="轨迹">
            <template slot-scope="scope">
              <el-button @click="handelTrajectory(scope.$index, scope.row)" size="mini" type="primary">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div @click="active = !active" class="Icon">
        <i class="el-icon-d-arrow-left" style="color:#fff;font-size:22px" v-if="active"></i>
        <i class="el-icon-d-arrow-right" style="color:#fff;font-size:22px" v-else></i>
      </div>
    </div>
    <el-pagination
      :current-page.sync="searchPage"
      :page-size="20"
      :total="total"
      @current-change="myPageData"
      layout="total,prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'carSearchList',
  data() {
    return {
      active: true,
      searchData: {
        keyword: '',
        type: ''
      },
      collectData: [], //关注车辆
      carList: [], //显示在列表上的一页
      carListAll: [], //所有车辆
      showCarList: [], //展示在地图上的车辆列表
      total: 0,
      searchPage: 1
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    //得到收藏
    async getCollect() {
      let resp = await this.$http.get('/carp/business/a/q/car/user/page', {
        params: {
          limit: 99999,
          page: 1,
          userId: this.$store.state.user.userInfo.id
        }
      })
      if (resp.code == 0) {
        this.collectData = resp.data.records
      } else {
        this.$message.error('获取收藏车辆失败: ' + resp.message)
      }
    },
    //搜索
    myPageData(page, type) {
      if (page) this.searchPage = page
      if (type == 'cahngeType') {
        this.searchData.keyword = ''
      }
      function getPageData(rule) {
        let data = rule.data //总数据
        let pageData = [] //分页返回数据
        let pageIndex = rule.pageIndex - 1
        let pageSize = rule.pageSize
        let count = 0
        for (let i = 0; i < data.length; i++) {
          if (data[i + pageIndex * pageSize]) {
            pageData.push(data[i + pageIndex * pageSize])
            count++
          } else {
            break
          }
          if (count > pageSize - 1) {
            break
          }
        }
        return pageData
      }
      function mySearch(mainData, searchRules) {
        let tableData = []
        for (let key in searchRules) {
          if (searchRules[key] == null) {
            searchRules[key] = ''
          }
          if (searchRules[key] == '') {
            tableData = mainData
            continue
          }
          tableData = []
          for (let i = 0; i < mainData.length; i++) {
            if (mainData[i][key].indexOf(searchRules[key]) != -1) {
              tableData.push(mainData[i])
            }
          }
          mainData = tableData
        }
        return tableData
      }
      let searchArr = mySearch(this.carListAll, { licensePlate: this.searchData.keyword, checked: this.searchData.type })
      this.total = searchArr.length
      this.carList = getPageData({
        data: searchArr,
        pageIndex: this.searchPage,
        pageSize: 20
      })
      if (type == 'cahngeType') {
        this.showCarList = searchArr
        this.sendMessage()
      }
    },
    //查询车辆
    async search() {
      let resp = await this.$http.get('/carp/business/a/q/car/gps/plate/page', {
        params: {
          page: this.searchPage,
          limit: 99999,
          licensePlate: ''
        }
      })
      if (resp.code === 0) {
        await this.getCollect()
        for (let i = 0; i < resp.data.records.length; i++) {
          resp.data.records[i].checked = ''
          resp.data.records[i].collectionId = ''
          for (let j = 0; j < this.collectData.length; j++) {
            if (resp.data.records[i].licensePlate == this.collectData[j].plateLicense) {
              resp.data.records[i].checked = 'true'
              resp.data.records[i].collectionId = this.collectData[j].id
            }
          }
        }
        for (let i = 0; i < resp.data.records.length; i++) {
          resp.data.records[i].showCar = true
          resp.data.records[i].syncDate = this.$moment(resp.data.records[i].syncDate).format('YYYY-MM')
        }
        this.showCarList = JSON.parse(JSON.stringify(resp.data.records))
        this.carListAll = resp.data.records
        this.myPageData()
        this.sendMessage()
      } else {
        this.$message.error('获取内容失败: ' + resp.message)
      }
    },
    //查看车辆轨迹
    handelTrajectory(index, item) {
      this.$emit('watchHistoy', item)
    },
    //地图显示车辆
    showCar(status, index, item) {
      let bool = true
      if (status) {
        this.showCarList.push(item)
      } else {
        let info = 0
        for (let i = 0; i < this.showCarList.length; i++) {
          if (item.phone == this.showCarList[i].phone) {
            info = i
          }
        }
        this.showCarList.splice(info, 1)
      }
      if (bool) this.sendMessage()
    },
    sendMessage() {
      this.$emit('setCenter', this.showCarList)
    }
  },
  destroyed() {}
}
</script>

<style lang="less" scoped>
@import '~@/views/base/map/style/color.less';
@import '~@/views/base/map/style/size.less';
.car-search-list-container {
  position: absolute;
  padding: 0.1rem;
  top: 50%;
  left: 0;
  width: 460px;
  box-sizing: border-box;
  background-color: @white;
  box-shadow: @black-opcity 0 0 0.04rem;
  border-radius: 0 @radius-size @radius-size 0;
  transform: translate(0, -50%);
  transition: all 0.5s;
}
.left {
  left: 0;
}
.right {
  left: -460px;
}
.list-wrap {
  height: 60vh;
  margin-top: 10px;
  position: relative;
}
.Icon {
  position: absolute;
  cursor: pointer;
  width: 20px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  top: 0;
  bottom: 0;
  margin: auto;
  right: -32px;
  overflow: hidden;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #66b1ff;
}
</style>
