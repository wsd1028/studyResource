<template>
  <div class="sellDetail">
    <el-dialog :visible.sync="importVisible" width="500px" title="报表导入">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        accept=".xls, .xlsx"
        :limit="1"
      >
        <div style="marginBottom:20px">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success">下载导入模板</el-button>
        </div>

        <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过5000kb</div>
      </el-upload>
      <div class="dialog-footer">
        <el-button style="margin-left: 10px;" type="primary" @click="importYes">确认</el-button>
        <el-button style="margin-left: 10px;" type="success" @click="importNo">取消</el-button>
      </div>
    </el-dialog>
    <header>
      <p>资源明细报表</p>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>报表中心</el-breadcrumb-item>
        <el-breadcrumb-item>资源明细报表</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <el-row :gutter="24" class="charts">
      <el-col :span="12">
        <el-card shadow="never" class="chartItem">
          <div id="chart1"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chartItem">
          <div id="chart2"></div>
        </el-card>
      </el-col>
    </el-row>

    <section>
      <div class="table-header">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleImport"
          style="marginRight:10px"
        >导入</el-button>
        <el-date-picker
          v-model="searchDate"
          type="date"
          placeholder="选择日期"
          style="marginRight:10px"
        ></el-date-picker>
        <el-input
          placeholder="请输入搜索关键字"
          v-model="searchValue"
          class="input-with-select"
          style="width:200px"
          v-on:keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :header-cell-style="{background:'#f5f7fa'}"
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
        <el-table-column prop="date" label="报表名称" align="center"></el-table-column>
        <el-table-column prop="custName" label="报表描述" align="center"></el-table-column>
        <el-table-column prop="targetName" label="导入时间" align="center"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleShow(scope.$index, scope.row)" size="mini">查看</el-button>
            <el-button type="danger" @click="handleDel(scope.$index, scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <div>
          <el-button type="danger" icon="el-icon-minus" @click="handleDelAll">批量删除</el-button>
        </div>
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
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { async } from "q";
import { constants } from "crypto";
import echarts from "echarts";
import { Loading } from "element-ui";
Vue.use(ElementUI);

