<template>
  <div class="wrap">
    <div class="carImportant">
      <el-dialog :visible.sync="gpsCar.dialog" title="添加关注车辆" width="1200px">
        <div class="myDia">
          <div class="top item">
            <el-button
              :disabled="allChoose.length == 0"
              @click="handelAddAll"
              class="item"
              size="small"
              style="margin-right:20px;width:100px;padding-left: 15px"
              type="primary"
            >
              <!--eslint-->
              全部关注
            </el-button>
            <el-input
              @keyup.enter.native="getGpsCar(1)"
              class="input-with-select"
              placeholder="请输入车牌号"
              size="small"
              style="width:300px"
              v-model="gpsCar.licensePlate"
            >
              <el-button @click="getGpsCar(1)" icon="el-icon-search" slot="append"></el-button>
            </el-input>
          </div>
          <div class="myTable">
            <el-table
              :data="gpsCar.list"
              :header-cell-style="{ backgroundColor: '#f9f9f9' }"
              @selection-change="handleSelectionChange"
              border
              element-loading-spinner="el-icon-loading"
              element-loading-text="加载中"
              height="100%"
              ref="gpsTable"
              row-key="id"
              size="mini"
              style="width: 100%"
            >
              <el-table-column :reserve-selection="true" :selectable="checkboxSelect" align="center" size="mini" type="selection" width="55"></el-table-column>
              <el-table-column align="center" label="车牌号" prop="licensePlate"></el-table-column>
              <el-table-column align="center" label="运输公司" prop="companyName"></el-table-column>
              <el-table-column align="center" label="有效期" prop="effectiveDate"></el-table-column>
              <el-table-column align="center" label="车辆型号" prop="vehicleModel"></el-table-column>
              <el-table-column align="center" label="方量" prop="quantity"></el-table-column>
              <el-table-column align="center" label="车主" prop="ownerName"></el-table-column>
              <el-table-column align="center" label="车主电话" prop="ownerPhone"></el-table-column>
              <el-table-column align="center" label="车辆类型" prop="vehicleType"></el-table-column>
              <el-table-column align="center" label="收藏">
                <template slot-scope="scope">
                  <el-switch :width="50" @change="changeCollect($event, scope.row)" v-model="scope.row.checked"></el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            :current-page="gpsCar.page"
            :page-size="gpsCar.limit"
            :page-sizes="[10, 20, 30, 40]"
            :total="gpsCar.total"
            @current-change="getGpsCar"
            @size-change="changeGpsSize"
            class="item"
            layout="total, sizes, prev, pager, next, jumper"
            style="text-align:center;padding:10px 0"
          ></el-pagination>
        </div>
      </el-dialog>
      <el-button @click="handelAddDia" class="item" size="small" style="margin:0 20px 20px;width:100px;" type="primary">添加关注</el-button>
      <div class="myTable">
        <el-table :data="collectData" :header-cell-style="{ backgroundColor: '#f9f9f9' }" border height="100%" size="mini" style="width: 100%;">
          <el-table-column align="center" label="车牌号" prop="plateLicense" style="color: #409EFF"></el-table-column>
          <el-table-column align="center" label="运输公司" prop="companyName"></el-table-column>
          <el-table-column align="center" label="有效期" prop="effectiveDate"></el-table-column>
          <el-table-column align="center" label="车辆型号" prop="vehicleModel"></el-table-column>
          <el-table-column align="center" label="方量" prop="quantity"></el-table-column>
          <el-table-column align="center" label="车主" prop="ownerName"></el-table-column>
          <el-table-column align="center" label="车主电话" prop="ownerPhone"></el-table-column>
          <el-table-column align="center" label="车辆类型" prop="vehicleType"></el-table-column>
          <el-table-column align="center" label="收藏">
            <template size="mini" slot-scope="scope">
              <el-button @click="deleteCollect(scope.row)" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        :current-page="searcCollect.page"
        :page-size="searcCollect.limit"
        :page-sizes="[10, 20, 30, 40]"
        :total="collectTotal"
        @current-change="getCollect"
        @size-change="changeCollectSize"
        class="item"
        layout="total, sizes, prev, pager, next, jumper"
        style="text-align:center;padding:10px 0"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'carImportant',
  data() {
    return {
      collectData: [], //收藏的数据
      allChoose: [], //批量关注数组
      searcCollect: {
        page: 1,
        limit: 10
      },
      gpsCar: {
        //cps车辆对象
        dialog: false,
        list: [],
        total: 0,
        page: 1,
        limit: 10,
        licensePlate: ''
      },
      collectTotal: 0 //收藏总数
    }
  },
  mounted() {
    this.getCollect()
  },
  methods: {
    //是否禁用选择框
    checkboxSelect(row) {
      return !row.checked
    },
    //添加所有选中
    async handelAddAll() {
      let userId = this.$store.state.user.userInfo.id
      let arr = []
      for (let i = 0; i < this.allChoose.length; i++) {
        arr.push({
          plateLicense: this.allChoose[i].licensePlate,
          userId
        })
      }
      let resp = await this.$http.post('/carp/business/a/q/car/user/insert', arr)
      if (resp.code == 0) {
        this.$message.success('收藏成功')
        this.allChoose = []
        this.$refs.gpsTable.clearSelection()
      } else {
        this.$message.error('收藏失败: ' + resp.message)
      }

      this.getGpsCar()
      this.getCollect()
    },
    handelAddDia() {
      this.gpsCar.dialog = true
      this.getGpsCar()
    },
    //删除关注
    async deleteCollect(item) {
      let resp = await this.$http.delete('/carp/business/a/q/car/user/remove', {
        params: {
          id: item.id,
          deletePerson: this.$store.state.user.userInfo.id
        }
      })
      if (resp.code == 0) {
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败: ' + resp.message)
      }
      this.getCollect()
    },
    //改变多选状态
    handleSelectionChange(val) {
      this.allChoose = val
    },
    //改变gps车辆分页大小
    changeGpsSize(val) {
      this.gpsCar.limit = val
      this.getGpsCar(1)
    },
    //改变分页大小
    changeCollectSize(val) {
      this.searcCollect.limit = val
      this.getCollect(1)
    },
    //改变关注状态
    async changeCollect(val, item) {
      let resp = {}
      if (val) {
        resp = await this.$http.post('/carp/business/a/q/car/user/insert', [
          {
            plateLicense: item.licensePlate,
            userId: this.$store.state.user.userInfo.id
          }
        ])
      } else {
        resp = await this.$http.delete('/carp/business/a/q/car/user/remove', {
          params: {
            id: item.collectionId,
            deletePerson: this.$store.state.user.userInfo.id
          }
        })
      }
      if (resp.code == 0) {
        this.$message.success('操作成功')
      } else {
        this.$message.error('操作失败: ' + resp.message)
      }
      this.getGpsCar()
      this.getCollect()
    },
    //得到关注数据
    async getCollect() {
      let resp = await this.$http.get('/carp/business/a/q/car/user/page', {
        params: {
          limit: this.searcCollect.limit,
          page: this.searcCollect.page,
          userId: this.$store.state.user.userInfo.id
        }
      })
      if (resp.code == 0) {
        this.collectData = resp.data.records
        this.collectTotal = parseInt(resp.data.total)
      } else {
        this.$message.error('获取收藏车辆失败: ' + resp.message)
      }
    },
    //得到GPS车辆数据
    async getGpsCar(page) {
      if (page) this.gpsCar.page = page
      let resp = await this.$http.get('/carp/business/a/q/car/gps/plate/page', {
        params: {
          licensePlate: this.gpsCar.licensePlate,
          page: this.gpsCar.page,
          limit: this.gpsCar.limit
        }
      })
      if (resp.code == 0) {
        await this.getCollect()
        for (let i = 0; i < resp.data.records.length; i++) {
          for (let j = 0; j < this.collectData.length; j++) {
            if (resp.data.records[i].licensePlate == this.collectData[j].plateLicense) {
              resp.data.records[i].checked = true
              resp.data.records[i].collectionId = this.collectData[j].id
            }
          }
        }
        this.gpsCar.list = resp.data.records
        this.gpsCar.total = parseInt(resp.data.total)
      } else {
        this.$message.error('获取车辆失败: ' + resp.message)
      }
    }
  }
}
</script>

<style lang="less">
.wrap {
  padding: 10px;
}

.carImportant {
  box-sizing: border-box;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  background-color: #fff;
  .el-dialog__body {
    padding: 20px;
  }
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-dialog__title {
    font-weight: bold;
  }
  .el-table--scrollable-y {
    .el-table__body-wrapper::-webkit-scrollbar {
      width: 9px;
      height: 9px;
    }
    .gutter {
      width: 10px !important;
    }
  }
  .myDia {
    display: flex;
    flex-direction: column;
    height: 600px;
  }
  .item {
    flex-shrink: 0;
  }
  .myTable {
    flex-grow: 1;
  }
  .top,
  header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
