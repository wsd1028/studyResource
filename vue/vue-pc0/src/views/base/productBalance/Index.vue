<template>
  <div class="productBalance">
    <div class="searchDiv">
      <el-button @click="getList(1)" type="primary">搜索</el-button>
      <el-input @keyup.native.enter="getList(1)" placeholder="请输入企业名称" style="width:200px;margin:0 20px" v-model="searchData.projectName"></el-input>
      <el-select @change="getList(1)" placeholder="请选择" style="width: 150px" v-model="searchData.areaCode">
        <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in areaList"></el-option>
      </el-select>
    </div>
    <div class="chartDiv">
      <div class="chartTitle">
        <p>需求物</p>
        <p>产出物</p>
      </div>
      <div class="charts">
        <div class="chart" id="needChart"></div>
        <div class="chart" id="outputChart"></div>
      </div>
    </div>
    <div class="myTable">
      <el-table :data="tableData" border style="width: 100%;height:100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="固定源名称" prop="name"></el-table-column>
        <el-table-column label="行政区域" prop="administrativeAreaName"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      :current-page="searchData.page"
      :page-size="searchData.limit"
      :page-sizes="[5, 10, 20, 50]"
      :total="total"
      @current-change="changePage"
      @size-change="changeSize"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin:20px 0;text-align:center"
    ></el-pagination>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'productBalance',
  data() {
    return {
      tableData: [],
      total: 0,
      searchData: {
        areaCode: '',
        dictId: '',
        limit: 5,
        page: 1,
        projectName: '',
        type: 0
      },
      areaList: [],
      needChart: null,
      outputChart: null
    }
  },
  async mounted() {
    this.searchData.areaCode = this.$store.state.user.userInfo.accountTypeDto.code
    this.getArea()
    this.getNeed()
    this.getOutput()
    window.addEventListener('resize', this.toResize)
  },
  methods: {
    toResize() {
      if (this.needChart) this.needChart.resize()
      if (this.outputChart) this.outputChart.resize()
    },
    changePage(val) {
      this.searchData.page = val
      this.getList()
    },
    changeSize(val) {
      this.searchData.limit = val
      this.getList(1)
    },
    async getList(page) {
      if (page) this.searchData.page = page
      let resp = await this.$http.get('/carp/business/a/q/product/balance/page', {
        params: this.searchData
      })
      if (resp.code == 0) {
        this.tableData = resp.data.records
        this.total = parseInt(resp.data.total)
      } else {
        this.$message.error('获取固定源失败' + resp.message)
      }
    },
    //得到需求物
    async getNeed() {
      let data = []
      let resp = await this.$http.get('/carp/business/a/q/product/balance/demand')
      if (resp.code == 0) {
        if (!this.searchData.dictId) {
          this.searchData.dictId = resp.data[0].dictId
          this.searchData.type = 2900
          this.getList()
        }
        for (let i = 0; i < resp.data.length; i++) {
          data.push({
            name: resp.data[i].name,
            value: resp.data[i].percent * 100,
            dictId: resp.data[i].dictId,
            type: 2900
          })
        }
      } else {
        this.$message.error('获取需求物失败' + resp.message)
      }
      this.drawPie('needChart', data)
    },
    //得到产出物
    async getOutput() {
      let data = []
      let resp = await this.$http.get('/carp/business/a/q/product/balance/produce')
      if (resp.code == 0) {
        if (!this.searchData.dictId) {
          this.searchData.dictId = resp.data[0].dictId
          this.searchData.type = 2900
          this.getList()
        }
        for (let i = 0; i < resp.data.length; i++) {
          data.push({
            name: resp.data[i].name,
            value: resp.data[i].percent * 100,
            dictId: resp.data[i].dictId,
            type: 2901
          })
        }
      } else {
        this.$message.error('获取需求物失败' + resp.message)
      }
      this.drawPie('outputChart', data)
    },
    drawPie(id, data) {
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        color: ['#1FE141', '#651B00', '#752AE9', '#D4322F', '#F57D2C', '#F6B041', '#1FE141'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [30, 100],
            labelLine: {
              normal: {
                length: 0,
                length2: 40,
                lineStyle: {
                  color: '#999',
                  type: 'solid'
                }
              }
            },
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                padding: [0, -30],
                height: 30,
                color: '#999',
                formatter: '{a|{b}  {d}%}',
                rich: {}
              }
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: data
          }
        ]
      }
      this[id].setOption(option, true)
      this[id].on('click', params => {
        this.searchData.dictId = params.data.dictId
        this.getList(1)
      })
    },
    //得到地区列表
    async getArea() {
      let code = this.$store.state.user.userInfo.accountTypeDto.code
      let resp = await this.$http.get('/carp/business/a/q/area/leading/level/page/3?parentId=290871061266829312')
      if (resp.code == 0) {
        resp.data = resp.data.filter(item => {
          return item.code.includes(code)
        })
        let areaList = resp.data
        if (code == 5115) {
          areaList.unshift({
            id: this.$store.state.config.yibinAreaId,
            code: '5115',
            name: '宜宾市'
          })
        }
        for (let i = 0; i < areaList.length; i++) {
          this.areaList.push({ name: areaList[i].name, code: areaList[i].code, id: areaList[i].id })
        }
      } else {
        this.$message.error('获取地区失败' + resp.message)
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.toResize)
  }
}
</script>

<style lang="less">
.productBalance {
  margin: 10px;
  height: 100%;
  background-color: #fff;
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  p {
    padding: 0;
    margin: 0;
  }
  .searchDiv {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px;
    flex-shrink: 0;
    flex-basis: 0;
  }
  .chartDiv {
    flex-shrink: 0;
    flex-basis: 0;
    .chartTitle {
      display: flex;
      color: #666;
      border-top: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      padding: 10px 20px;
      p {
        font-size: 20px;
        flex-grow: 1;
        font-weight: 800;
      }
    }
    .charts {
      width: 100%;
      display: flex;
      .chart {
        flex-basis: 0;
        flex-grow: 1;
        height: 300px;
      }
    }
  }
  .myTable {
    text-align: center;
    flex-grow: 1;
  }
}
</style>
