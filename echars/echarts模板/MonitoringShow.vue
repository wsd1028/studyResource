<template>
  <div class="monitoring">
    <section>
      <div class="section-left">
        <div class="top">
          <div class="safe">
            <p class="title">
              安全场景
              <span>概览</span>
            </p>
            <div class="incident">
              <div class="incidentShow">
                <div class="incidentItem">
                  <div class="count skygreen0">567</div>
                  <div class="text skygreen">事件</div>
                </div>
                <div class="incidentItem">
                  <div class="count red0">31</div>
                  <div class="text red">告警</div>
                </div>
              </div>
              <div class="incidentShow">
                <div class="incidentItem">
                  <div class="count skyblue0">52</div>
                  <div class="text skyblue">已派单</div>
                </div>
                <div class="incidentItem">
                  <div class="count blue0">70</div>
                  <div class="text blue">已封堵</div>
                </div>
              </div>
            </div>
            <div class="invade">
              <div class="invadeShow">
                <div class="invadeItem">
                  <div class="count blue0">1200</div>
                  <div class="text blue">入侵检测</div>
                </div>
                <div class="invadeItem" style="margin:0">
                  <div class="count yellow0">50</div>
                  <div class="text yellow">防病毒</div>
                </div>
              </div>
              <div class="invadeShow" style="paddingLeft:60px;marginTop:30px">
                <div class="invadeItem">
                  <div class="count skyblue0">1047</div>
                  <div class="text skyblue">异常流量</div>
                </div>
                <div class="invadeItem" style="margin:0">
                  <div class="count skygreen0">42</div>
                  <div class="text skygreen">漏洞</div>
                </div>
              </div>
            </div>
          </div>
          <div class="business">
            <p class="title">
              业务场景
              <span>概览</span>
            </p>
            <div class="invade">
              <div class="invadeShow">
                <div class="invadeItem">
                  <div class="count blue0">0</div>
                  <div class="text blue">网管网</div>
                </div>
                <div class="invadeItem" style="margin:0">
                  <div class="count yellow0">0</div>
                  <div class="text yellow">重保场景</div>
                </div>
              </div>
              <div class="invadeShow" style="paddingLeft:60px;marginTop:30px">
                <div class="invadeItem">
                  <div class="count skyblue0">1</div>
                  <div class="text skyblue">重点业务</div>
                </div>
                <div class="invadeItem" style="margin:0">
                  <div class="count skygreen0">0</div>
                  <div class="text skygreen">重要系统</div>
                </div>
              </div>
            </div>
            <div class="incident" style="marginTop:30px">
              <div class="incidentShow">
                <div class="incidentItem">
                  <div class="count skygreen0">1700</div>
                  <div class="text skygreen">事件</div>
                </div>
                <div class="incidentItem">
                  <div class="count red0">0</div>
                  <div class="text red">告警</div>
                </div>
              </div>
              <div class="incidentShow">
                <div class="incidentItem">
                  <div class="count skyblue0">12</div>
                  <div class="text skyblue">已派单</div>
                </div>
                <div class="incidentItem">
                  <div class="count blue0">23</div>
                  <div class="text blue">已封堵</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <p class="title">核心设备性能</p>
          <div class="header">
            <div class="text">
              <p>链路利用率</p>
              <span>
                <i class="cqfont cq-lianjieliu C-green"></i> &lt;50%
              </span>
            </div>
            <div class="text">
              <p>CPU利用率</p>
              <span>
                <i class="cqfont cq-cpu C-red"></i> &lt;30%
              </span>
            </div>
            <div class="text">
              <p>能源效率</p>
              <span>
                <i class="cqfont cq-lingdang C-green"></i> &lt;1.43
              </span>
            </div>
          </div>
          <div class="equipment">
            <div id="equipment0" class="equItem"></div>
            <div id="equipment1" class="equItem"></div>
            <div id="equipment2" class="equItem"></div>
          </div>
        </div>
      </div>
      <div class="section-right">
        <div class="top">
          <p class="title">智能监控</p>
          <div class="header">
            <div class="people">
              <div style="display:flex">
                <div class="invadeItem" style="marginRight:20px;marginLeft:60px">
                  <div class="count skyblue0">50</div>
                  <div class="text skyblue">出入次数</div>
                </div>
                <div class="invadeItem" style="marginRight:0px">
                  <div class="count blue0">300</div>
                  <div class="text blue">出入人员</div>
                </div>
              </div>
              <p class="p-text">人员轨迹</p>
            </div>
            <div class="waring">
              <div class="waring-top">
                <div class="left">
                  <div class="incidentItem" style="marginBottom:0px">
                    <div class="count red0">23</div>
                    <div class="text red">已封堵</div>
                  </div>
                  <div class="incidentItem" style="marginBottom:0px">
                    <div class="count skyblue0">23</div>
                    <div class="text skyblue">已封堵</div>
                  </div>
                </div>
                <div class="invadeItem" style="marginRight:0px;flexShrink:0">
                  <div class="count yellow0">0</div>
                  <div class="text yellow">门禁关闭告警</div>
                </div>
              </div>
              <p class="p-text">智能警告</p>
            </div>
            <div class="machine">
              <div class="machine-charts">
                <div id="temperature"></div>
                <div id="humidity"></div>
              </div>
              <p style="textAlign:center;color:#fff;marginTop:-20px;fontSize:14px">机房平均温湿度</p>
            </div>
          </div>
          <div class="footer">
            <div class="pdu">
              <p class="title">智能PDU(电度计量)</p>
              <span class="icon-span">
                <i class="cqfont cq-lingdang"></i>
                76
              </span>
              <div class="pdu-chart" id="pdu"></div>
            </div>
            <div class="pdu">
              <p class="title">智能机柜门禁(门禁开门次数)</p>
              <span class="icon-span">
                <i class="cqfont cq-lingdang"></i>
                95
              </span>
              <div class="pdu-chart" id="entrance"></div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <div class="cusmtoer">
              <div class="header" style="marginBottom:16px">
                <div class="image lin-orange">
                  <i class="cqfont cq-IP"></i>
                </div>
                <div class="text">
                  <p>金融客户</p>
                  <p style="textAlign:right;marginTop:13px">10家</p>
                </div>
              </div>
              <el-carousel :interval="4000" type="card" height="104px">
                <el-carousel-item>
                  <img src="../../assets/images/money0.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money1.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money2.jpg" alt style="width:100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="cusmtoer">
              <div class="header" style="marginBottom:16px">
                <div class="image lin-blue">
                  <i class="cqfont cq-dianxin-jijia"></i>
                </div>
                <div class="text">
                  <p>互联网客户</p>
                  <p style="textAlign:right;marginTop:13px">30家</p>
                </div>
              </div>
              <el-carousel :interval="4000" type="card" height="104px">
                <el-carousel-item>
                  <img src="../../assets/images/money0.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money1.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money2.jpg" alt style="width:100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="right">
            <div class="cusmtoer">
              <div class="header" style="marginBottom:16px">
                <div class="image lin-violet">
                  <i class="cqfont cq-loufang"></i>
                </div>
                <div class="text">
                  <p>政府客户</p>
                  <p style="textAlign:right;marginTop:13px">20家</p>
                </div>
              </div>
              <el-carousel :interval="4000" type="card" height="104px">
                <el-carousel-item>
                  <img src="../../assets/images/money0.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money1.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money2.jpg" alt style="width:100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="cusmtoer">
              <div class="header">
                <div class="image lin-red">
                  <i class="cqfont cq-suoyoukehu"></i>
                </div>
                <div class="text">
                  <p>企业客户</p>
                  <p style="textAlign:right;marginTop:13px">25家</p>
                </div>
              </div>
              <el-carousel :interval="4000" type="card" height="104px">
                <el-carousel-item>
                  <img src="../../assets/images/money0.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money1.jpg" alt style="width:100%" />
                </el-carousel-item>
                <el-carousel-item>
                  <img src="../../assets/images/money2.jpg" alt style="width:100%" />
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Config } from "../core/config";
import ElementUI from "element-ui";
import Linq from "linq";
import Ajax from "axios";
import S from "../../../node_modules/string";
import VueKonva from "../../../node_modules/vue-konva";
import "element-ui/lib/theme-chalk/index.css";
import VCharts from "../../../node_modules/v-charts";
import Echart from "../../../node_modules/echarts";
import { constants } from "crypto";
import "../../assets/iconfont/iconfont.css";

