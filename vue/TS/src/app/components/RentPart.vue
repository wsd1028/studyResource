<template>
  <div
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    class="rentPart"
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
        <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
        <el-table-column prop="nodeName" label="节点名称" align="center"></el-table-column>
        <el-table-column prop="rackName" label="所属机柜" align="center"></el-table-column>
        <el-table-column prop="location" label="设备位置" align="center"></el-table-column>
        <el-table-column prop="useatCode" label="机位编码" align="center"></el-table-column>

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

    <el-dialog :visible.sync="custDialogVisible" width="730px" center class="rentParts">
      <h1 class="myTitle">租用机位</h1>
      <div style="alignItems:center;display:flex;margin:20px;justifyContent: center;">
        <span style="width:70px;display:block">客户名称：</span>
        <el-input
          v-model="searchValueCustname"
          placeholder="请输入客户名称"
          size="small"
          style="width:200px"
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="custDialogNo">取 消</el-button>
        <el-button type="primary" @click="custDialogYes" :disabled="isCust">确认租用</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="uploadDialogVisible" width="1220px" center @close="uploadDialogNo">
      <h1 class="myTitle">上传数据预览</h1>
      <el-tabs
        type="border-card"
        v-model="activeName"
        v-if="!failMess"
        @tab-click="handleTabClick"
        class="myTable"
      >
        <el-tab-pane label="客户信息" name="custs">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="510px"
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
        <el-tab-pane label="导入数据" name="originalData">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="510px"
            border
            style="width: 98%"
          >
            <el-table-column prop="custName" label="客户名" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="locations" label="设备位置" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.locations}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="roomName" label="机房" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.roomName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rackName" label="机柜" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.rackName}}</span>
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
        <el-tab-pane label="机位" name="useats">
          <el-table
            :data="uploadPageData"
            class="marginTop myTable"
            v-loading="uploadLoading"
            element-loading-text="加载中"
            element-loading-spinner="el-icon-loading"
            height="510px"
            border
            style="width: 98%"
          >
            <el-table-column prop="custName" label="客户名称" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="nodeName" label="节点名称" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.nodeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="rackName" label="所属机柜" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.rackName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="location" label="设备位置" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.location}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="useatCode" label="机位编码" align="center">
              <template slot-scope="scope">
                <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.useatCode}}</span>
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
          align="center"
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

    <el-dialog
      :visible.sync="addDialogVisible"
      width="30%"
      center
      @close="closeAddDialog('addForm')"
    >
      <h1 class="myTitle">增加</h1>
      <el-form
        v-if="addForm"
        :model="addForm"
        status-icon
        :rules="fromRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="节点" prop="nodeName">
          <el-select v-model="addForm.nodeName" placeholder="请选择" auto-complete="off">
            <el-option
              v-for="item in nodeMess"
              :key="item.nodeId"
              :label="item.nodeName"
              :value="item.nodeId"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="login">
          <el-input v-model="addForm.login" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="addForm.realName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNum">
          <el-input v-model="addForm.phoneNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDialogNo('addForm')">取 消</el-button>
          <el-button type="primary" @click="addDialogYes('addForm')">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="top">
      <div class="top-left">
        <div class="top-left1">
          <el-button
            v-if="false"
            type="primary"
            size="small"
            icon="el-icon-circle-plus-outline"
            @click="handleAdd"
          >增加</el-button>
          <div class="search" style="width:800px">
            <div class="searchRule" style="marginLeft:0">
              <span>节点：</span>
              <nodeTree :options="nodeTree" @getValue="changeNodeId"></nodeTree>
            </div>
            <div class="searchRule">
              <span>机房：</span>
              <el-select v-model="searchRoomId" placeholder="请选择" style="width:170px">
                <el-option label="请选择" value style="display:block"></el-option>
                <el-option
                  v-for="item in selectRoomMess"
                  :key="item.id"
                  :label="item.roomName"
                  :value="item.id"
                  style="display:block"
                ></el-option>
              </el-select>
            </div>
            <div class="searchRule">
              <span>客户名：</span>
              <el-input
                v-model="searchValueCustName"
                placeholder="请输入客户名"
                size="small"
                style="width:170px"
              ></el-input>
            </div>
            <div class="searchRule" style="marginLeft:0;marginTop:10px">
              <span>机柜名称：</span>
              <el-input
                v-model="searchValueRackName"
                placeholder="请输入机柜名称"
                size="small"
                style="width:170px"
              ></el-input>
            </div>
            <div class="searchRule" style="marginTop:10px">
              <span style="width:80px">机位编码：</span>
              <el-input
                v-model="searchValueUseatCode"
                placeholder="请输入机位编码"
                size="small"
                style="width:170px"
              ></el-input>
            </div>
            <el-button
              type="primary"
              style="flexShrink:0"
              size="small"
              icon="el-icon-search"
              @click="handleSearch(1)"
              class="search-btn"
            >查找</el-button>
          </div>
        </div>
        <div class="top-link">
          <el-button type="primary" size="small" @click="uploadTem('templete/散租机位模板.xls')">下载模板</el-button>
          <el-upload
            class="upload-demo top-right"
            ref="upload"
            :limit="1"
            action="api/Resource/UploadCustUseat"
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
      :data="PageData"
      class="marginTop"
      ref="multipleTable"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      border
      row-key="id"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
        :selectable="canSelected"
      ></el-table-column>
      <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="nodeName" label="节点名称" align="center"></el-table-column>
      <el-table-column prop="rackName" label="所属机柜" align="center"></el-table-column>
      <el-table-column prop="location" label="设备位置" align="center"></el-table-column>
      <el-table-column prop="useatCode" label="机位编码" align="center"></el-table-column>
    </el-table>
    <div class="table-footer">
      <div>
        <el-button type="primary" icon="el-icon-success" @click="handleRentUseat">租用机位</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="retreatPart">退租</el-button>
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
import { CustDevice } from "../core/CustDevice";
import { constants } from "crypto";
import nodeTree from "./NodeTree";
Vue.use(ElementUI);