@Component
export default class SellDetail extends Vue {
  private tableData = [
    {
      id: "1",
      date: "fr"
    },
    {
      id: "2",
      date: "fr"
    }
  ];
  //chart图
  private chart1 = null;
  private chart2 = null;
  private electricityCharts(id) {
    this[id] = echarts.init(document.getElementById(id));
    var dpqData = [1.9, 15, 14, 17, 83, 87];
    var xsData = [13.9, 15.9, 11.1, 18.27, 48.3, 75];
    var xpqData = [12.6, 25.9, 9.0, 62.4, 28.7, 100];
    var ygData = [16, 29, 91.0, 64, 8.7, 77];
    var XData = ["1月", "2月", "3月", "4月", "5月", "6月"];

    let option = {
      title: {
        text: "标题",
        left: 0,
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
          color: "#666666"
        }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "white",
        textStyle: {
          color: "#000"
        },
        formatter: function(value) {
          const a0 = value[0] ? value[0].seriesName : "";
          const a1 = value[1] ? value[1].seriesName : "";
          const c0 = value[0] ? parseFloat(value[0].data) : 0;
          const c1 = value[1] ? parseFloat(value[1].data) : 0;
          let sum = c0 + c1;
          if (c0 && c1) {
            sum = sum.toFixed(2); //保留两位小数
          }
          const b = value[0] ? value[0].name : "";
          var atext = "";
          var btext = "";

          return "";
        }
      },

      grid: {
        left: "10%",
        bottom: "3%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#f2f2f2"
            }
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "blue",
              opacity: 0.05
            }
          },
          boundaryGap: false,
          data: XData
        }
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              type: "solid",
              color: "#f2f2f2"
            }
          }
        }
      ],
      series: [
        {
          id: "y0",
          name: "东片区",
          type: "line",
          smooth: true,
          color: "#93e0e1",
          symbol: "circle",
          areaStyle: {
            color: "#93e0e1"
          },
          data: dpqData
        },
        {
          name: "东片区",
          type: "effectScatter",
          coordinateSystem: "cartesian2d",
          data: dpqData, //2d坐标系
          symbolSize: 10,
          showEffectOn: "emphasis",
          rippleEffect: {
            brushType: "stroke"
          },
          itemStyle: {
            normal: {
              color: "white",
              borderColor: "#93e0e1",
              borderWidth: "2"
            }
          },
          tooltip: {
            trigger: "item",
            backgroundColor: "white",
            textStyle: {
              color: "#000"
            },
            formatter:
              '<span style="font-size:20px;color: #0a080b"><strong>{c0}</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: red">2.85%</span><span class="test1" >&#9650<style>\n' +
              ".test1{color:red }\n" +
              "</style></span></br>" +
              '<span style="color: #0a080b">{b0}</span>'
          },
          zlevel: 1
        },
        {
          id: "y1",
          name: "星沙",
          type: "line",
          smooth: true,
          color: "#d7cbed",
          symbol: "circle",
          areaStyle: {
            color: "#d7cbed"
          },
          data: xsData
        },
        {
          name: "星沙",
          type: "effectScatter",
          coordinateSystem: "cartesian2d",
          data: xsData, //2d坐标系
          symbol: "circle",
          symbolSize: 10,
          showEffectOn: "emphasis",
          rippleEffect: {
            brushType: "stroke"
          },
          itemStyle: {
            normal: {
              color: "white",
              borderColor: "#d7cbed",
              borderWidth: "2"
            }
          },
          zlevel: 1,
          tooltip: {
            trigger: "item",
            backgroundColor: "white",
            textStyle: {
              color: "#000"
            },
            formatter:
              '<span style="font-size:20px;color: #0a080b"><strong>{c0}</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: green">2.85%</span><span class="test1" >&#9660<style>\n' +
              ".test1{color:green }\n" +
              "</style></span></br>" +
              '<span style="color: #0a080b">{b0}</span>'
          }
        },
        {
          id: "y2",
          name: "西片区",
          type: "line",
          smooth: true,
          color: "#a9d5f4",
          symbol: "circle",
          areaStyle: {
            color: "#a9d5f4"
          },
          data: xpqData
        },
        {
          name: "西片区",
          type: "effectScatter",
          coordinateSystem: "cartesian2d",
          data: xpqData, //2d坐标系
          symbol: "circle",
          symbolSize: 10,
          showEffectOn: "emphasis",
          rippleEffect: {
            brushType: "stroke"
          },
          itemStyle: {
            normal: {
              color: "#fff",
              borderColor: "#a9d5f4",
              borderWidth: "2"
            }
          },
          zlevel: 1,
          tooltip: {
            trigger: "item",
            backgroundColor: "white",
            textStyle: {
              color: "#000"
            },
            formatter:
              '<span style="font-size:20px;color: #0a080b"><strong>{c0}</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: green">2.85%</span><span class="test1" >&#9660<style>\n' +
              ".test1{color:green }\n" +
              "</style></span></br>" +
              '<span style="color: #0a080b">{b0}</span>'
          }
        }
      ]
    };
    this[id].setOption(option, false);
  }

  //导入
  private importVisible: boolean = false;
  private fileList = [];
  private handleImport() {
    this.importVisible = true;
  }
  private importYes() {
    this.$refs.upload.submit();
    this.importVisible = false;
  }
  private importNo() {
    this.importVisible = false;
    this.$message({
      duration: 2000,
      showClose: true,
      message: "已取消上传",
      type: "warning"
    });
  }
  private handleRemove(file, fileList) {
    console.log(file, fileList);
  }
  private handlePreview(file) {
    console.log(file);
  }
  //搜索
  private searchDate: string = "";
  private searchValue: string = "";
  private handleSearch() {
    console.log("搜索");
  }
  //表单验证
  private checkNumber(rule, value, callback) {
    console.log("value", value);
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
    custName: [
      {
        validator: this.checkNumber,
        trigger: "blur"
      }
    ]
  };
  //分页
  private pageIndex: number = 1;
  private pageSize: number = 10;
  private dataCount: number = 0;
  private handleSizeChange(val: string) {
    this.pageSize = parseInt(val);
    // this.handleSearch(1);
  }
  private handleIndexChange(val: string) {
    this.pageIndex = parseInt(val);
    // this.handleSearch(1);
  }
  //批量
  private allChoose = [];
  private handleSelectionChange(value) {
    this.allChoose = value;
  }
  private handleDelAll() {
    console.log(this.allChoose);
    if (this.allChoose.length > 0) {
      let portIds = [];
      //   for (let i = 0; i < this.allChoose.length; i++) {
      //     portIds.push(this.allChoose[i].id);
      //   }
      //   this.portIds = portIds.join(",");
      //   this.getCusts();
      //   this.custDialogVisible = true;
      //   this.custLoading = true;
    } else {
      this.$message({
        duration: 2000,
        showClose: true,
        message: "您未选择租用的端口",
        type: "warning"
      });
    }
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
  //查看
  private handleShow(index, row) {
    this.$router.push({path:'/sellDetailShow'});
  }

  async mounted() {
    this.electricityCharts("chart1");
    this.electricityCharts("chart2");
    let that = this;
    window.addEventListener("resize", function() {
      that.chart1.resize();
      that.chart2.resize();
    });
  }
}
</script>

<style lang="scss">
.sellDetail {
  .dialog-footer {
    text-align: center;
    margin-top: 20px;
  }
  .charts {
    margin-bottom: 20px;
    .el-card__body {
      height: 100%;
    }
    .chartItem {
      height: 300px;
    }
    #chart1,
    #chart2 {
      height: 100%;
    }
  }
  section {
    background-color: #fff;
    padding: 20px;
    .table-header {
      margin-bottom: 20px;
    }
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
  }
}
</style>