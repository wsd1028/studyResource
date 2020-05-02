<template>
  <div
    class="cabinerPort"
    v-loading="mainLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
  >
    <el-dialog :visible.sync="showChooseVisible" width="700px" center @close="updateShowYes">
      <h1 class="myTitle">已选择</h1>
      <el-table
        :data="allChoose"
        class="marginTop myTable"
        height="500px"
        highlight-current-row
        @current-change="handleCustChange"
        border
        style="width: 98%;margin:auto"
      >
        <el-table-column prop="portName" label="端口名称" align="center"></el-table-column>
        <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="portSpeed" label="带宽(MB)" width="100" align="center"></el-table-column>
        <el-table-column prop="portDescr" label="端口描述" align="center"></el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, allChoose)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="custDialogVisible" width="730px" center class="rentPort">
      <h1 class="myTitle">租用ip</h1>
      <div style="alignItems:center;display:flex;margin:20px;justifyContent: center;">
        <span style="width:70px;display:block">客户名称：</span>
        <el-input
          v-model="searchValueCustname"
          placeholder="请输入客户名称"
          size="small"
          style="width:200px;marginRight:15px"
        ></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getCusts(1)">查找</el-button>
      </div>

      <el-table
        ref="singleTable"
        :data="custTableData"
        class="marginTop myTable"
        v-loading="custLoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        height="530px"
        highlight-current-row
        @current-change="handleCustChange"
        border
        style="width: 98%;margin:auto"
      >
        <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="clientManager" label="客户经理" align="center"></el-table-column>
      </el-table>
      <div>
        <el-pagination
          @size-change="handleCustSizeChange"
          @current-change="handleCustPagechange"
          :current-page.sync="custPageIndex"
          :page-sizes="[10,15,20,25]"
          :page-size="pagesize"
          align="right"
          style="marginTop:10px"
          layout="total,sizes, prev, pager, next,jumper"
          :total="custDataCount"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer" style="marginTop:0">
        <el-button @click="custDialogNo">取 消</el-button>
        <el-button type="primary" @click="custDialogYes" :disabled="isCust">确认租用</el-button>
      </span>
    </el-dialog>

    <div class="top">
      <div class="top-left">
        <div class="top-left1">
          <div class="search">
            <div class="searchRule">
              <span class="search-text" style="marginLeft:0">设备名称：</span>
              <el-input
                v-model="searchTargetName"
                placeholder="请输入设备名称"
                size="small"
                style="width:170px"
              ></el-input>
              <span class="search-text">设备ip:</span>
              <el-input
                v-model="searchTargetIP"
                placeholder="请输入设备ip"
                size="small"
                style="width:170px"
              ></el-input>
              <span class="search-text">端口名称:</span>
              <el-input
                v-model="searchPortName"
                placeholder="请输入端口名称"
                size="small"
                style="width:170px"
              ></el-input>
              <span class="search-text">端口类型：</span>
              <el-select v-model="searchState" placeholder="请选择" style="width:170px">
                <el-option label="请选择" value style="display:block"></el-option>
                <el-option
                  v-for="item in stateArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  style="display:block"
                ></el-option>
              </el-select>
            </div>
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch(1)">查找</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="PageData"
      class="marginTop"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      border
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
      <el-table-column prop="portName" label="端口名称" align="center"></el-table-column>
      <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="targetName" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="targetIP" label="设备IP" align="center" width="180"></el-table-column>
      <el-table-column prop="targetType" label="设备类型" align="center" width="150"></el-table-column>
      <el-table-column prop="portSpeed" label="带宽(MB)" width="100" align="center"></el-table-column>
      <el-table-column prop="portDescr" label="端口描述" align="center"></el-table-column>
      <el-table-column prop="portUse" label="状态" width="100" align="center"></el-table-column>
    </el-table>
    <div class="table-footer">
      <div>
        <el-button type="primary" icon="el-icon-success" @click="handleRentIP">租用端口</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="retreatPort">退租</el-button>
        <el-button type="success" icon="el-icon-view" @click="showChoose">已选择</el-button>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleSearch"
        :current-page.sync="pageIndex"
        :page-sizes="[10,100,300,500]"
        :page-size="pagesize"
        align="right"
        layout="total,sizes,prev,pager,next,jumper"
        :total="dataCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { async } from "q";
