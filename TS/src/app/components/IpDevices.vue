<template>
  <div
    v-loading="isUploadLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
    class="ipDevices"
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
        height="510px"
        border
        style="width: 98%"
      >
        <el-table-column prop="net" label="IP段" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.net}}</span>
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
          <div class="search">
            <div class="searchRule">
              <span style="width:52px">ip段：</span>
              <el-input v-model="searchNet" style="width:170px" placeholder="请输入ip段地址" size="small"></el-input>
            </div>

            <el-button
              type="primary"
              class="search-btn"
              size="small"
              icon="el-icon-search"
              @click="handleSearch(1)"
            >查找</el-button>
          </div>
        </div>
        <el-upload
          class="upload-demo top-right"
          ref="upload"
          :limit="1"
          action="api/Resource/UploadIPNet"
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
      <div class="top-link">
        <el-button type="primary" size="small" @click="uploadTem('templete/IP段地址模板.xls')">下载模板</el-button>
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
      <el-table-column prop="net" label="ip段名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.net}}/{{scope.row.maskLen}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mask" label="掩码" align="center"></el-table-column>
      <el-table-column prop="ipCount" label="ip数量" align="center"></el-table-column>
      <el-table-column prop="gateway" label="网关地址" align="center"></el-table-column>
      <el-table-column prop="beginIp" label="开始ip" align="center"></el-table-column>
      <el-table-column prop="endIp" label="结束ip" align="center"></el-table-column>
      <el-table-column prop align="center" label="操作" width="150px">
        <template slot-scope="scope">
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
import { IPNet } from "../core/IPNet";
import { constants } from "crypto";

Vue.use(ElementUI);

@Component
export default class IpDevices extends Vue {
  //下载模板
  private async uploadTem(url: string) {
    window.location.href = url;
  }
  private PageData: Array<IPNet> = [];
  private tableData: object[] = [];
  private loading: boolean = true;

  //上传
  private fileList = [];
  private uploadData: object[] = [];
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
  private addForm: IPNet = {};
  private checkEmail = (rule: any, value: any, callback: any) => {
    if (value) {
      if (
        /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("邮箱格式不正确"));
      }
    } else {
      callback(new Error("邮箱不能为空"));
    }
  };
  private checkPhone = (rule: any, value: any, callback: any) => {
    if (value) {
      if (/^1[34578]\d{9}$/.test(value)) {
        callback();
      } else {
        callback(new Error("手机号格式不正确"));
      }
    } else {
      callback(new Error("手机号不能为空"));
    }
  };
  private fromRules: object = {
    nodeId: [{ trigger: "blur", required: true, message: "节点不能为空" }],
    login: [{ trigger: "blur", required: true, message: "账号不能为空" }],
    realName: [{ trigger: "blur", required: true, message: "姓名不能为空" }],
    email: [{ trigger: "blur", required: true, validator: this.checkEmail }],
    phoneNum: [{ trigger: "blur", required: true, validator: this.checkPhone }]
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

  private handleDelete(index: number, row: IPNet) {
    this.$confirm("此操作将永久删除该IP段, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let id = this.PageData[index].id;
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/DelIPNet?id=${id}&randomNum=${randomNum}`;
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
  //查询
  private searchNet: string = "";
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
    let net = this.searchNet;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetIPNets?net=${net}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
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
.ipDevices {
  .el-table__body tr.current-row > td {
    background: #78c3f5 !important;
  }
  .search-btn {
    margin-left: 15px;
    box-sizing: border-box;
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
    display: flex;
    justify-content: space-between;
  }
  .top-left {
    display: flex;
    height: 50px;
    align-items: flex-end;
  }
  .top-link {
    display: flex;
    align-items: flex-end;
    margin-right: 30px;
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
    margin-left: 30px;
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
  }
  .searchRule span {
    width: 80px;
    display: block;
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