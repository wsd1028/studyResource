<template>
  <div
    v-loading="isUploadLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
    class="systemRole"
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
        <el-table-column prop="roleName" label="角色名称" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="descr" label="角色描述" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.descr}}</span>
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
          :page-sizes="[5,10,15,20]"
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="descr">
          <el-input v-model="addForm.descr" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="closeAddDialog('addForm')">取 消</el-button>
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
        label-width="100px"
        class="demo-ruleForm myForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="updateForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="descr">
          <el-input v-model="updateForm.descr" auto-complete="off"></el-input>
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
          <div class="search">
            <div class="searchRule" style="marginLeft:0">
              <span>角色名称：</span>
              <el-input
                v-model="searchRoleName"
                style="width:170px"
                placeholder="请输入名称"
                size="small"
              ></el-input>
            </div>
            <div class="searchRule">
              <span>角色描述：</span>
              <el-input v-model="searchDescr" style="width:170px" placeholder="请输入描述" size="small"></el-input>
            </div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleSearch"
              class="search-btn"
            >查找</el-button>
          </div>
        </div>
        <div class="top-link">
          <el-button type="primary" size="small" @click="uploadTem('templete/系统角色模板.xlsx')">下载模板</el-button>
          <el-upload
            class="upload-demo top-right"
            ref="upload"
            :limit="1"
            action="api/Resource/UploadRole"
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

    <el-table :data="PageData" class="marginTop" v-loading="loading" border style="width: 98%">
      <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
      <el-table-column prop="descr" label="角色描述" align="center"></el-table-column>
      <el-table-column prop align="center" label="管理" width="300px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
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
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10,20,50,100]"
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
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { Role } from "../core/Role";
import { async } from "q";
import { constants } from "crypto";

Vue.use(ElementUI);

@Component
export default class SystemRole extends Vue {
  //下载模板
  private async uploadTem(url: string) {
    window.location.href = url;
  }
  private tableData: Array<Role> = [];
  private loading: boolean = false;
  //上传
  private fileList = [];
  private uploadData: object[] = [];
  private uploadDialogVisible: boolean = false;
  private isUploadNo: boolean = false;

  private failMess: string = "";
  private uploadLoading: boolean = false;
  private isUploadLoading: boolean = false;
  private uploadPageData: object[] = [];
  private isUploadSuccess: boolean = false;
  private isUpload: boolean = false;
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
      this.fileList = [];
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
      this.getData();
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
    this.uploadLoading = true;
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
  private addForm: Role = {};
  private fromRules: object = {
    roleName: [
      { trigger: "blur", required: true, message: "角色名称不能为空" }
    ],
    descr: [{ trigger: "blur", required: true, message: "角色信息不能为空" }]
  };
  private handleAdd() {
    this.addDialogVisible = true;
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
  private handleDelete(index: number, row: object) {
    this.$confirm("此操作将永久删除该系统角色, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(async () => {
        let id = this.PageData[index].id;
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/DelRole?id=${id}&randomNum=${randomNum}`;
        let res = await Axios.get(url);
        if (res.data.code == 1) {
          this.$message({
            duration: 2000,
            showClose: true,
            type: "success",
            message: "删除成功!"
          });
          this.getData();
        } else {
          this.$message({
            duration: 2000,
            showClose: true,
            type: "info",
            message: res.data.descr
          });
        }
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
  private updateDialogVisible: boolean = false;
  private updateForm: Role = null;
  private handleUpdate(index: number, row: Role) {
    this.updateDialogVisible = true;
    this.updateForm = JSON.parse(JSON.stringify(row));
  }
  private closeUpdateDialog(formName: any) {
    this.updateDialogVisible = false;
    this.$refs[formName].resetFields();
  }
  private updateDialogYes(formName: any) {
    this.$refs[formName].validate(async valid => {
      if (valid) {
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/UpdateRole?randomNum=${randomNum}`;
        let res = await Axios.post(url, this.updateForm);
        if (res.data.code == 1) {
          this.getData();
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
  private searchRoleName: string = "";
  private searchDescr: string = "";
  private async handleSearch() {
    let roleName = this.searchRoleName;
    let descr = this.searchDescr;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetRoles?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      let tableData = res.data.data;
      let searchData = [];
      searchData = tableData.filter(
        item => item.roleName.includes(roleName) && item.descr.includes(descr)
      );
      this.tableData = searchData;
      this.currentPage = 1;
      this.getPageData();
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }
  //分页
  private PageData: object[] = [];
  private currentPage: number = 1;
  private pagesize: number = 10;
  private dataCount: number = 0;
  private handleSizeChange(val: string) {
    this.pagesize = parseInt(val);
    this.getPageData();
  }
  private handleCurrentChange(val: string) {
    this.currentPage = parseInt(val);
    this.getPageData();
  }
  private getPageData() {
    let tableData = this.tableData;
    this.dataCount = tableData.length;
    let pageData = [];
    let currentPage = this.currentPage - 1;
    if (currentPage == tableData.length / this.pagesize) {
      currentPage--;
    }
    let count = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i + currentPage * this.pagesize]) {
        pageData.push(this.tableData[i + currentPage * this.pagesize]);
        count++;
      } else {
        break;
      }
      if (count > this.pagesize - 1) {
        break;
      }
    }
    this.PageData = pageData;
    this.loading = false;
  }

  private async getData() {
    this.loading = true;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetRoles?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      let tableData = res.data.data;
      this.tableData = tableData;
      this.getPageData();
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
    this.getData();
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
.systemRole {
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
    margin-left: 20px;
  }
  .search-btn {
    margin-left: 15px;
  }
  .searchRule span {
    width: 80px;
    display: block;
    flex-shrink: 0;
  }
  .marginTop {
    margin-top: 20px;
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