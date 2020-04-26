<template>
  <div
    class="callDetailShow"
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <header>
      <p>话单报表</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>报表中心</el-breadcrumb-item>
        <el-breadcrumb-item>话单报表</el-breadcrumb-item>
        <el-breadcrumb-item>查看</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="searchValue" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
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

      <el-table
        :header-cell-style="{background:'#f5f7fa'}"
        :data="mainData"
        height="700"
        style="width: 100%;margin-bottom: 20px;"
        border
      >
        <el-table-column prop="Class" label="CRM客户名称" v-if="showRules['Class'].show"></el-table-column>
        <el-table-column prop="Name" label="客户邮箱" v-if="showRules['Name'].show"></el-table-column>
        <el-table-column prop="ArrivalValue" v-if="showRules['ArrivalValue'].show" label="BIZID"></el-table-column>
        <el-table-column prop="Increment" v-if="showRules['Increment'].show" label="省份"></el-table-column>
        <el-table-column prop="IncrementUp" v-if="showRules['IncrementUp'].show" label="服务类型"></el-table-column>
        <el-table-column prop="IncrementDown" v-if="showRules['IncrementDown'].show" label="出账金额"></el-table-column>
        <el-table-column prop="IncrementYear" v-if="showRules['IncrementYear'].show" label="账期"></el-table-column>
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
export default class CallDetailShow extends Vue {
  private mainLoading: boolean = false;
  private mainData = [
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    },
    {
      Name: "rfr"
    }
  ];
  //搜索
  private searchValue: string = "";
  //选择显示
  private showRules = {
    Class: {
      text: "CRM客户名称",
      show: true
    },
    Name: {
      text: "客户邮箱",
      show: true
    },
    ArrivalValue: {
      text: "BIZID",
      show: true
    },
    Increment: {
      text: "省份",
      show: true
    },
    IncrementUp: {
      text: "服务类型",
      show: true
    },
    IncrementDown: {
      text: "出账金额",
      show: false
    },
    IncrementYear: {
      text: "账期",
      show: false
    },
    TargetValueYear: {
      text: "全年任务",
      show: false
    },
    FinshPervent: {
      text: "完成率",
      show: false
    },
    ActivLow: {
      text: "低活跃",
      show: false
    },
    IncrementYearDiffActivLow: {
      text: "账期(扣除低活跃)",
      show: false
    },
    InComeMonth: {
      text: "月收入",
      show: false
    },
    InComeYear: {
      text: "全年收入",
      show: false
    }
  };

  //可选日期
  private yesData = [];

  private async getMainData() {
    let that = this;
    this.mainLoading = true;
    let startDate = "",
      endDate = "";

    let url =
      "/Report/ReportResource/GetData?startDate=" +
      startDate +
      "&endDate=" +
      endDate;
    let res = await Axios.get(url);
    if (res.data) {
      this.mainData = res.data;
    }
    this.mainLoading = false;
  }
  async mounted() {
    // await this.getMainData();
  }
}
</script>

<style  lang="scss">
.callDetailShow {
  section {
    background-color: #fff;
    padding: 0 20px;
    .search {
      padding: 20px 0;
      width: 250px;
    }
    .chooseShow {
      width: 60%;
      margin-bottom: 20px;
    }
    .table-footer {
      margin-top: 20px;
    }
  }
}
</style>