Vue.use(VCharts);
Vue.use(Echart);
Vue.use(ElementUI);
Vue.use(VueKonva);

@Component
export default class MonitoringShow extends Vue {
  //核心设备
  private equipmentCharts(
    id: string,
    min: number,
    max: number,
    title: string,
    color: string,
    content: string
  ) {
    var myChart = Echart.init(document.getElementById(id));
    let data = [{ use: 50, all: 100, name: "湘潭", Id: 5 }];
    let use = data[0].use;
    let all = data[0].all;
    let name = data[0].name;
    let number = "";
    if (content) {
      number = content;
    } else {
      number = (use / all) * 100 + "%";
    }
    let option = {
      title: {
        text: title,
        left: "center",
        top: "8%",
        textStyle: {
          color: "#fff",
          fontSize: "16"
        }
      },
      series: {
        name: "",
        title: {
          textStyle: {
            color: "#fff"
          },
          fontSize: 24,
          offsetCenter: [0, "10%"]
        },
        type: "gauge",
        splitNumber: 1, //刻度数量
        min: min,
        max: max,
        padding: 0,
        center: ["50%", "50%"],
        radius: "80%",
        detail: {
          offsetCenter: [0, "-25%"],
          formatter: function(value) {
            if (content) {
              return "平均值";
            } else {
              return "使用占比";
            }
          },
          textStyle: {
            fontSize: 14,
            color: "white"
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[use / all, color], [1, "rgba(255,255,255,0.3)"]],
            width: 12
          }
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: "#ddd",
            width: 1
          },
          length: -2,
          splitNumber: 3
        },
        pointer: {
          show: false
        },
        splitLine: {
          show: false,
          length: 12,
          lineStyle: {
            color: "red"
          }
        },
        axisLabel: {
          distance: -20,
          textStyle: {
            color: "#fff",
            fontSize: "14"
          }
        },
        data: [{ value: (use / all) * 100, name: number }]
      }
    };
    myChart.setOption(option, true);
  }
  //平均温度
  private temperatureChaets(id: string) {
    var myChart = Echart.init(document.getElementById(id));
    var data = [40];
    let number = data[0];
    let option = {
      title: {
        text: "温度计",
        show: false
      },
      grid: {
        top: "-15%",
        left: "10%",
        containLabel: true
      },
      yAxis: [
        {
          show: false,
          min: 0,
          max: 50
        },
        {
          show: false,
          data: [],
          min: 0,
          max: 50
        }
      ],
      xAxis: [
        {
          show: false,
          data: []
        },
        {
          show: false,
          data: []
        },
        {
          show: false,
          data: []
        },
        {
          show: false,
          min: -50,
          max: 50
        }
      ],
      series: [
        {
          name: "条",
          type: "bar",
          // 对应上面XAxis的第一个对象配置
          xAxisIndex: 0,
          data: [number],
          barWidth: 15,
          itemStyle: {
            normal: {
              color: "rgba(29, 140, 248, 0.8)",
              barBorderRadius: 15
            }
          },
          label: {
            normal: {
              show: true,
              position: "right",
              right: "50%",
              formatter: function(param: any) {
                return "{a|温度计}" + "\n\n" + "{b|" + param.value + "°C}";
              },
              rich: {
                a: {
                  color: "#fff",
                  fontWeight: "normal"
                },
                b: {
                  color: "#fff",
                  fontSize: "20",
                  fontWeight: "bold"
                }
              }
            }
          },
          z: 20
        },
        {
          name: "白框",
          type: "bar",
          xAxisIndex: 1,
          barGap: "-100%",
          data: [50],
          barWidth: 15,
          itemStyle: {
            normal: {
              color: "rgba(29, 140, 248, 0.5)",
              barBorderRadius: 15
            }
          },
          z: 10
        },
        {
          name: "圆",
          type: "scatter",
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 0,
          symbolSize: 30,
          itemStyle: {
            normal: {
              color: "rgb(29, 140, 248)",
              opacity: 1
            }
          },
          z: 20
        }
      ]
    };
    myChart.setOption(option, true);
  }
  //平均湿度
  private humidityCharts(id: string) {
    var myChart = Echart.init(document.getElementById(id));
    var dataStyle = {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        shadowBlur: 0,
        shadowColor: "#203665"
      }
    };
    let option = {
      series: [
        {
          name: "第三个圆环",
          type: "pie",
          clockWise: true,
          radius: [40, 30],
          itemStyle: dataStyle,
          hoverAnimation: false,
          center: ["50%", "35%"],
          selectedMode: true,
          data: [
            {
              value: 75,
              label: {
                normal: {
                  rich: {
                    a: {
                      color: "#fff",
                      align: "center",
                      fontSize: 20,
                      fontWeight: "bold"
                    },
                    b: {
                      color: "#fff",
                      align: "center",
                      fontSize: 14
                    }
                  },
                  formatter: function(params) {
                    return "{b|湿度}\n\n" + "{a|" + params.value + "%}";
                  },
                  position: "center",
                  show: true,
                  textStyle: {
                    fontSize: "14",
                    fontWeight: "normal",
                    color: "#fff"
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: "rgba(17,168,171,0.8)",
                  shadowColor: "#613fd1",
                  shadowBlur: 0
                }
              }
            },
            {
              value: 25,
              name: "invisible",
              itemStyle: {
                normal: {
                  color: "rgba(255,255,255,0.3)"
                }
              }
            }
          ]
        }
      ]
    };
    myChart.setOption(option, true);
  }
  //智能
  private noopscheCharts(id: string,lineColor:string,topColor:string,bottomColor:string,) {
    var myChart = Echart.init(document.getElementById(id));
    let option = {
      tooltip: {},
      grid: {
        top: "8%",
        left: "1%",
        bottom: "8%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["14", "15", "16", "17", "18", "19"],
          axisLabel: {
            margin: 10,
            color: "#fff",
            fontSize: 14
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: true,
            length: 0,
            lineStyle: {
              color: "#ffffff1f"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ffffff1f"
            }
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          splitNumber: 7,
          splitLine: {
            show: false,
            lineStyle: {
              color: "red"
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            margin: 20,
            textStyle: {
              color: "#fff",
              fontSize: 14
            }
          },
          axisTick: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "异常流量",
          type: "line",
          smooth: true, //是否平滑曲线显示
          symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: lineColor,
              label: {
                show: false,
                position: "top",
                textStyle: {
                  fontSize: "8"
                }
              }
            }
          },
          lineStyle: {
            normal: {
              color: lineColor // 线条颜色
            }
          },
          areaStyle: {
            //区域填充样式
            normal: {
              //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new Echart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: topColor
                  },
                  {
                    offset: 1,
                    color: bottomColor
                  }
                ],
                false
              )
            }
          },
          data: [90, 105, 84, 15, 110, 92]
        }
      ]
    };

    myChart.setOption(option, true);
  }
  mounted() {
    this.equipmentCharts(
      "equipment0",
      0,
      100,
      "链路",
      "rgba(0, 242, 195, 0.8)",
      ""
    );
    this.equipmentCharts(
      "equipment1",
      0,
      100,
      "CPU",
      "rgba(230, 76, 101, 0.8)",
      ""
    );
    this.equipmentCharts(
      "equipment2",
      0,
      100,
      "PUE",
      "rgba(0, 242, 195, 0.8)",
      "1.43"
    );
    this.temperatureChaets("temperature");
    this.humidityCharts("humidity");
    this.noopscheCharts("pdu","#12A87F","rgba(18,168,127,0.5)","rgba(18,168,127,0)");
    this.noopscheCharts("entrance","#FD5D93","rgba(253,93,147,0.5)","rgba(253,93,147,0)");
  }
}
</script>