import { IP } from "../core/IP";
import { constants } from "crypto";
import { Loading } from "element-ui";
import { TargetPort } from "../core/TargetPort";

Vue.use(ElementUI);

@Component
export default class CabinetPort extends Vue {
  private mainLoading: boolean = false;
  //显示已选择
  private updateShowYes() {
    this.showChooseVisible = false;
    let allChoose = this.allChoose;
    this.toggleSelection();
    this.toggleSelection(allChoose);
    this.allChoose = allChoose;
  }
  private toggleSelection(rows) {
    if (rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    } else {
      this.$refs.multipleTable.clearSelection();
    }
  }
  private showChooseVisible: boolean = false;
  private showChoose() {
    this.showChooseVisible = true;
  }
  private deleteRow(index, rows) {
    rows.splice(index, 1);
  }
  //退租
  private async retreatPort() {
    if (this.allChoose.length > 0) {
      let portIds = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        portIds.push(this.allChoose[i].id);
      }
      this.portIds = portIds.join(",");
      this.mainLoading = true;
      let randomNum = Math.round(Math.random() * 10000);
      let url = `api/Resource/CancelRentPortBat?portIds=${this.portIds}&randomNum=${randomNum}`;
      let res = await Axios.get(url);
      this.mainLoading = false;
      if (res.data.code == 1) {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "success",
          message: "退租端口成功"
        });
        this.$refs.multipleTable.clearSelection();
        this.handleSearch();
      } else {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "warning",
          message: res.data.descr
        });
      }
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择退租的端口",
        type: "warning"
      });
    }
  }
  //客户租用
  private custPageIndex: number = 1;
  private custPagesize: number = 10;
  private custDataCount: number = 0;
  private custLoading: boolean = false;
  private isCust: boolean = true;
  private custDialogVisible: boolean = false;
  private custTableData: object[] = [];
  private searchValueCustname: string = "";
  private portIds: string = "";
  private custId: string = "";
  private handleCustSizeChange(val: string) {
    this.custPagesize = parseInt(val);
    this.getCusts();
  }
  private handleCustPagechange(val: string) {
    this.custPageIndex = parseInt(val);
    this.getCusts();
  }
  private handleCustChange(row) {
    if (row) {
      this.custId = row.id;
      this.isCust = false;
    } else {
      this.custId = "";
      this.isCust = true;
    }
  }
  private custDialogNo(row) {
    this.$refs.singleTable.setCurrentRow(row);
    this.custDialogVisible = false;
    this.custPageIndex = 1;
    this.custPagesize = 10;
  }
  private async custDialogYes() {
    this.custDialogVisible = false;
    this.custPageIndex = 1;
    this.custPagesize = 10;
    this.mainLoading = true;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/AddCustRentPortBat?custId=${this.custId}&portIds=${this.portIds}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    this.mainLoading = false;
    if (res.data.code == 1) {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "success",
        message: "租用端口成功"
      });
      this.$refs.multipleTable.clearSelection();
      this.handleSearch();
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }
  private async getCusts(pageIndex) {
    let custname = this.searchValueCustname;
    if (pageIndex) {
      this.custPageIndex = pageIndex;
    } else {
      pageIndex = this.custPageIndex;
    }
    let PageSize = this.custPagesize;
    this.mainLoading = true;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCust?custname=${custname}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    this.mainLoading = false;
    this.custLoading = false;
    if (res.data.code == 1) {
      this.custTableData = res.data.data.list;
      this.custDataCount = res.data.data.count;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }
  private handleRentIP() {
    if (this.allChoose.length > 0) {
      let portIds = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        portIds.push(this.allChoose[i].id);
      }
      this.portIds = portIds.join(",");
      this.getCusts();
      this.custDialogVisible = true;
      this.custLoading = true;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择租用的端口",
        type: "warning"
      });
    }
  }
  //批量操作
  private chooseCabinets: any[] = [];
  private allChoose: any[] = [];
  private delId = [];
  private handleSelectionChange(value) {
    this.allChoose = value;
  }

  private PageData: Array<TargetPort> = [];
  private tableData: object[] = [];
  private loading: boolean = true;

  //查询
  private stateArr = [
    { id: "0", name: "空闲" },
    { id: "1", name: "客户占用" },
    { id: "2", name: "客户预占" },
    { id: "4", name: "锁定" },
    { id: "10", name: "局方使用(互连)" },
    { id: "11", name: "局方使用(出口)" },
    { id: "21", name: "局方使用" },
    { id: "22", name: "客户预留" }
  ];
  private searchTargetId: string = "";
  private searchTargetName: string = "";
  private searchState: string = "";
  private searchTargetIP: string = "";
  private searchPortName: string = "";
  private async handleSearch(pageIndex: number) {
    this.loading = true;
    if (pageIndex) {
      this.pageIndex = pageIndex;
    } else {
      pageIndex = this.pageIndex;
      if (pageIndex - 1 == this.dataCount / this.pagesize) {
        pageIndex--;
      }
    }
    let targetId = this.searchTargetId;
    let targeName = this.searchTargetName;
    let state = this.searchState;
    let targetIP = this.searchTargetIP;
    let portName = this.searchPortName;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetTargetPorts?TargetId=${targetId}&TargetName=${targeName}&PortUseState=${state}&TargetIP=${targetIP}&PortName=${portName}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
    url = encodeURI(url);
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      let pageData = res.data.data.list;
      this.PageData = pageData;
      this.dataCount = res.data.data.count;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
    this.loading = false;
  }
  //分页
  private pageIndex: number = 1;
  private pagesize: number = 10;
  private dataCount: number = 0;
  private handleSizeChange(val: string) {
    this.pagesize = parseInt(val);
    this.handleSearch(1);
  }
  async mounted() {
    if (this.$route.query.TargetId) {
      this.searchTargetId = this.$route.query.TargetId + "";
    }
    this.handleSearch(1);
  }
}
</script>

