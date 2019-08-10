<template>
  <div
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="ipResource"
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
        <el-table-column prop="custName" label="客户" align="center"></el-table-column>
        <el-table-column prop="net" label="ip段地址" align="center"></el-table-column>
        <el-table-column prop="ipAddress" label="ip地址" align="center"></el-table-column>
        <el-table-column prop="mask" label="掩码" align="center"></el-table-column>
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

    <el-dialog :visible.sync="custDialogVisible" width="730px" center class="rentIP">
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

    <el-dialog :visible.sync="uploadDialogVisible" width="1200px" center @close="uploadDialogNo">
      <h1 class="myTitle">上传数据预览</h1>
      <el-tabs
        type="border-card"
        v-model="activeName"
        v-if="!failMess"
        @tab-click="handleTabClick"
        class="myTable"
      >
        <el-tab-pane label="ip" name="ips">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="420px"
            border
            style="width: 98%"
          >
            <el-table-column prop="ipAddress" label="ip地址" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.ipAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mask" label="掩码" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.mask}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="custName" label="客户名" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="net" label="ip段" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.net}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="insertDescr" label="返回信息" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.insertDescr">信息正确，可提交</span>
                <span v-else style="color:red">{{scope.row.insertDescr}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="客户信息" name="custs">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="420px"
            border
            style="width: 98%"
          >
            <el-table-column prop="custCode" label="客户编码" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="custName" label="客户名" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="insertDescr" label="返回信息" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.insertDescr">信息正确，可提交</span>
                <span v-else style="color:red">{{scope.row.insertDescr}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="IP段" name="ipnets">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="420px"
            border
            style="width: 98%"
          >
            <el-table-column prop="net" label="ip段" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.net}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="beginIp" label="开始ip" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.beginIp}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="endIp" label="结束ip" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.endIp}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ipCount" label="ip数" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.ipCount}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="mask" label="掩码" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.mask}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="insertDescr" label="返回信息" align="center">
              <template slot-scope="scope">
                <span v-if="!scope.row.insertDescr">信息正确，可提交</span>
                <span v-else style="color:red">{{scope.row.insertDescr}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <p
        v-else
        style="color:red;textAlign:center;margin:20px 0;height:200px;lineHeight:200px"
      >{{failMess}}</p>
      <div>
        <el-pagination
          @size-change="uploadHandleSizeChange"
          @current-change="uploadHandleCurrentChange"
          :current-page.sync="uploadCurrentPage"
          :page-sizes="[10,15,20,25]"
          :page-size="uploadPagesize"
          align="right"
          style="marginTop:20px"
          layout="total,sizes, prev, pager, next,jumper"
          :total="uploadDataCount"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogNo">取 消</el-button>
        <el-button type="primary" @click="uploadDialogYes" :disabled="isUploadSuccess">提交</el-button>
      </span>
    </el-dialog>

    <div class="top">
      <div class="top-left">
        <div class="top-left1">
          <div class="search">
            <div class="searchRule">
              <span class="search-text" style="marginLeft:0">客户名称：</span>
              <el-input
                v-model="searchCustName"
                placeholder="请输入客户名"
                size="small"
                style="width:170px"
              ></el-input>
              <span class="search-text">ip地址：</span>
              <el-input v-model="searchIp" placeholder="请输入ip地址" size="small" style="width:170px"></el-input>
              <span class="search-text">ip状态：</span>
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
        <div class="top-link">
          <el-button type="primary" size="small" @click="uploadTem('templete/IP地址模板.xls')">下载模板</el-button>
          <el-upload
            class="upload-demo top-right"
            ref="upload"
            :limit="1"
            action="api/Resource/UploadIP"
            :on-remove="handleRemove"
            :on-change="handleRemove"
            :on-success="handleSuccess"
            multiple
            :file-list="fileList"
            accept=".xls, .xlsx"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              :disabled="isUpload"
              size="small"
              type="success"
              @click="submitUpload"
            >确认上传</el-button>
          </el-upload>
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
      <el-table-column prop="custName" label="客户" align="center"></el-table-column>
      <el-table-column prop="net" label="ip段地址" align="center"></el-table-column>
      <el-table-column prop="ipAddress" label="ip地址" align="center"></el-table-column>
      <el-table-column prop="mask" label="掩码" align="center"></el-table-column>
      <el-table-column prop="state" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==1">空闲</span>
          <span v-if="scope.row.state==2">实占</span>
          <span v-if="scope.row.state==3">自用</span>
          <span v-if="scope.row.state==6">预占</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div style="display:flex">
        <el-button type="primary" icon="el-icon-success" @click="handleRentIP">租用ip</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="retreatIP">退租</el-button>
        <el-button type="success" icon="el-icon-view" @click="showChoose">已选择</el-button>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleSearch"
        :current-page.sync="pageIndex"
        :page-sizes="[10,100,300,500]"
        :page-size="pagesize"
        align="right"
        layout="total,sizes, prev, pager, next,jumper"
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
Vue.use(ElementUI);

@Component
export default class IpResource extends Vue {
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
  private async retreatIP() {
    if (this.allChoose.length > 0) {
      let ipId = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        ipId.push(this.allChoose[i].id);
      }
      this.ipId = ipId.join(",");
      this.mainLoading = true;
      let randomNum = Math.round(Math.random() * 10000);
      let url = `api/Resource/CancelRentIPBat?IPIds=${this.ipId}&randomNum=${randomNum}`;
      let res = await Axios.get(url);
      this.mainLoading = false;
      if (res.data.code == 1) {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "success",
          message: "退租IP成功"
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
        message: "您未选择退租的IP",
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
  private ipId: string = "";
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
    let url = `api/Resource/AddCustRentIPBat?custId=${this.custId}&IPIds=${this.ipId}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    this.mainLoading = false;
    if (res.data.code == 1) {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "success",
        message: "租用IP成功"
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
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCust?custname=${custname}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
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
      let ipId = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        ipId.push(this.allChoose[i].id);
      }
      this.ipId = ipId.join(",");
      this.getCusts();
      this.custDialogVisible = true;
      this.custLoading = true;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择租用的IP",
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

  //下载模板
  private async uploadTem(url: string) {
    window.location.href = url;
  }
  private PageData: Array<IP> = [];
  private tableData: object[] = [];
  private loading: boolean = true;
  //上传
  private fileList = [];
  private uploadData: object[] = [];
  private allUploadMess: object = {};
  private uploadDialogVisible: boolean = false;
  private isUploadNo: boolean = false;
  private failMess: string = "";
  private uploadLoading: boolean = true;
  private mainLoading: boolean = false;
  private uploadPageData: object[] = [];
  private isUpload: boolean = false;
  private isUploadSuccess: boolean = false;
  private uploadKey: string = "";

  private submitUpload() {
    if (this.fileList.length > 0) {
      this.mainLoading = true;
      this.isUploadNo = true;

      this.$refs.upload.submit();
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择文件",
        type: "warning"
      });
    }
  }
  private handleSuccess(res, file, fileList) {
    this.allUploadMess = res.data.list;
    this.isUploadSuccess = !res.data.flag;
    let uploadData = [];
    if (res.data.list) {
      uploadData = res.data.list.ips;
    } else {
      this.failMess = res.descr;
    }
    let uploadKey = res.data.key;
    this.uploadKey = uploadKey;
    this.uploadData = uploadData;
    this.getUploadPageData();
    this.uploadDataCount = uploadData.length;
    this.uploadDialogVisible = true;
    this.mainLoading = false;
  }
  private handleRemove(file, fileList) {
    this.fileList = fileList;
  }

  //上传列表分页
  private uploadCurrentPage: number = 1;
  private activeName: string = "ips";
  private nowTab: string = "ips";
  private uploadPagesize: number = 10;
  private uploadDataCount: number = 0;
  private handleTabClick(tab, event) {
    if (this.nowTab != tab.name) {
      this.uploadCurrentPage = 1;
      this.uploadPagesize = 10;
      let uploadData = [];
      if (tab.name == "custs") {
        uploadData = this.allUploadMess.custs;
      }
      if (tab.name == "ipnets") {
        uploadData = this.allUploadMess.ipnets;
      }
      if (tab.name == "ips") {
        uploadData = this.allUploadMess.ips;
      }
      this.uploadData = uploadData;
      this.uploadDataCount = uploadData.length;
      this.getUploadPageData();
      this.nowTab = tab.name;
    }
  }
  private async uploadDialogNo() {
    this.failMess = "";
    if (this.isUploadNo) {
      let key = this.uploadKey;
      this.uploadCurrentPage = 1;
      this.uploadPagesize = 10;
      if (key && this.fileList.length > 0) {
        this.mainLoading = true;
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/CancelInsertRes?key=${key}&randomNum=${randomNum}`;
        let res = await Axios.get(url);
        this.mainLoading = false;
        if (res.data.code == 1) {
          this.$message({
            duration: 2000,
            showClose: true,
            type: "success",
            message: "取消上传成功"
          });
          this.fileList = [];
        } else {
          this.$message({
            duration: 2000,
            showClose: true,
            type: "info",
            message: res.data.descr
          });
        }
      }
      this.uploadDialogVisible = false;
      this.$refs.upload.clearFiles();
      this.nowTab = "ips";
      this.activeName = "ips";
    }
  }
  private async uploadDialogYes() {
    let key = this.uploadKey;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/InsertRes?key=${key}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "success",
        message: "上传成功"
      });
      this.handleSearch(null);
      this.uploadDialogVisible = false;
      this.$refs.upload.clearFiles();
      this.fileList = [];
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "info",
        message: res.data.descr
      });
    }
  }
  private uploadHandleSizeChange(val: string) {
    this.uploadPagesize = parseInt(val);
    this.getUploadPageData();
  }
  private uploadHandleCurrentChange(val: string) {
    this.uploadCurrentPage = parseInt(val);
    this.getUploadPageData();
  }
  private getUploadPageData() {
    let uploadData = this.uploadData;
    let uploadPageData = [];
    let uploadCurrentPage = this.uploadCurrentPage - 1;
    let count = 0;
    for (let i = 0; i < uploadData.length; i++) {
      if (uploadData[i + uploadCurrentPage * this.uploadPagesize]) {
        uploadPageData.push(
          uploadData[i + uploadCurrentPage * this.uploadPagesize]
        );
        count++;
      } else {
        break;
      }
      if (count > this.uploadPagesize - 1) {
        break;
      }
    }
    this.uploadPageData = uploadPageData;
    this.uploadLoading = false;
  }

  //查询
  private stateArr = [
    { id: "1", name: "空闲" },
    { id: "2", name: "实占" },
    { id: "3", name: "自用" },
    { id: "6", name: "预占" }
  ];
  private searchIp: string = "";
  private searchCustName: string = "";
  private searchState: string = "";
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
    let ip = this.searchIp;
    let custName = this.searchCustName;
    let state = this.searchState;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetIPs?state=${state}&ip=${ip}&custName=${custName}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
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
  private async beforeunloadHandler(e) {
    let key = this.uploadKey;
    if (key) {
      let randomNum = Math.round(Math.random() * 10000);
      let url = `api/Resource/CancelInsertRes?key=${key}&randomNum=${randomNum}`;
      let res = await Axios.get(url);
    }
  }
  async mounted() {
    this.handleSearch(1);
    window.addEventListener("beforeunload", e => this.beforeunloadHandler(e));
  }
  beforeDestroy() {
    window.removeEventListener("beforeunload", e =>
      this.beforeunloadHandler(e)
    );
  }
}
</script>

<style lang="scss">
.ipResource {
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .rentIP {
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
    margin-left: 30px;
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