<template>
  <div
    class="business"
    v-loading="mainLoading"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
  <header>
      <p>云业务量收发报表</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>云业务量收发报表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <section>
      <div>
        <el-date-picker
          style="margin:20px 0"
          @change="changeTime"
          v-model="timeArea"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-button type="primary" style="margin:0 20px" @click="handleExport">导出</el-button>
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
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        border
      >
        <el-table-column prop="Class" label="类别" v-if="showRules['Class'].show"></el-table-column>
        <el-table-column prop="Name" label="公司名称" v-if="showRules['Name'].show"></el-table-column>
        <el-table-column prop="ArrivalValue" v-if="showRules['ArrivalValue'].show" label="到达值">
          <template slot-scope="scope">
            <span>{{scope.row.ArrivalValue.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Increment" v-if="showRules['Increment'].show" label="净增量">
          <template slot-scope="scope">
            <span>{{scope.row.Increment.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="IncrementUp" v-if="showRules['IncrementUp'].show" label="增加量">
          <template slot-scope="scope">
            <span>{{scope.row.IncrementUp.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="IncrementDown" v-if="showRules['IncrementDown'].show" label="减少量">
          <template slot-scope="scope">
            <span>{{scope.row.IncrementDown.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="IncrementYear" v-if="showRules['IncrementYear'].show" label="净增量全年">
          <template slot-scope="scope">
            <span>{{scope.row.IncrementYear.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="TargetValueYear"
          v-if="showRules['TargetValueYear'].show"
          label="全年任务"
        ></el-table-column>
        <el-table-column prop="FinshPervent" v-if="showRules['FinshPervent'].show" label="完成率">
          <template slot-scope="scope">
            <span>{{(scope.row.FinshPervent*100).toFixed(2)}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="ActivLow" v-if="showRules['ActivLow'].show" label="低活跃"></el-table-column>
        <el-table-column
          prop="IncrementYearDiffActivLow"
          v-if="showRules['IncrementYearDiffActivLow'].show"
          label="净增量全年(扣除低活跃)"
        >
          <template slot-scope="scope">
            <span>{{scope.row.IncrementYearDiffActivLow.toFixed(2)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="InComeMonth" v-if="showRules['InComeMonth'].show" label="月收入"></el-table-column>
        <el-table-column prop="InComeYear" v-if="showRules['InComeYear'].show" label="全年收入"></el-table-column>
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
export default class Business extends Vue {
  private mainLoading: boolean = false;
  private tableData = [];
  private mainData = [];
  private timeArea = [];
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
  //选择显示
  private showRules = {
    Class: {
      text: "类别",
      show: true
    },
    Name: {
      text: "公司名称",
      show: true
    },
    ArrivalValue: {
      text: "到达值",
      show: true
    },
    Increment: {
      text: "净增量",
      show: true
    },
    IncrementUp: {
      text: "增加量",
      show: true
    },
    IncrementDown: {
      text: "减少量",
      show: false
    },
    IncrementYear: {
      text: "净增量全年",
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
      text: "净增量全年(扣除低活跃)",
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

  private async changeTime(value) {
    await this.getMainData();
  }
  private pickerOptions = {};
  //可选日期
  private yesData = [];
  private async getYesData() {
    this.mainLoading = true;
    let url = "/Report/ReportResource/GetDateCanChoice";
    let res = await Axios.get(url);
    this.yesData = res.data;
    this.pickerOptions = {
      shortcuts: [
        {
          text: "最近一周",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "最近一个月",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit("pick", [start, end]);
          }
        },
        {
          text: "最近一年",
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit("pick", [start, end]);
          }
        }
      ],
      disabledDate: time => {
        let bool = true;
        time = moment(time).format("YYYY-MM-DD");
        for (let i = 0; i < this.yesData.length; i++) {
          if (this.yesData[i] == time) {
            bool = false;
          }
        }
        return bool;
      }
    };
    this.mainLoading = false;
  }
  private async getMainData() {
    let that=this;
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
      this.mainData = res.data;
      this.dataCount=this.mainData.length;
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
    await this.getYesData();
  }
}
</script>

<style  lang="scss">
.business {
  section {
    background-color: #fff;
    padding: 0 20px;
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