<style lang="scss">
* {
  font-family: "\5FAE\8F6F\96C5\9ED1", "\5B8B\4F53", "\9ED1\4F53";
}
.monitoring {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/bg.jpg);
  background-size: cover;
  .title {
    font-size: 18px;
    color: #fff;
    margin-bottom: 20px;
    span {
      font-size: 14px;
    }
  }
  section {
    display: flex;
    height: 100%;
    justify-content: space-between;
    .C-green {
      color: rgba(0, 242, 195, 0.8);
    }
    .C-red {
      color: rgba(230, 76, 101, 0.8);
    }
    .yellow {
      background-color: rgba(230, 162, 60, 0.8);
    }
    .yellow0 {
      background-color: rgba(230, 162, 60, 0.5);
    }
    .skygreen {
      background-color: rgba(0, 242, 195, 0.8);
    }
    .skygreen0 {
      background-color: rgba(0, 242, 195, 0.5);
    }
    .red {
      background-color: rgba(230, 76, 101, 0.8);
    }
    .red0 {
      background-color: rgba(230, 76, 101, 0.5);
    }
    .skyblue {
      background-color: rgba(79, 196, 246, 0.8);
    }
    .skyblue0 {
      background-color: rgba(79, 196, 246, 0.5);
    }
    .blue {
      background-color: rgba(29, 140, 248, 0.8);
    }
    .blue0 {
      background-color: rgba(29, 140, 248, 0.5);
    }
    .incidentItem {
      width: 46.5%;
      box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
      display: flex;
      color: #fff;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 36px;
      .count {
        text-align: center;
        line-height: 36px;
        font-weight: bold;
        font-size: 20px;
        width: 60%;
      }
      .text {
        text-align: center;
        line-height: 36px;
        font-size: 14px;
        width: 40%;
      }
    }
    .invadeItem {
      color: #fff;
      margin-right: 40px;
      width: 90px;
      height: 90px;
      border-radius: 3px;
      overflow: hidden;
      text-align: center;
            box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
      .count {
        font-weight: bold;
        font-size: 20px;
        height: 55px;
        line-height: 55px;
      }
      .text {
        font-size: 14px;
        height: 35px;
        line-height: 35px;
      }
    }
    .section-left {
      width: 49.5%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        width: 100%;
        height: 49%;
        display: flex;
        justify-content: space-between;

        .safe,
        .business {
          background-color: rgba(10, 78, 180, 0.5);
          box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          width: 49%;
          height: 100%;
          padding: 20px 14px;
        }
        .incident {
          .incidentShow {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
          }
        }
        .invade {
          box-sizing: border-box;
          padding-left: 15%;
          .invadeShow {
            display: flex;
            box-sizing: border-box;
          }
        }
      }
      .bottom {
        width: 100%;
        height: 49%;
        padding: 12px;
        background-color: rgba(10, 78, 180, 0.5);
        box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        .header {
          display: flex;

          .text {
            color: #fff;
            margin-left: 50px;
            margin-right: 80px;
            p {
              font-size: 14px;
            }
            span {
              font-size: 18px;
              i {
                font-size: 22px;
              }
            }
          }
        }
        .equipment {
          height: 85%;
          display: flex;
          justify-content: center;
          .equItem {
            width: 33%;
            height: 100%;
          }
        }
      }
    }
    .section-right {
      width: 49.5%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .top {
        width: 100%;
        height: 49%;
        background-color: rgba(10, 78, 180, 0.5);
        box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        padding: 12px;
        .p-text {
          color: #fff;
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
        }
        .header {
          display: flex;
          .people {
            margin-right: 50px;
          }
          .waring {
            width: 30%;
            .waring-top {
              display: flex;
              width: 100%;
              justify-content: space-between;
              .left {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-right: 20px;
                width: 70%;
                > div {
                  width: 100%;
                }
              }
            }
          }
          .machine {
            .machine-charts {
              height: 100%;
              display: flex;
              #temperature,
              #humidity {
                height: 100%;
                width: 150px;
                overflow: hidden;
                > div {
                  height: 90px !important;
                }
              }
            }
          }
        }
        .footer {
          padding: 0 18px;
          margin-top: 25px;
          display: flex;
          justify-content: space-between;
          height:50%;
          .title {
            font-size: 14px;
            margin-bottom: 12px;
            text-align: center;
          }
          .icon-span {
            color: #fff;
            display: block;
            font-size: 18px;
            margin-bottom: 10px;
            i {
              font-size: 20px;
              color: #f56c6c;
            }
          }
          .pdu {
            width: 60%;
            height: 90%;
            .pdu-chart {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .bottom {
        width: 100%;
        height: 49%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .lin-orange {
          background: linear-gradient(40deg, #ff6491, #ff8d72);
        }
        .lin-violet {
          background: linear-gradient(40deg, #ba54f5, #e14eca);
        }
        .lin-blue {
          background: linear-gradient(40deg, #3358f4, #1d8cf8);
        }
        .lin-red {
          background: linear-gradient(40deg, #ec250d, #fd5d93);
        }
        .cusmtoer {
          background-color: rgba(10, 78, 180, 0.5);
          box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          flex-shrink: 0;
          padding: 20px 14px;
          width: 100%;
          height: 48%;
        }
        .el-carousel__arrow {
          background-color: rgba(0, 0, 0, 0.5);
          display: block !important;
        }
        .el-carousel__indicators,
        .el-carousel__indicators,
        ul {
          display: none !important;
        }
        img {
          height: 100%;
        }
        .header {
          display: flex;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 0.5px solid rgba(255, 255, 255, 0.3);
          .image {
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 50px;

            i {
              font-size: 25px;
            }
          }
          .text {
            color: #fff;
            font-size: 14px;
          }
        }
        .left,
        .right {
          display: flex;
          width: 49%;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
        }
      }
    }
  }
}
</style>
