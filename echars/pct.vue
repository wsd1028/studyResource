
<template>
  <div
    class="pct"
    v-loading.fullscreen="mainLoading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="加载中"
    element-loading-spinner="el-icon-loading"
  >
    <el-row :gutter="20" class="top">
      <el-col :span="12" class="nodeUser">
        <div class="item">
          <span class="title">节点用户变化趋势</span>
          <el-tabs v-model="activeNodeName" @tab-click="handleNodeClick">
            <el-tab-pane label="龙洲湾" name="first"></el-tab-pane>
            <el-tab-pane label="水土" name="second"></el-tab-pane>
            <el-tab-pane label="陈家坪" name="third"></el-tab-pane>
            <el-tab-pane label="西永" name="fourth"></el-tab-pane>
          </el-tabs>
          <div id="nodeUserChart"></div>
        </div>
      </el-col>
      <el-col :span="12" class="roomUser">
        <div class="item">
          <span class="title">机房用户变化趋势</span>
          <el-tabs v-model="activeRoomName" @tab-click="handleRoomClick">
            <el-tab-pane label="龙洲湾" name="first"></el-tab-pane>
            <el-tab-pane label="水土" name="second"></el-tab-pane>
            <el-tab-pane label="陈家坪" name="third"></el-tab-pane>
            <el-tab-pane label="西永" name="fourth"></el-tab-pane>
          </el-tabs>
          <div id="roomUserChart"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="bottom">
      <el-col :span="8" class="nodeCust">
        <div class="item">
          <div id="nodeCust"></div>
          <el-select v-model="nodeCustSel" placeholder="请选择" size="mini" class="mySelect">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="16" class="custFlux">
        <div class="item">
          <div id="custFlux"></div>
          <el-select v-model="custFluxSel" placeholder="请选择" size="mini" class="mySelect">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import echarts from "../../../node_modules/echarts";
import moment from "../../assets/moment.js";