@Component({
  components: {
    nodeTree
  }
})
export default class RentPart extends Vue {
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
  //批量退租
  private async retreatPart() {
    if (this.allChoose.length > 0) {
      let useatId = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        useatId.push(this.allChoose[i].id);
      }
      this.useatId = useatId.join(",");
      this.mainLoading = true;
      let randomNum = Math.round(Math.random() * 10000);
      let url = `api/Resource/CancelRentUseatBat?useatIds=${this.useatId}&randomNum=${randomNum}`;
      let res = await Axios.get(url);
      this.mainLoading = false;
      if (res.data.code == 1) {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "success",
          message: "退租机位成功"
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
        message: "您未选择退租机位",
        type: "warning"
      });
    }
  }
  // 批量操作
  private allChoose: any[] = [];
  private handleSelectionChange(value) {
    this.allChoose = value;
  }
  private canSelected(row: object) {
    return row.rackUseId == 2 || row.rackUseId == 1;
  }
  //下载模板
  private async uploadTem(url: string) {
    window.location.href = url;
  }
  private PageData: Array<CustDevice> = [];
  private tableData: object[] = [];
  private loading: boolean = true;
  private nodeMess: object[] = [];
  private roomMess: object[] = [];
  private SysTypeMess: object[] = [];
  //客户租用
  private custPageIndex: number = 1;
  private custPagesize: number = 10;
  private custDataCount: number = 0;
  private custLoading: boolean = false;
  private isCust: boolean = true;
  private custDialogVisible: boolean = false;
  private custTableData: object[] = [];
  private searchValueCustname: string = "";
  private useatId: string = "";
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
    let url = `api/Resource/AddCustRentUseatBat?custId=${this.custId}&useatIds=${this.useatId}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    this.mainLoading = false;
    if (res.data.code == 1) {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "success",
        message: "租用机位成功"
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
  private handleRentUseat() {
    if (this.allChoose.length > 0) {
      let useatId = [];
      for (let i = 0; i < this.allChoose.length; i++) {
        useatId.push(this.allChoose[i].id);
      }
      this.useatId = useatId.join(",");
      this.getCusts();
      this.custDialogVisible = true;
      this.custLoading = true;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择租用的机位",
        type: "warning"
      });
    }
  }
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
      uploadData = res.data.list.custs;
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
  private activeName: string = "custs";
  private nowTab: string = "custs";
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
      if (tab.name == "useats") {
        uploadData = this.allUploadMess.useats;
      }
      if (tab.name == "originalData") {
        uploadData = this.allUploadMess.originalData;
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
      this.nowTab = "custs";
      this.activeName = "custs";
      this.isUploadNo = false;
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
  //增加
  private addDialogVisible: boolean = false;
  private addForm: CustDevice = {};
  private checkIp = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback();
    } else {
      if (
        /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("ip地址格式不正确"));
      }
    }
  };
  private checkFacStandard = (rule: any, value: any, callback: any) => {
    if (value) {
      if (/^[1-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error("占用空间高度（U）格式不正确"));
      }
    } else {
      callback(new Error("占用空间高度（U）不能为空"));
    }
  };
  private checkLocation = (rule: any, value: any, callback: any) => {
    if (value) {
      if (/^[0-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error("占用空间高度（U）格式不正确"));
      }
    } else {
      callback(new Error("所属机架位置不能为空"));
    }
  };
  private fromRules: object = {
    nodeId: [{ trigger: "blur", required: true, message: "所属节点不能为空" }],
    roomId: [{ trigger: "blur", required: true, message: "所属机房不能为空" }],
    cabId: [{ trigger: "blur", required: true, message: "所属机柜不能为空" }],
    osid: [{ trigger: "blur", required: true, message: "操作系统不能为空" }],
    serverName: [
      { trigger: "blur", required: true, message: "设备名称不能为空" }
    ],
    serverCode: [
      { trigger: "blur", required: true, message: "设备编码不能为空" }
    ],
    publicIP: [{ trigger: "blur", validator: this.checkIp }],
    privateIP: [{ trigger: "blur", validator: this.checkIp }],
    location: [
      { trigger: "blur", required: true, message: "所属机架位置不能为空" }
    ],
    facStandard: [
      { trigger: "blur", required: true, validator: this.checkFacStandard }
    ]
  };
  private handleAdd() {
    this.addDialogVisible = true;
  }
  private addDialogNo(formName: any) {
    this.$refs[formName].resetFields();
    this.addDialogVisible = false;
  }
  private addDialogYes(formName: any) {
    this.$refs[formName].validate(valid => {
      if (valid) {
        this.$refs[formName].resetFields();
        this.addDialogVisible = false;
      } else {
        this.$message({
          duration: 2000,
          showClose: true,
          message: "信息不完整",
          type: "warning"
        });
      }
    });
  }
  private closeAddDialog(formName: any) {
    this.$refs[formName].resetFields();
    this.addDialogVisible = false;
  }

  //查询
  private searchValueRackName: string = "";
  private searchValueUseatCode: string = "";
  private searchNodeId: string = "";
  private searchRoomId: string = "";
  private searchValueCustName: string = "";
  private selectRoomMess: object[] = [];
  private changeNodeId(value: number) {
    let roomMess = this.roomMess;
    let selectRoomMess = [];
    this.searchRoomId = "";
    selectRoomMess = roomMess.filter(item => {
      return item.nodeID == value;
    });
    this.searchNodeId = value + "";
    this.selectRoomMess = selectRoomMess;
  }
  private async handleSearch(pageIndex) {
    this.loading = true;
    if (pageIndex) {
      this.pageIndex = pageIndex;
    } else {
      pageIndex = this.pageIndex;
      if (pageIndex - 1 == this.dataCount / this.pagesize) {
        pageIndex--;
      }
    }
    let nodeId = this.searchNodeId;
    let roomId = this.searchRoomId;
    let rackName = this.searchValueRackName;
    let useatCode = this.searchValueUseatCode;
    let custName = this.searchValueCustName;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetUseat?useatCode=${useatCode}&CustName=${custName}&RackName=${rackName}&NodeId=${nodeId}&RoomId=${roomId}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
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
  // 节点树
  private nodeTree: object[] = [];
  private AddChildNode(node) {
    node.children = [];
    this.nodeMess.forEach(item => {
      if (item.fatherNodeId == node.nodeId) {
        let child = item;
        node.children.push(child);
        this.AddChildNode(child);
      }
    });
    return node;
  }
  private async getNodes() {
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetNodes?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.nodeMess = res.data.data;
      let rootNode = {};
      let nodeTree = [];
      for (let i = 0; i < res.data.data.length; i++) {
        if (res.data.data[i].nodeId == 20005) {
          rootNode = res.data.data[i];
        }
      }
      let node = this.AddChildNode(rootNode);
      nodeTree.push(node);
      this.nodeTree = nodeTree;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }
  private async getRoom() {
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetRooms?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.roomMess = res.data.data;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }

  private async getSysType() {
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetAllSysType?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.SysTypeMess = res.data.data;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
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
    this.getNodes();
    this.getRoom();
    this.getSysType();
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
.rentPart {
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  .rentParts {
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
    margin: 12px;
  }
  .top {
    justify-content: space-between;
    display: block;
  }
  .top-left {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  .top-link {
    display: flex;
    align-items: flex-end;
    margin-right: 30px;
    margin-top: 10px;
    height: 40px;
    width: 420px;
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
    align-items: flex-end;
    flex-wrap: wrap;
  }
  .searchRule {
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
    align-items: center;
    margin-left: 20px;
  }
  .search-btn {
    margin-left: 15px;
    height: 40px;
    box-sizing: border-box;
  }
  .search .el-input__inner {
    height: 40px;
  }
  .searchRule span {
    width: 80px;
    display: block;
    flex-shrink: 0;
    text-align: right;
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