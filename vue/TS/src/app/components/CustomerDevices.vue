<template>
  <div
    v-loading="isUploadLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
    class="customerDevices"
  >
    <el-dialog :visible.sync="uploadDialogVisible" width="900px" center @close="uploadDialogNo">
      <h1 class="myTitle">上传数据预览</h1>
      <el-table
        :data="uploadPageData"
        v-if="uploadPageData.length>0"
        class="marginTop myTable"
        v-loading="uploadLoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        height="420px"
        border
        style="width: 98%"
      >
        <el-table-column prop="userName" label="客户名称" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serverName" label="设备名称" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.serverName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="serverCode" label="设备编号" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.serverCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roomName" label="所在机房" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.roomName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cabName" label="所在机柜" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.cabName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="所在机位(U)" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.location}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="facStandard" label="设备大小" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.facStandard}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="osid" label="操作系统" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.osid}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="privateIP" label="设备IP地址" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.privateIP}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.beginTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="insertDescr" label="返回信息" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.insertDescr">信息正确，可提交</span>
            <span v-else style="color:red">{{scope.row.insertDescr}}</span>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog :visible.sync="freeUDialogVisible" width="798px" center>
      <h1 class="myTitle">可选U位</h1>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        :data="updateFreeUMess"
        class="marginTop myTable"
        height="420px"
        border
        @close="chooseFreeUNo"
        v-loading="freeULoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        style="width:98%;marginTop:24px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="useatCode" label="U位编码" align="center"></el-table-column>
        <el-table-column prop="location" label="位置" align="center"></el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseFreeUNo">取 消</el-button>
        <el-button type="primary" @click="chooseFreeUYes">提交</el-button>
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

    <el-dialog
      :visible.sync="updateDialogVisible"
      width="30%"
      center
      @close="closeUpdateDialog('updateForm')"
    >
      <h1 class="myTitle">修改</h1>
      <el-form
        v-if="updateForm"
        :model="updateForm"
        status-icon
        :rules="fromRules"
        ref="updateForm"
        label-width="120px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="所属节点" prop="nodeId">
          <nodeTree
            :options="nodeTree"
            @getValue="changeUpdateNodeId"
            :defaultTitle="updateNodeName"
          ></nodeTree>
        </el-form-item>
        <el-form-item label="所属机房" prop="roomId">
          <el-select v-model="updateForm.roomId" placeholder="请选择" @change="changeUpdateRoomId">
            <el-option
              v-for="item in updateRoomMess"
              :key="item.id"
              :label="item.roomName"
              :value="item.id"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机柜" prop="cabId">
          <el-select v-model="updateForm.cabId" placeholder="请选择" @change="changeUpdateFreeU">
            <el-option
              v-for="item in updateRackMess"
              :key="item.id"
              :label="item.rackName"
              :value="item.id"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="osid">
          <el-select v-model="updateForm.osid" placeholder="请选择">
            <el-option
              v-for="item in SysTypeMess"
              :key="item.id"
              :label="item.sysName"
              :value="item.id"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称" prop="serverName">
          <el-input v-model="updateForm.serverName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备编码" prop="serverCode">
          <el-input v-model="updateForm.serverCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="私有IP" prop="privateIP">
          <el-input v-model="updateForm.privateIP" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属机架位置" prop="location">
          <el-input v-model="updateForm.location" auto-complete="off" :readonly="true">
            <el-button slot="append" type="primary" @click="freeUDialog">选择</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="占用空间(U)" prop="facStandard">
          <el-input v-model="updateForm.facStandard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeUpdateDialog('updateForm')">取 消</el-button>
          <el-button type="primary" @click="updateDialogYes('updateForm')">确 定</el-button>
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
          <div class="search" style="width:820px">
            <div class="searchRule" style="marginLeft:0">
              <span style="width:64px">节点：</span>
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
              <span>设备名称：</span>
              <el-input
                v-model="searchValueDeviceName"
                placeholder="请输入设备名称"
                size="small"
                style="width:170px"
              ></el-input>
            </div>
            <div class="searchRule" style="marginLeft:0;marginTop:10px">
              <span style="width:64px">设备IP：</span>
              <el-input
                v-model="searchValueDeviceIP"
                placeholder="请输入设备IP"
                size="small"
                style="width:170px"
              ></el-input>
            </div>
            <div class="searchRule" style="marginTop:10px">
              <span>客户名：</span>
              <el-input
                v-model="searchValueUserName"
                placeholder="请输入客户名"
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
          <el-button type="primary" size="small" @click="uploadTem('templete/客户设备模板.xls')">下载模板</el-button>
          <el-upload
            class="upload-demo top-right"
            ref="upload"
            :limit="1"
            action="api/Resource/UploadCustDevice"
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
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      border
      style="width: 100%"
    >
      <el-table-column prop="nodeName" label="节点" align="center"></el-table-column>
      <el-table-column prop="roomName" label="机房" align="center" width="130px"></el-table-column>
      <el-table-column prop="cabName" label="机柜" align="center" width="130px"></el-table-column>
      <el-table-column prop="serverName" label="设备名称" align="center"></el-table-column>
      <el-table-column prop="osName" label="操作系统" align="center" width="100"></el-table-column>
      <el-table-column prop="facStandard" label="所占U位" width="100px" align="center"></el-table-column>
      <el-table-column prop="location" label="设备位置" align="center" width="100"></el-table-column>
      <el-table-column prop="userName" label="客户名称" align="center" width="120"></el-table-column>
      <el-table-column prop="privateIP" label="IP地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.privateIP||scope.row.publicIP}}</span>
        </template>
      </el-table-column>
      <el-table-column prop align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-setting"
            @click="handleUpdate(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleSearch"
        :current-page.sync="pageIndex"
        :page-sizes="[10,100,300,500]"
        :page-size="pagesize"
        align="right"
        style="marginTop:20px"
        layout="total,sizes, prev, pager, next,jumper"
        :total="dataCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Config } from "../core/config";
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
export default class CustomerDevices extends Vue {
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
  //上传
  private fileList = [];
  private uploadData: object[] = [];
  private allUploadMess: object = {};
  private uploadDialogVisible: boolean = false;
  private isUploadNo: boolean = false;
  private failMess: string = "";
  private uploadLoading: boolean = true;
  private isUploadLoading: boolean = false;
  private uploadPageData: object[] = [];
  private isUpload: boolean = false;
  private isUploadSuccess: boolean = false;
  private uploadKey: string = "";

