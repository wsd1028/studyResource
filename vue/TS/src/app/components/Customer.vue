<template>
  <div
    v-loading="isUploadLoading"
    element-loading-text="上传中"
    element-loading-spinner="el-icon-loading"
    class="customer"
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
        <el-table-column prop="custName" label="客户名称" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.custName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contactPerson" label="联系人" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.contactPerson}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clientManager" label="客户经理" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.clientManager}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clientType" label="客户类型" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.clientType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contactPhone" label="电话" align="center">
          <template slot-scope="scope">
            <span :style="{color:(scope.row.insertDescr?'red':'')}">{{scope.row.contactPhone}}</span>
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
        <el-form-item label="客户名称" prop="custName">
          <el-input v-model="updateForm.custName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="updateForm.contactPerson" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="客户经理" prop="clientManagerId">
          <el-select
            style="width:100%"
            v-model="updateForm.clientManagerId"
            placeholder="请选择"
            auto-complete="off"
          >
            <el-option
              v-for="item in custManagers"
              :key="item.id"
              :label="item.realName"
              :value="item.id"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型" prop="clientTypeId">
          <el-select
            style="width:100%"
            v-model="updateForm.clientTypeId"
            placeholder="请选择"
            auto-complete="off"
          >
            <el-option
              v-for="item in custTypes"
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
              style="display:block"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="contactPhone">
          <el-input v-model="updateForm.contactPhone" auto-complete="off"></el-input>
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
          <div class="search">
            <div class="searchRule" style="marginLeft:0">
              <span>客户名称：</span>
              <el-input
                v-model="searchValueName"
                style="width:170px"
                placeholder="请输入客户名称"
                size="small"
              ></el-input>
            </div>
            <div class="searchRule">
              <span>客户经理：</span>
              <el-input
                v-model="searchValueManager"
                style="width:170px"
                placeholder="请输入客户经理"
                size="small"
              ></el-input>
            </div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="handleSearch(1)"
              class="search-btn"
            >查找</el-button>
          </div>
        </div>
        <div class="top-link">
          <el-button type="primary" size="small" @click="uploadTem('templete/客户信息模板.xlsx')">下载模板</el-button>
          <el-upload
            class="upload-demo top-right"
            ref="upload"
            :limit="1"
            action="api/Resource/UploadCust"
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
      <el-table-column prop="custName" label="客户名称" align="center"></el-table-column>
      <el-table-column prop="contactPerson" label="联系人" align="center"></el-table-column>
      <el-table-column prop="clientManager" label="客户经理" align="center"></el-table-column>
      <el-table-column prop="clientType" label="客户类型" align="center"></el-table-column>
      <el-table-column prop="contactPhone" label="电话" align="center"></el-table-column>
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
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { async } from "q";
import { Customer } from "../core/customer";
import { constants } from "crypto";
import nodeTree from "./NodeTree";
Vue.use(ElementUI);

@Component({
  components: {
    nodeTree
  }
})
export default class Customers extends Vue {
  //下载模板
  private async uploadTem(url: string) {
    window.location.href = url;
  }
  private PageData: Array<Customer> = [];
  private tableData: object[] = [];
  private loading: boolean = false;
  private nodeMess: object[] = [];
  //上传
  private fileList = [];
  private uploadData: object[] = [];
  private uploadDialogVisible: boolean = false;
  private isUploadNo: boolean = false;

  private failMess: string = "";
  private uploadLoading: boolean = false;
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
    custName: [
      { trigger: "blur", required: true, message: "客户名称不能为空" }
    ],
    clientManager: [
      { trigger: "blur", required: true, message: "客户经理不能为空" }
    ],
    clientType: [
      { trigger: "blur", required: true, message: "客户类型不能为空" }
    ],
    contactPerson: [
      { trigger: "blur", required: true, message: "客户联系人不能为空" }
    ],
    contactPhone: [
      { trigger: "blur", required: true, validator: this.checkPhone }
    ]
  };

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
    this.$confirm("此操作将永久删除该客户, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        let id = this.PageData[index].id;
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/DelCust?id=${id}&randomNum=${randomNum}`;
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
  private updateDialogVisible: boolean = false;
  private updateIndex: number = 0;
  private updateForm: Customer = null;
  private handleUpdate(index: number, row: Customer) {
    this.updateForm = JSON.parse(JSON.stringify(row));
    this.updateIndex = index;
    this.updateDialogVisible = true;
  }
  private closeUpdateDialog(formName: any) {
    this.updateDialogVisible = false;
    this.$refs[formName].resetFields();
  }

  private updateDialogYes(formName: any) {
    this.$refs[formName].validate(async valid => {
      if (valid) {
        let randomNum = Math.round(Math.random() * 10000);
        let url = `api/Resource/UpdateCust?randomNum=${randomNum}`;
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
  private searchValueManager: string = "";
  private searchValueName: string = "";
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
    let custName = this.searchValueName;
    let managerName = this.searchValueManager;
    let PageSize = this.pagesize;
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCust?clientManager=${managerName}&custname=${custName}&PageIndex=${pageIndex}&PageSize=${PageSize}&randomNum=${randomNum}`;
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
  private changeUpdateNodeId(value: number) {
    this.updateForm.nodeId = value;
  }
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
  private custTypes = [];
  private async getCustTypes() {
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCustTypes?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      this.custTypes = res.data.data;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        type: "warning",
        message: res.data.descr
      });
    }
  }
  private custManagers = [];
  private async getCustManagers() {
    let randomNum = Math.round(Math.random() * 10000);
    let url = `api/Resource/GetCustManagers?randomNum=${randomNum}`;
    let res = await Axios.get(url);
    if (res.data.code == 1) {
      for (let i = 0; i < res.data.data.length; i++) {
        res.data.data[i].id = parseInt(res.data.data[i].id);
      }
      this.custManagers = res.data.data;
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
    this.getCustTypes();
    this.getCustManagers();
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
.el-input__icon {
  line-height: 32px !important;
}
.search .el-input__inner {
  height: 32px !important;
}
.search-btn {
  height: 32px !important;
}
.customer {
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
    margin-right: 30px;
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