<style lang="scss">
.cabinerPort {
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .rentPort {
    .el-table__body tr.current-row > td {
      background: #78c3f5 !important;
    }
  }
  .myTitle {
    color: #606266;
    text-align: center;
  }
  .myForm {
    padding: 25px 25px 30px;
    padding-top: 0px;
  }
  .myTable {
    margin: 20px;
  }

  .top-left {
    display: flex;
    height: 50px;
    align-items: flex-end;
    justify-content: space-between;
  }
  .top-link {
    display: flex;
    align-items: flex-end;
    width: 450px;
  }
  .link {
    color: #409eff;
    display: block;
  }
  .link:hover {
    color: red;
  }
  .top-left1 {
    display: flex;
    align-items: center;
  }
  .top-right {
    display: flex;
    margin-left: 10px;
    align-items: flex-end;
  }
  .upload-demo {
    display: flex;
  }
  .search {
    display: flex;
  }
  .searchRule {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    align-items: center;
    margin-right: 10px;
  }
  .search-text {
    width: 80px;
    display: block;
    flex-shrink: 0;
    margin-left: 10px;
  }
  .marginTop {
    margin-top: 22px;
  }

  .el-upload-list {
    display: flex;
  }
  li {
    display: inline-block;
  }

  .el-table th.gutter {
    display: table-cell !important;
  }

  .el-table colgroup.gutter {
    display: table-cell !important;
  }
}
</style>