@Component({
  components: {}
})
export default class Pct extends Vue {
  private mainLoading: boolean = false;
  private nodeCustSel: string = "1";
  private custFluxSel: string = "1";
  private options = [
    {
      value: "1",
      label: "按节点统计"
    },
    {
      value: "2",
      label: "按机房统计"
    }
  ];
  //左上，右上
  private drawLine(data) {
    let { id, color } = data;
    let topcolor = color.replace(/rbg/, "rbga");
    topcolor = topcolor.replace(/\)/, ",.5)");
    let bottomcolor = color.replace(/rbg/, "rbga");
    bottomcolor = bottomcolor.replace(/\)/, ",0)");
    this[id] = echarts.init(document.getElementById(id));
    var lcData = [1.9, 15, 14, 17, 83, 87];
    var XData = ["1月", "2月", "3月", "4月", "5月", "6月"];
    let option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "white",
        textStyle: {
          color: "#000"
        },
        formatter: function(value) {}
      },
      legend: {
        data: ["cpu", "内存"],
        icon: "roundRect",
        righr: "center",
        top: "10%",
        itemGap: 40
      },
      grid: {
        left: "3%",
        right: "3%",
        bottom: "5%",
        top:"8%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#F9F9F9"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "solid",
              color: "#fff"
            }
          },
          axisLabel: {
            color: "#fff",
            marginTop: "10px",
            textStyle: {
              fontSize: 12
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
              color: "#f9f9f9",
              opacity: 0.5
            }
          },
          axisLabel: {
            color: "#fff",
            marginRight: "10px",
            textStyle: {
              fontSize: 12
            }
          },
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#F9F9F9"
            }
          }
        }
      ],
      series: [
        {
          name: "流出",
          type: "line",
          smooth: true,
          color: color,
          symbol: "none",
          areaStyle: {
            opacity: 0.3,
            color: {
              type: "linear",
              x: 1,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: topcolor //0% 处的颜色
                },
                {
                  offset: 1,
                  color: bottomcolor // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            }
          },
          data: lcData
        }
      ]
    };
    this[id].setOption(option, true);
  }
  //左下
  private drawNodeCust(data) {
    let that = this;
    let { id, color } = data;
    this[id] = echarts.init(document.getElementById(id));
    let color = [
      "rgba(79,196,246,0.8)",
      "rgba(230,162,60,0.8)",
      "rgba(230,76,101,0.8)",
      "rgba(17,168,171,0.8)"
    ];
    let xdata = ["水土", "龙洲湾", "西永", "陈家坪"];
    let ydata = [
      {
        value: 335,
        name: "水土"
      },
      {
        value: 310,
        name: "龙洲湾"
      },
      {
        value: 234,
        name: "西永"
      },
      {
        value: 135,
        name: "陈家坪"
      }
    ];
    let sum = 0;
    for (let i = 0; i < ydata.length; i++) {
      sum += ydata[i].value;
    }
    let option = {
      color: color,
      title: {
        text: "节点用户情况",
        show: true,
        textStyle: {
          color: "#fff",
          fontSize: "18",
          fontWeight: "normal"
        },
        subtextStyle: {
          color: "#ddd",
          fontSize: "14"
        }
      },
      legend: {
        bottom: "0",
        textStyle: {
          color: "white",
          textAlign: "center",
          fontSize: "14"
        },
        data: xdata
      },
      graphic: {
        type: "text",
        left: "center",
        top: "45%",
        style: {
          text: "用户数\n\n" + sum,
          textAlign: "center",
          fill: "#fff",
          fontSize: 14,
          width: 30,
          height: 30
        }
      },
      series: [
        {
          type: "pie",
          radius: ["40%", "55%"],
          center: ["50%", "50%"],
          title: {
            textStyle: {
              color: "#fff"
            },
            fontSize: 14,
            offsetCenter: [0, "200%"]
          },
          avoidLabelOverlap: false,
          labelLine: {
            normal: {
              show: true,
              length: 35,
              length2: 80,
              lineStyle: {
                color: "#d3d3d3"
              },
              align: "right"
            },
            color: "#000"
          },
          label: {
            normal: {
              formatter: function(params) {
                return (
                  params.name +
                  "\n" +
                  params.value +
                  "家," +
                  "(" +
                  params.percent +
                  "%)"
                );
              },
              color: "#fff",
              align: "left",
              padding: [20, -70],
              height: 60,
              rich: {
                c: {
                  color: "#fff",
                  fontSize: 24
                }
              }
            }
          },

          data: ydata
        }
      ]
    };
    that[id].setOption(option, true);
    setTimeout(function() {
      that[id].on("mouseover", function(params) {
        if (params.name == ydata[0].name) {
          that[id].dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0
          });
        } else {
          that[id].dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: 0
          });
        }
      });
      that[id].on("mouseout", function(params) {
        that[id].dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        });
      });
      that[id].dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
    }, 1000);
  }
  //右下
  private drawCustFlux(data) {
    let { id } = data;
    this[id] = echarts.init(document.getElementById(id));
    let _data = {
      Count: 10,
      List: [
        {
          SelledCount: 37,
          WaitSellCount: 103,
          ShowName: "西",
          Id: 10
        },
        {
          SelledCount: 171,
          WaitSellCount: 44,
          ShowName: "机房",
          Id: 11
        },
        {
          WaitSellCount: 0,
          ShowName: "岳阳",
          SelledCount: 5,
          Id: 12
        },
        {
          SelledCount: 0,
          WaitSellCount: 60,
          ShowName: "二楼",
          Id: 13
        },
        {
          SelledCount: 0,
          WaitSellCount: 56,
          ShowName: "益",
          Id: 14
        }
      ]
    };
    var name = [],
      SelledCount = [],
      WaitSellCount = [];
    _data.List.forEach(function(item, i) {
      name.push(item.ShowName);
      SelledCount.push(item.SelledCount);
      WaitSellCount.push(item.WaitSellCount);
    });
    let option = {
      title: {
        text: "用户计费流量大小占比",
        show: true,
        textStyle: {
          color: "#fff",
          fontSize: "18",
          fontWeight: "normal"
        },
        subtextStyle: {
          color: "#ddd",
          fontSize: "14"
        }
      },
      grid: {
        top: "20%",
        left: 0,
        right: 0,
        bottom: "0",
        containLabel: true
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
          textStyle: {
            color: "#fff"
          }
        }
      },
      legend: {
        x: "center",
        top: "10%",
        textStyle: {
          color: "white"
        },
        data: ["流入流量", "流出流量"]
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#F9F9F9"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: "solid",
              color: "#fff"
            }
          },
          axisLabel: {
            color: "#fff",
            marginTop: "10px",
            textStyle: {
              fontSize: 12
            }
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          splitArea: {
            show: false
          },
          data: name
        }
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f9f9f9",
              opacity: 0.5
            }
          },
          axisLabel: {
            color: "#fff",
            marginRight: "10px",
            textStyle: {
              fontSize: 12
            }
          },
          axisLine: {
            //坐标轴轴线相关设置。数学上的x轴
            show: true,
            lineStyle: {
              color: "#F9F9F9"
            }
          }
        }
      ],
      series: [
        {
          name: "流出流量",
          type: "bar",
          stack: "总量",
          itemStyle: {
            normal: {
              color: "#11a8ab",
              barBorderRadius: 0,
              label: {
                show: true,
                position: "inside",
                textStyle: {
                  color: "white"
                },
                formatter: function(p) {
                  return p.value > 0 ? p.value + "G" : "";
                }
              }
            }
          },
          data: SelledCount
        },
        {
          name: "流入流量",
          type: "bar",
          stack: "总量",
          itemStyle: {
            normal: {
              color: "#2196F3",
              barBorderRadius: 0,
              label: {
                show: true,
                position: "inside",
                textStyle: {
                  color: "white"
                },
                formatter: function(p) {
                  return p.value > 0 ? p.value + "G" : "";
                }
              }
            }
          },
          data: WaitSellCount
        }
      ]
    };

    this[id].setOption(option, true);
  }

  private activeNodeName: string = "水土";
  private nodeUserChart = null;
  private roomUserChart = null;
  private nodeCust = null;
  private custFlux = null;

  private handleNodeClick() {}
  private activeRoomName: string = "龙洲湾";
  private handleRoomClick() {}
  async mounted() {
    let that = this;
    that.drawLine({ id: "nodeUserChart", color: "rgb(18,168,127)" });
    that.drawLine({ id: "roomUserChart", color: "rgb(253,53,147)" });
    that.drawNodeCust({ id: "nodeCust" });
    that.drawCustFlux({ id: "custFlux" });
    window.addEventListener("resize", function() {
      that.roomUserChart.resize();
      that.nodeUserChart.resize();
      that.nodeCust.resize();
      that.custFlux.resize();
    });
  }
}
</script>
<style lang='scss'>
.pct {
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: url(../../assets/images/new_bj.jpg);
  background-size: cover;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;

  .top {
    flex-shrink: 0;
    height: 49%;
    .nodeUser,
    .roomUser {
      height: 100%;
      .item {
        height: 100%;
        background: rgba(10, 78, 180, 0.7) !important;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        position: relative;
        .title {
          color: #fff;
          position: absolute;
          right: 15px;
          top: 15px;
          font-size: 14px;
        }
        .el-tabs__item {
          color: #fff;
          font-size: 18px;
          height: auto;
          padding: 5px 20px;
        }
        .el-tabs__item.is-active {
          color: #12a87f;
        }
        .el-tabs__active-bar {
          background-color: #12a87f;
        }
        .el-tabs__nav-wrap::after {
          background-color: #2196f3;
        }
        .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
          padding-left: 20px;
        }
      }
      #nodeUserChart,
      #roomUserChart {
        width: 100%;
        height: 90%;
      }
    }
    .nodeUser {
    }
    .roomUser {
    }
  }
  .bottom {
    height: 49%;
    flex-shrink: 0;
    #nodeCust,
    #custFlux {
      height: 100%;
      width: 100%;
    }
    .nodeCust,
    .custFlux {
      height: 100%;
      .item {
        height: 100%;
        padding: 20px;
        background: rgba(10, 78, 180, 0.7) !important;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        position: relative;
        .mySelect {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 120px;
          height: 28px;
          .el-input__inner {
            background: #409eff;
            border-color: #409eff;
            color: #fff;
            font-size: 14px;
          }
          i {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>