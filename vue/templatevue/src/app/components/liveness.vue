<template>
  <div
    class="liveness"
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <header>
      <p>活跃度报表</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活跃度报表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <div>
        <el-date-picker
          style="margin:20px 0"
          @change="changeTime"
          v-model="timeArea"
          type="month"
          align="right"
          placeholder="选择月"
        ></el-date-picker>
        <el-button type="primary" style="margin:0 20px" @click="handleExport">导出</el-button>
      </div>

      <el-table
        :header-cell-style="{background:'#f5f7fa'}"
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        border
      >
        <el-table-column prop="Class" label="类别"></el-table-column>
        <el-table-column prop="InComeMonth" label="分公司"></el-table-column>
        <el-table-column prop="InComeYear" label="活跃度"></el-table-column>
      </el-table>
    </section>
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
import moment from "../../assets/moment.js";
Vue.use(ElementUI);

@Component
export default class Liveness extends Vue {
  private mainLoading: boolean = false;
  private tableData = [];
  private timeArea = [];
  //导出
  private async handleExport() {
    this.mainLoading = true;
    let startDate = "",
      endDate = "";
    if (this.timeArea.length == 2) {
      startDate = this.timeArea[0];
      endDate = this.timeArea[1];
    } else {
      startDate = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      endDate = moment().format("YYYY-MM-DD");
    }
    let url =
      "/Report/ReportResource/DataExportExcel?startDate=" +
      startDate +
      "&endDate=" +
      endDate;
    window.open(url, "_self");
    this.mainLoading = false;
  }

  private async changeTime(value) {
    await this.getMainData();
  }
  //可选日期
  private yesData = [];
  private async getYesData() {
    this.mainLoading = true;
    let url = "/Report/ReportResource/GetDateCanChoice";
    let res = await Axios.get(url);
    this.yesData = res.data;

    this.mainLoading = false;
  }
  private async getMainData() {
    this.mainLoading = true;
    let startDate = "",
      endDate = "";
    if (this.timeArea.length == 2) {
      startDate = this.timeArea[0];
      endDate = this.timeArea[1];
    } else {
      startDate = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      endDate = moment().format("YYYY-MM-DD");
    }
    let url =
      "/Report/ReportResource/GetData?startDate=" +
      startDate +
      "&endDate=" +
      endDate;
    let res = await Axios.get(url);
    if (res.data) {
      this.tableData = res.data;
    }
    this.mainLoading = false;
  }
  async mounted() {
    // await this.getMainData();
    // await this.getYesData();
  }
}
</script>

<style  lang="scss">
.liveness {
  .chooseShow {
    width: 60%;
    margin-bottom: 20px;
  }
  section {
    padding: 20px;
    background-color: #fff;
  }
}
</style>