  private submitUpload() {
    if (this.fileList.length > 0) {
      this.isUploadLoading = true;
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
      uploadData = res.data.list;
    } else {
      this.failMess = res.descr;
    }
    let uploadKey = res.data.key;
    this.uploadKey = uploadKey;
    this.uploadData = uploadData;
    this.getUploadPageData();
    this.uploadDataCount = uploadData.length;
    this.uploadDialogVisible = true;
    this.isUploadLoading = false;
  }
  private handleRemove(file, fileList) {
    this.fileList = fileList;
  }
  //上传列表分页
  private uploadCurrentPage: number = 1;
  private uploadPagesize: number = 10;
  private uploadDataCount: number = 0;
  private async uploadDialogNo() {
    this.failMess = "";
    if (this.isUploadNo) {
      let key = this.uploadKey;
      this.uploadCurrentPage = 1;
      this.uploadPagesize = 10;
      if (key && this.fileList.length > 0) {
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/CancelInsertRes?key=${key}&randomNum=${randomNum}`;
        let res = await Axios.get(url);
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
  //删除
  private async deleteData(url) {
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.dataCount -= 1;
      this.$message({
        duration: 2000,
        showClose: true,
        type: "success",
        message: "删除成功!"
      });
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
    this.handleSearch(null);
  }
  private handleDelete(index: number, row: object) {
    this.$confirm("此操作将永久删除该网络设备, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let id = this.PageData[index].id;
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/DelCustDevice?id=${id}&randomNum=${randomNum}`;
        this.deleteData(url);
      })
      .catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "info",
          message: "已取消删除"
        });
      });
  }

  //修改
  private updateNodeName: string = "";
  private updateDialogVisible: boolean = false;
  private freeUDialogVisible: boolean = false;
  private freeULoading: boolean = false;
  private updateIndex: number = 0;
  private updateForm: CustDevice = null;
  private updateRoomMess: object[] = [];
  private updateRackMess: object[] = [];
  private updateFreeUMess: object[] = [];
  private chooseFreeU: number[] = [];
  private freeUDialog() {
    if (
      /^[0-9]*$/.test(this.updateForm.facStandard + "") &&
      this.updateForm.facStandard
    ) {
      this.freeUDialogVisible = true;
    } else {
      this.$refs.updateForm.validateField("facStandard");
      this.$message({
        duration: 2000,
        showClose: true,
        message: "请先选择占用空间(U)",
        type: "warning"
      });
    }
  }
  private chooseFreeUNo() {
    this.$refs.multipleTable.clearSelection();
    this.freeUDialogVisible = false;
  }
  private chooseFreeUYes() {
    let chooseFreeU = this.chooseFreeU;
    let maxU = Math.max.apply(null, chooseFreeU);
    let minU = Math.min.apply(null, chooseFreeU);
    if (this.chooseFreeU.length > this.updateForm.facStandard) {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "所选U位过多",
        type: "error"
      });
    } else if (this.chooseFreeU.length < this.updateForm.facStandard) {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "所选U位过少",
        type: "error"
      });
    } else {
      if (maxU - minU == this.updateForm.facStandard - 1) {
        this.$refs.multipleTable.clearSelection();
        this.freeUDialogVisible = false;
        this.updateForm.location = `${minU}~${maxU}`;
      } else {
        this.$message({
          duration: 2000,
          showClose: true,
          message: "所选U位不正确",
          type: "error"
        });
      }
    }
  }
  private handleSelectionChange(value: any[]) {
    let chooseFreeU = [];
    for (let i = 0; i < value.length; i++) {
      chooseFreeU.push(value[i].location);
    }
    this.chooseFreeU = chooseFreeU;
  }
  private changeUpdateNodeId(value: number) {
    this.updateRackMess = [];
    this.updateFreeUMess = [];
    this.updateForm.location = "";
    this.updateForm.cabId = "";
    this.updateForm.roomId = "";
    let roomMess = this.roomMess;
    let updateRoomMess = [];
    this.updateForm.nodeId = value;
    updateRoomMess = roomMess.filter(item => {
      return item.nodeID == value;
    });
    this.updateRoomMess = updateRoomMess;
  }
  private async changeUpdateRoomId(value: number) {
    this.updateFreeUMess = [];
    this.updateForm.location = "";
    this.updateForm.cabId = "";
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCustFreeRack?custId=${this.updateForm.userId}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      let updateRackMess = [];
      updateRackMess = res.data.data.filter(item => {
        return item.roomId == value;
      });
      this.updateRackMess = updateRackMess;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: res.data.descr,
        type: "warning"
      });
    }
  }
  private async changeUpdateFreeU(value: number) {
    this.updateForm.location = "";
    this.freeULoading = true;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetFreeUseatByRack?rackid=${value}&custId=${this.updateForm.userId}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    this.updateFreeUMess = res.data.data;
    this.freeULoading = false;
  }
  private async handleUpdate(index: number, row: CustDevice) {
    let updateNodeName = this.nodeMess.filter(item => {
      return item.nodeId == row.nodeId;
    })[0].nodeName;
    this.updateNodeName = updateNodeName;
    this.updateForm = JSON.parse(JSON.stringify(row));
    this.updateIndex = index;
    this.updateDialogVisible = true;
    let roomMess = this.roomMess;
    let updateRoomMess = [];
    updateRoomMess = roomMess.filter(item => {
      return item.nodeID == this.updateForm.nodeId;
    });
    this.updateRoomMess = updateRoomMess;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetFreeRacksByRoom?roomid=${this.updateForm.roomId}&randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.updateRackMess = res.data.data;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: res.data.descr,
        type: "warning"
      });
    }
    let randomNum2 = Math.round(Math.random() * 10000);
    let url2 = `api/Resource/GetCustFreeRack?custId=${this.updateForm.userId}&randomNum=${randomNum2}`;
    let resp = await Axios.get(url2);
    if (resp.data.code == 1) {
      let updateRackMess = [];
      updateRackMess = resp.data.data.filter(item => {
        return item.roomId == this.updateForm.roomId;
      });
      this.updateRackMess = updateRackMess;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: resp.data.descr,
        type: "warning"
      });
    }

    this.updateFreeUMess = [];

    randomNum = Math.round(Math.random() * 10000);
    url = `api/Resource/GetFreeUseatByRack?rackid=${this.updateForm.cabId}&custId=${this.updateForm.userId}&randomNum=${randomNum}`;
    res = await Axios.get(url);
    if (res.data.code == 1) {
      this.updateFreeUMess = res.data.data;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: res.data.descr,
        type: "warning"
      });
    }
  }
  private closeUpdateDialog(formName: any) {
    this.updateDialogVisible = false;
    this.$refs[formName].resetFields();
  }

  private updateDialogYes(formName: any) {
    this.$refs[formName].validate(async valid => {
      if (valid) {
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/UpdateCustDevice?randomNum=${randomNum}`;
        let res = await Axios.post(url, this.updateForm);
        if (res.data.code == 1) {
          this.handleSearch(null);
          this.updateDialogVisible = false;
          this.$refs[formName].resetFields();
          this.$message({
            duration: 2000,
            showClose: true,
            type: "success",
            message: "修改成功"
          });
        } else {
          this.$message({
            duration: 2000,
            showClose: true,
            message: res.data.descr,
            type: "warning"
          });
        }
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
  //查询
  private searchValueDeviceName: string = "";
  private searchValueDeviceIP: string = "";
  private searchNodeId: string = "";
  private searchRoomId: string = "";
  private searchValueUserName: string = "";
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
    let deviceName = this.searchValueDeviceName;
    let deviceIP = this.searchValueDeviceIP;
    let userName = this.searchValueUserName;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCustDevice?ip=${deviceIP}&CustName=${userName}&deviceName=${deviceName}&NodeId=${nodeId}&RoomId=${roomId}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
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

  //节点树
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
    let url = `api/Resource/GetRooms`;
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
    let url = `api/Resource/GetAllSysType`;
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
.customerDevices {
  .myForm .el-select {
    width: 100%;
  }
  .el-select {
    display: block;
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
    width: 400px;
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
  .search .el-input__inner {
    height: 40px;
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
  .searchRule span {
    width: 80px;
    text-align: right;
    display: block;
    flex-shrink: 0;
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