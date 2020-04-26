<template>
  <div
    class="enginePrice"
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-dialog :visible.sync="addDialogVisible" width="990px" title="新增">
      <el-form
        :model="addForm"
        status-icon
        :rules="fromRules"
        ref="addForm"
        :inline="true"
        class="demo-form-inline"
        label-width="260px"
      >
        <el-form-item label="类型">
          <el-input v-model="addForm.TypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="addForm.StyleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="CPU版本">
          <el-input v-model="addForm.CPUVision" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="CPU核数">
          <el-input v-model="addForm.CPU" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存大小(G)">
          <el-input v-model="addForm.Memory" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="基准/最大带宽">
          <el-input v-model="addForm.BandWidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内网收发包">
          <el-input v-model="addForm.PackageSize" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU包月价格-非蒙贵(元/核/月)">
          <el-input v-model="addForm.VCPUBYFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU包月价格-蒙贵(元/核/月)">
          <el-input v-model="addForm.VCPUBYMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU按需价格-非蒙贵(元/核/小时)">
          <el-input v-model="addForm.VCPUAXMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU按需价格-蒙贵(元/核/小时)">
          <el-input v-model="addForm.VCPUAXMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存包月价格-非蒙贵(元/G/月)">
          <el-input v-model="addForm.NCBYFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存包月价格-蒙贵(元/G/月)">
          <el-input v-model="addForm.NCBYMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存按需价格-非蒙贵(元/G/小时)">
          <el-input v-model="addForm.NCAXFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存按需价格-蒙贵(元/G/小时)">
          <el-input v-model="addForm.NCAXMG" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="addYes('addForm')">确 定</el-button>
        <el-button @click="addNo('addForm')">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="updateDialogVisible" width="990px" title="编辑">
      <el-form
        :model="updateForm"
        status-icon
        :rules="fromRules"
        ref="updateForm"
        :inline="true"
        class="demo-form-inline"
        label-width="260px"
      >
        <el-form-item label="类型">
          <el-input v-model="updateForm.TypeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格名称">
          <el-input v-model="updateForm.StyleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="CPU版本">
          <el-input v-model="updateForm.CPUVision" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="CPU核数">
          <el-input v-model="updateForm.CPU" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存大小(G)">
          <el-input v-model="updateForm.Memory" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="基准/最大带宽">
          <el-input v-model="updateForm.BandWidth" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内网收发包">
          <el-input v-model="updateForm.PackageSize" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU包月价格-非蒙贵(元/核/月)">
          <el-input v-model="updateForm.VCPUBYFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU包月价格-蒙贵(元/核/月)">
          <el-input v-model="updateForm.VCPUBYMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU按需价格-非蒙贵(元/核/小时)">
          <el-input v-model="updateForm.VCPUAXMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="vCPU按需价格-蒙贵(元/核/小时)">
          <el-input v-model="updateForm.VCPUAXMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存包月价格-非蒙贵(元/G/月)">
          <el-input v-model="updateForm.NCBYFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存包月价格-蒙贵(元/G/月)">
          <el-input v-model="updateForm.NCBYMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存按需价格-非蒙贵(元/G/小时)">
          <el-input v-model="updateForm.NCAXFMG" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内存按需价格-蒙贵(元/G/小时)">
          <el-input v-model="updateForm.NCAXMG" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="updateYes('updateForm')">确 定</el-button>
        <el-button @click="updateNo('updateForm')">取 消</el-button>
      </div>
    </el-dialog>
    <header>
      <p>云主机系列定价管理</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>云主机系列定价管理</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <div class="table-top">
        <el-button icon="el-icon-plus" type="success" @click="handleAdd">新增</el-button>
        <div class="search">
          <div class="searchItem">
            <el-select v-model="searchType" placeholder="请选择类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="searchItem">
            <el-input v-model="searchName" placeholder="请输入规格名称"></el-input>
          </div>
          <el-button icon="el-icon-search" type="primary" v-on:click="getMainData">搜索</el-button>
        </div>
      </div>

      <div class="chooseShow">
        <el-collapse>
          <el-collapse-item title="选择列表显示列" name="1">
            <div class="showItem">
              <el-checkbox
                v-model="showRules[key].show"
                v-for="(item,key,index) of showRules"
                v-bind:key="index"
              >{{item.text}}</el-checkbox>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border>
        <el-table-column prop="TypeName" v-if="showRules['TypeName'].show" label="类型"></el-table-column>
        <el-table-column prop="StyleName" v-if="showRules['StyleName'].show" label="规格名称"></el-table-column>
        <el-table-column prop="Style" v-if="showRules['Style'].show" label="vCPUs|内存"></el-table-column>
        <el-table-column prop="CPUVision" v-if="showRules['CPUVision'].show" label="CPU版本"></el-table-column>
        <el-table-column prop="BandWidth" v-if="showRules['BandWidth'].show" label="基准/最大带宽"></el-table-column>
        <el-table-column prop="PackageSize" v-if="showRules['PackageSize'].show" label="内网收发包"></el-table-column>
        <el-table-column
          label="vCPU包月标准价格(元/核/月)"
          v-if="showRules['VCPUBYFMG'].show||showRules['VCPUBYMG'].show"
        >
          <el-table-column prop="VCPUBYFMG" v-if="showRules['VCPUBYFMG'].show" label="非蒙贵地区"></el-table-column>
          <el-table-column prop="VCPUBYMG" v-if="showRules['VCPUBYMG'].show" label="蒙贵地区"></el-table-column>
        </el-table-column>
        <el-table-column
          label="vCPU按需标准价格(元/核/小时)"
          v-if="showRules['VCPUAXFMG'].show||showRules['VCPUAXMG'].show"
        >
          <el-table-column prop="VCPUAXFMG" label="非蒙贵地区" v-if="showRules['VCPUAXFMG'].show"></el-table-column>
          <el-table-column prop="VCPUAXMG" label="蒙贵地区" v-if="showRules['VCPUAXMG'].show"></el-table-column>
        </el-table-column>
        <el-table-column
          label="内存包月标准价格(元/G/月)"
          v-if="showRules['NCBYFMG'].show||showRules['NCBYMG'].show"
        >
          <el-table-column prop="NCBYFMG" label="非蒙贵地区" v-if="showRules['NCBYFMG'].show"></el-table-column>
          <el-table-column prop="NCBYMG" label="蒙贵地区" v-if="showRules['NCBYMG'].show"></el-table-column>
        </el-table-column>
        <el-table-column
          label="内存按需标准价格(元/G/小时)"
          v-if="showRules['NCAXFMG'].show||showRules['NCAXMG'].show"
        >
          <el-table-column prop="NCAXFMG" label="非蒙贵地区" v-if="showRules['NCAXFMG'].show"></el-table-column>
          <el-table-column prop="NCAXMG" label="蒙贵地区" v-if="showRules['NCAXMG'].show"></el-table-column>
        </el-table-column>
        <el-table-column prop="BYFMG" label="非蒙贵地区包月总价" v-if="showRules['BYFMG'].show">
          <template slot-scope="scope">
            <span>{{scope.row.VCPUBYFMG*scope.row.CPU+scope.row.NCBYFMG*scope.row.Memory}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="BYMG" label="蒙贵地区包月总价" v-if="showRules['BYMG'].show">
          <template slot-scope="scope">
            <span>{{scope.row.VCPUBYMG*scope.row.CPU+scope.row.NCBYMG*scope.row.Memory}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AXFMG" label="非蒙贵地区按需总价" v-if="showRules['AXFMG'].show">
          <template slot-scope="scope">
            <span>{{scope.row.VCPUAXFMG*scope.row.CPU+scope.row.NCAXFMG*scope.row.Memory}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AXMG" label="蒙贵地区按需总价" v-if="showRules['AXMG'].show">
          <template slot-scope="scope">
            <span>{{scope.row.VCPUAXMG*scope.row.CPU+scope.row.NCAXMG*scope.row.Memory}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-setting"
              @click="handleUpdate(scope.$index, scope.row)"
              size="mini"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="handleDel(scope.$index, scope.row)"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleIndexChange"
          :current-page.sync="pageIndex"
          :page-sizes="[10,20,50,100]"
          :page-size="pageSize"
          align="right"
          layout="total,sizes,prev,pager,next,jumper"
          :total="dataCount"
        ></el-pagination>
      </div>
    </section>
    <div class="footer"></div>
    <footer>
      <p>Copyright &copy; 2019中国电信股份有限公司云计算分公司版权所有</p>
      <p>V0.1版</p>
    </footer>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Config } from "../core/config";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import qs from "qs";
import "element-ui/lib/theme-chalk/index.css";
import { constants } from "crypto";

Vue.use(ElementUI);

@Component
export default class EnginePrice extends Vue {
  private mainLoading: boolean = false;
  private tableData = [];
  private mainData = [];
  //选择显示
  private showRules = {
    TypeName: {
      text: "类型",
      show: true
    },
    StyleName: {
      text: "规格名称",
      show: true
    },
    Style: {
      text: "规格",
      show: true
    },
    CPUVision: {
      text: "CPU版本",
      show: true
    },
    BandWidth: {
      text: "基准/最大带宽",
      show: true
    },
    PackageSize: {
      text: "内网收发包",
      show: true
    },
    VCPUBYMG: {
      text: "CPU包月蒙贵单价",
      show: true
    },
    VCPUBYFMG: {
      text: "CPU包月非蒙贵单价",
      show: true
    },
    VCPUAXMG: {
      text: "CPU按需蒙贵单价",
      show: false
    },
    VCPUAXFMG: {
      text: "CPU按需非蒙贵单价",
      show: false
    },
    NCBYMG: {
      text: "内存包月蒙贵单价",
      show: true
    },
    NCBYFMG: {
      text: "内存包月非蒙贵单价",
      show: true
    },
    NCAXMG: {
      text: "内存按需蒙贵单价",
      show: false
    },
    NCAXFMG: {
      text: "内存按需非蒙贵单价",
      show: false
    },
    BYFMG: {
      text: "非蒙贵地区包月总价",
      show: true
    },
    BYMG: {
      text: "蒙贵地区包月总价",
      show: true
    },
    AXFMG: {
      text: "非蒙贵地区按需总价",
      show: false
    },
    AXMG: {
      text: "蒙贵地区按需总价",
      show: false
    }
  };

  //分页
  private pageIndex: number = 1;
  private pageSize: number = 10;
  private dataCount: number = 0;
  private handleSizeChange(val: string) {
    let that = this;
    this.pageSize = parseInt(val);
    that.tableData = that.getPageData({
      data: that.mainData,
      pageSize0: "pageSize",
      pageIndex0: "pageIndex"
    });
  }
  private handleIndexChange(val: string) {
    let that = this;
    this.pageIndex = parseInt(val);
    that.tableData = that.getPageData({
      data: that.mainData,
      pageSize0: "pageSize",
      pageIndex0: "pageIndex"
    });
  }
  private getPageData(rule) {
    let { data, pageIndex0, pageSize0 } = rule;
    let pageData = []; //分页数据
    let pageIndex = this[pageIndex0] - 1;
    let pageSize = this[pageSize0];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i + pageIndex * pageSize]) {
        pageData.push(data[i + pageIndex * pageSize]);
        count++;
      } else {
        break;
      }
      if (count > pageSize - 1) {
        break;
      }
    }
    return pageData;
  }
  //表单验证
  private checkNumber(rule, value, callback) {
    if (!value) {
      callback(new Error("输入不能为空"));
    } else {
      if (/^[0-9]+\.[0-9]{1,}$|^(0|\+?[1-9][0-9]*)$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入数字"));
      }
    }
  }

  private fromRules = {
    empty: [{ required: true, message: "输入不能为空", trigger: "blur" }],
    number0: [
      {
        validator: this.checkNumber,
        trigger: "blur"
      }
    ]
  };
  //新增
  private addDialogVisible: boolean = false;
  private addForm = {};
  private handleAdd() {
    this.addDialogVisible = true;
  }
  private addNo(formName: any) {
    this.addDialogVisible = false;
    this.$refs[formName].resetFields();
  }

  private addYes(formName: any) {
    let that = this;

    this.$refs[formName].validate(async valid => {
      if (valid) {
        that.mainData = true;
        that.addForm.Style =
          that.addForm.CPU + "vCPUs|" + that.addForm.Memory + "GB";
        let randomNum = Math.round(Math.random() * 10000);
        let url = `/ProductPricing/Price/AddCloudHostSeries?randomNum=${randomNum}`;
        let res = await Axios.post(url, this.addForm);
        if (res.data.code == 1) {
          this.getMainData();
          this.addDialogVisible = false;
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
        that.mainData = false;
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
  //删除
  private handleDel(index, row) {
    this.$confirm("此操作将永久删除该系列, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {})
      .catch(() => {
        this.$message({
          duration: 2000,
          showClose: true,
          type: "info",
          message: "已取消删除"
        });
      });
  }
  //编辑
  private updateDialogVisible: boolean = false;
  private updateForm = {};
  private handleUpdate(index, row) {
    this.updateDialogVisible = true;
    this.updateForm = JSON.parse(JSON.stringify(row));
  }
  private updateNo(formName: any) {
    this.updateDialogVisible = false;
    this.$refs[formName].resetFields();
  }

  private updateYes(formName: any) {
    let that = this;
    this.$refs[formName].validate(async valid => {
      if (valid) {
        that.mainData = true;

        that.updateForm.Style =
          that.updateForm.CPU + "vCPUs|" + that.updateForm.Memory + "GB";
        let randomNum = Math.round(Math.random() * 10000);
        let url = `/ProductPricing/Price/UpdateCloudHostSeries?randomNum=${randomNum}`;
        let res = await Axios.post(url, this.updateForm);
        if (res.data.code == 1) {
          this.getMainData();
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
        that.mainData = false;
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
  //搜索
  private options = [
    {
      value: "选项1",
      label: "黄金糕"
    },
    {
      value: "选项2",
      label: "双皮奶"
    },
    {
      value: "选项3",
      label: "蚵仔煎"
    },
    {
      value: "选项4",
      label: "龙须面"
    },
    {
      value: "选项5",
      label: "北京烤鸭"
    }
  ];
  private searchName = "";
  private searchType = "";

  private async getMainData() {
    let that = this;
    this.mainLoading = true;
    let url =
      "/ProductPricing/Price/GetCloudHostSeries?typeName=" +
      that.searchType +
      "&styleName=" +
      that.searchName;
    let res = await Axios.get(url);
    if (res.data) {
      this.mainData = JSON.parse(res.data.content);
      this.dataCount = this.mainData.length;
      console.log("res", res);
    }
    that.tableData = that.getPageData({
      data: that.mainData,
      pageSize0: "pageSize",
      pageIndex0: "pageIndex"
    });
    this.mainLoading = false;
  }
  async mounted() {
    await this.getMainData();
  }
}
</script>

<style  lang="scss">
.enginePrice {

  section {
    padding: 20px;
    background-color: #fff;
    .chooseShow {
      width: 60%;
      margin-bottom: 20px;
    }
    .table-top {
      display: flex;
      margin-bottom: 20px;

      .search {
        margin-left: 20px;
        display: flex;
        .searchItem {
          display: flex;
          margin-right: 20px;
          span {
            line-height: 40px;
          }
        }
      }
    }
    .table-footer {
      margin-top: 20px;
    }
  }
  .dialog-footer {
    text-align: center;
  }
  .footer {
    height: 50px;
  }
  footer {
    position: fixed;
    bottom: 0;
    display: flex;
    width: 100%;
    padding: 0 20px;
    left: 0;
    background-color: #fff;
    border-top: 1px solid #d2d6de;
    justify-content: space-between;
    height: 50px;
    p {
      line-height: 50px;
      color: #666666;
    }
  }
}
</style>
