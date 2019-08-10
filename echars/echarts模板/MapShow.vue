<template>
  <div
    v-loading.fullscreen="mainLoading"
    class="mapShow"
    element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <section>
      <div class="section-left">
        <div class="top" id="information">
          <p class="tittle">
            数据中心
            <span>带宽(G)</span>
          </p>
          <div class="info-chars">
            <div id="info1"></div>
            <div id="info2"></div>
            <div id="info3"></div>
            <div id="info4"></div>
          </div>
        </div>
        <div class="bottom">
          <p class="tittle">
            机柜规模
            <span>(个)</span>
          </p>
          <div id="cabint"></div>
        </div>
      </div>
      <div class="section-middle">
        <p class="tittle">
          服务区域
          <span>实时流量(G)</span>
        </p>
        <div class="header">
          <div class="citys">
            <div class="city">
              <div class="number blue0">1047G</div>
              <div class="name blue">四川</div>
            </div>
            <div class="city">
              <div class="number yellow0">1047G</div>
              <div class="name yellow">贵州</div>
            </div>
            <div class="city">
              <div class="number red0">1047G</div>
              <div class="name red">广西</div>
            </div>
          </div>
          <div class="citys" style="marginTop:30px">
            <div class="city">
              <div class="number skyblue0">1047G</div>
              <div class="name skyblue">云南</div>
            </div>
            <div class="city">
              <div class="number green0">1047G</div>
              <div class="name green">广东</div>
            </div>
          </div>
        </div>
        <div id="map" class="map"></div>
        <div class="footer">
          <div class="footer-city">
            <div class="number violet0">1047G</div>
            <div class="name violet">北京</div>
          </div>
          <div class="footer-city">
            <div class="number blue0">1047G</div>
            <div class="name blue">上海</div>
          </div>
          <div class="footer-city">
            <div class="number green0">1047G</div>
            <div class="name green">北京</div>
          </div>
        </div>
      </div>
      <div class="section-right">
        <div class="top">
          <p class="tittle">
            客户统计
            <span>(家)</span>
          </p>
          <div id="customer"></div>
        </div>
        <div class="bottom">
          <p class="tittle" style="marginBottom:30px">
            出口带宽
            <span>(T)</span>
          </p>
          <div id="bandwidth"></div>
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

Vue.use(VCharts);
Vue.use(Echart);
Vue.use(ElementUI);
Vue.use(VueKonva);

@Component
export default class MapShow extends Vue {
  private mainLoading: boolean = false;

  //数据中心
  private informationCharts(id: string, min: number, max: number) {
    var myChart = Echart.init(document.getElementById(id));
    let _data = [
      { ShowValue: "0.6", ShowName: "湘潭", Id: 5 },
      { ShowValue: "0.95", ShowName: "云谷", Id: 4 },
      { ShowValue: "1.22", ShowName: "东片区", Id: 1 },
      { ShowValue: "1.7", ShowName: "西片区", Id: 2 },
      { ShowValue: "1.8", ShowName: "分公司", Id: 6 },
      { ShowValue: "2.6", ShowName: "星沙", Id: 3 }
    ];
    var name = [],
      arr = [],
      pin = 0;
    _data.forEach(function(item, i) {
      name.push(item.ShowName);
      arr.push(item.ShowValue);
      pin += parseInt(item.ShowValue);
    });
    let option = {
      title: {
        textStyle: {
          color: "#fff",
          fontSize: "24"
        }
      },
      series: {
        name: "城市",
        title: {
          textStyle: {
            color: "#fff"
          },
          fontSize: 24,
          offsetCenter: [0, "20%"]
        },
        type: "gauge",
        splitNumber: 1, //刻度数量
        min: min,
        max: max,
        padding: 0,
        center: ["50%", "50%"],
        radius: "80%",
        detail: {
          offsetCenter: [0, "-20%"],
          formatter: "已用{value}%",
          textStyle: {
            fontSize: 14,
            color: "white"
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [
              [((pin / _data.length).toFixed(1) / pin).toFixed(1), "#11a8ab"],
              [1, "rgba(255,255,255,0.3)"]
            ],
            width: 12,
            borderRadius: 30
          }
        },
        axisTick: {
          show: false,
          borderRadius: 30,
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
          length: -5,
          lineStyle: {
            color: "#ddd"
          }
        },
        axisLabel: {
          distance: -20,
          textStyle: {
            color: "#fff",
            fontSize: "14"
          }
        },
        data: [{ value: (pin / _data.length).toFixed(1), name: "wsd" }]
      }
    };

    myChart.setOption(option, true);
  }
  //机柜规模
  private cabinetsCharts(id: string) {
    var myChart = Echart.init(document.getElementById(id));
    let _data = {
      Count: 10,
      List: [
        {
          AllCount: 140,
          SelledCount: 37,
          WaitSellCount: 103,
          ShowName: "西",
          Id: 10
        },
        {
          AllCount: 215,
          SelledCount: 171,
          WaitSellCount: 44,
          ShowName: "机房",
          Id: 11
        },
        {
          AllCount: 0,
          WaitSellCount: 0,
          ShowName: "岳阳",
          SelledCount: 5,
          Id: 12
        },
        {
          AllCount: 60,
          SelledCount: 0,
          WaitSellCount: 60,
          ShowName: "二楼",
          Id: 13
        },
        {
          AllCount: 56,
          SelledCount: 0,
          WaitSellCount: 56,
          ShowName: "益",
          Id: 14
        }
      ]
    };
    var name = [],
      SelledCount = [],
      WaitSellCount = [],
      AllCount = 0,
      WaitSellNum = 0,
      SelledNum = 0;
    _data.List.forEach(function(item, i) {
      name.push(item.ShowName);
      SelledCount.push(item.SelledCount);
      WaitSellCount.push(item.WaitSellCount);
      AllCount += item.AllCount;
      WaitSellNum += item.WaitSellCount;
      SelledNum += item.SelledCount;
    });
    let option = {
      title: {
        text: "机柜规模(个)",
        show: false,
        textStyle: {
          color: "#fff",
          fontSize: "12",
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
        right: "20%",
        top: "10%",
        textStyle: {
          color: "white"
        },
        data: ["未用(个)", "已用(个)"]
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          data: name
        }
      ],
      yAxis: [
        {
          show: false,
          type: "value",
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "white"
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "已用(个)",
          type: "bar",
          stack: "总量",
          barMaxWidth: 50,
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
                  return p.value > 0 ? p.value : "";
                }
              }
            }
          },
          data: SelledCount
        },
        {
          name: "未用(个)",
          type: "bar",
          stack: "总量",
          barMaxWidth: 50,
          itemStyle: {
            normal: {
              color: "rgba(255,255,255,0.3)",
              barBorderRadius: 0,
              label: {
                show: true,
                position: "inside",
                textStyle: {
                  color: "white"
                },
                formatter: function(p) {
                  return p.value > 0 ? p.value : "";
                }
              }
            }
          },
          data: WaitSellCount
        }
      ]
    };

    myChart.setOption(option, true);
  }
  //客户统计(家)
  private costomerCharts(id: string) {
    var myChart = Echart.init(document.getElementById(id));
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
    let option = {
      color: color,
      title: {
        text: "客户统计(家)",
        show: false,
        textStyle: {
          color: "#fff",
          fontSize: "12",
          fontWeight: "normal"
        },
        subtextStyle: {
          color: "#ddd",
          fontSize: "14"
        }
      },
      tooltip: {
        show: false,
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
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
        top: "40%",
        style: {
          text: "客户总数",
          textAlign: "center",
          fill: "#fff",
          fontSize: 14,
          width: 30,
          height: 30
        }
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: ["50%", "70%"],
          title: {
            textStyle: {
              color: "#fff"
            },
            fontSize: 24,
            offsetCenter: [0, "200%"]
          },
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: "center",
              formatter: "{c|{c}家}",
              rich: {
                c: {
                  color: "#fff",
                  fontSize: 24,
                  align: "center",
                  verticalAlign: "middle"
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: "24"
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: ydata
        }
      ]
    };
    myChart.setOption(option, true);
    setTimeout(function() {
      myChart.on("mouseover", function(params) {
        if (params.name == ydata[0].name) {
          myChart.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: 0
          });
        } else {
          myChart.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: 0
          });
        }
      });

      myChart.on("mouseout", function(params) {
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: 0
        });
      });
      myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
    }, 1000);
  }
  //出口带宽(T)
  private bandwidthCharts(id: string, min: number, max: number) {
    var myChart = Echart.init(document.getElementById(id));
    let _data = [
      { ShowValue: "0.6", ShowName: "湘潭", Id: 5 },
      { ShowValue: "0.95", ShowName: "云谷", Id: 4 },
      { ShowValue: "1.22", ShowName: "东片区", Id: 1 },
      { ShowValue: "1.7", ShowName: "西片区", Id: 2 },
      { ShowValue: "1.8", ShowName: "分公司", Id: 6 },
      { ShowValue: "2.6", ShowName: "星沙", Id: 3 }
    ];
    var name = [],
      arr = [],
      pin = 0;
    _data.forEach(function(item, i) {
      name.push(item.ShowName);
      arr.push(item.ShowValue);
      pin += parseInt(item.ShowValue);
    });
    let option = {
      title: {
        text: "带宽使用概况",
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: 16,
          fontWeight: "normal"
        }
      },
      series: {
        title: {
          show: false
        },
        type: "gauge",
        splitNumber: 1, //刻度数量
        min: min,
        max: max,
        padding: 0,
        center: ["50%", "50%"],
        radius: "80%",
        detail: {
          offsetCenter: [0, 0],
          formatter: "已用{value|{value}}%",
          textStyle: {
            fontSize: 14,
            color: "white"
          },
          rich: {
            value: {
              color: "#11a8ab",
              fontSize: 28
            }
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [
              [((pin / _data.length).toFixed(1) / pin).toFixed(1), "#11a8ab"],
              [1, "rgba(255,255,255,0.3)"]
            ],
            width: 14
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
          length: -5,
          lineStyle: {
            color: "#ddd"
          }
        },
        axisLabel: {
          distance: -20,
          textStyle: {
            color: "#fff",
            fontSize: "14"
          }
        },
        data: [{ value: (pin / _data.length).toFixed(1), name: "w4sd" }]
      }
    };

    myChart.setOption(option, true);
  }
  //地图
  private mapCharts(id: string) {
    console.log(id);
    //初始化echarts实例
    var myChart = Echart.init(document.getElementById("map"));
    var geoCoordMap = {
      内蒙古: [110.3467, 41.4899],
      吉林: [125.8154, 44.2584],
      北京: [116.4551, 40.2539],
      辽宁: [123.1238, 42.1216],
      河北: [114.4995, 38.1006],
      天津: [117.4219, 39.4189],
      山西: [112.3352, 37.9413],
      陕西: [109.1162, 34.2004],
      甘肃: [103.5901, 36.3043],
      宁夏: [106.3586, 38.1775],
      青海: [101.4038, 36.8207],
      新疆: [87.9236, 43.5883],
      西藏: [91.11, 29.97],
      四川: [103.9526, 30.7617],
      重庆: [108.384366, 30.439702],
      山东: [117.1582, 36.8701],
      河南: [113.4668, 34.6234],
      江苏: [118.8062, 31.9208],
      安徽: [117.29, 32.0581],
      湖北: [114.3896, 30.6628],
      浙江: [119.5313, 29.8773],
      福建: [119.4543, 25.9222],
      江西: [116.0046, 28.6633],
      湖南: [113.0823, 28.2568],
      贵州: [106.6992, 26.7682],
      云南: [102.9199, 25.4663],
      广东: [113.12244, 23.009505],
      广西: [108.479, 23.1152],
      海南: [110.3893, 19.8516],
      上海: [119.1803, 31.2891],
      台湾: [121.4648, 25.563]
    };
    var defaultP = [
      {
        name: "重庆",
        value: 1
      },
      {
        name: "四川",
        value: 2
      },
      {
        name: "贵州",
        value: 3
      },
      {
        name: "云南",
        value: 4
      },
      {
        name: "广西",
        value: 5
      },
      {
        name: "广东",
        value: 6
      },
      {
        name: "北京",
        value: 7
      },
      {
        name: "上海",
        value: 8
      }
    ];
    let moveLines = [
      {
        fromName: "重庆",
        toName: "北京",
        coords: [[108.384366, 30.439702], [116.4551, 40.2539]]
      },
      {
        fromName: "重庆",
        toName: "四川",
        coords: [[108.384366, 30.439702], [103.9526, 30.7617]]
      },
      {
        fromName: "重庆",
        toName: "贵州",
        coords: [[108.384366, 30.439702], [106.6992, 26.7682]]
      },
      {
        fromName: "重庆",
        toName: "云南",
        coords: [[108.384366, 30.439702], [102.9199, 25.4663]]
      },
      {
        fromName: "重庆",
        toName: "广西",
        coords: [[108.384366, 30.439702], [108.479, 23.1152]]
      },
      {
        fromName: "重庆",
        toName: "广东",
        coords: [[108.384366, 30.439702], [113.12244, 23.009505]]
      },
      {
        fromName: "重庆",
        toName: "上海",
        coords: [[108.384366, 30.439702], [119.1803, 31.2891]]
      }
    ];
    var convertData = function(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      console.log(res, "///");
      return res;
    };

    let option = {
      geo: {
        map: "china",
        top: "30%",
        roam: true,
        label: {
          align: "center",
          verticalAlign: "center",
          normal: {
            show: false,
            color: "white",
            fontSize: 14
          },
          emphasis: {
            color: "white",
            show: false
          }
        },
        zoom: 1.6,
        itemStyle: {
          normal: {
            borderWidth: 1, // 区域边框宽度
            borderColor: "#fff", // 区域边框颜色
            areaColor: "#11A8AB" // 区域颜色
          },
          emphasis: {
            areaColor: "#3889FF"
          }
        },
        regions: [
          {
            name: "重庆市",
            itemStyle: {
              normal: {
                areaColor: "rgba(225, 78, 202, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "贵州省",
            itemStyle: {
              normal: {
                areaColor: "rgba(230, 162, 60, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "广东省",
            itemStyle: {
              normal: {
                areaColor: "blue"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "四川省",
            itemStyle: {
              normal: {
                areaColor: "rgba(29, 140, 248, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "云南省",
            itemStyle: {
              normal: {
                areaColor: "rgba(79, 196, 246, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "北京市",
            itemStyle: {
              normal: {
                areaColor: "rgba(225, 78, 202, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "广西壮族自治区",
            itemStyle: {
              normal: {
                areaColor: "rgba(245, 108, 108, 0.8)"
              }
            },
            label: {
              show: true
            }
          },
          {
            name: "上海市",
            itemStyle: {
              normal: {
                areaColor: "rgba(245, 108, 108, 0.8)"
              }
            },
            label: {
              show: true
            }
          }
        ],
        tooltip: {
          show: false
        }
      },
      series: [
        {
          type: "scatter",
          coordinateSystem: "geo",
          z: 1,
          effectType: "ripple",
          symbolSize: 14,
          itemStyle: {
            color: "#fff",
            borderColor: "#03E2E2",
            borderWidth: 2,
            borderType: "solid"
          },
          tooltip: {
            show: true
          },
          data: convertData(defaultP)
        },
        {
          name: "中心",
          type: "effectScatter",
          coordinateSystem: "geo",
          data: convertData([
            {
              name: "重庆",
              value: 1
            }
          ]),
          symbolSize: 30,
          showEffectOn: "render",
          rippleEffect: {
            brushType: "stroke"
          },
          hoverAnimation: true,
          label: {
            normal: {
              position: ["15%", "40%"],
              formatter: "500",
              show: true,
              color: "#03E2E2"
            }
          },
          itemStyle: {
            normal: {
              color: "#fff",
              shadowBlur: 4,
              shadowColor: "#03E2E2"
            }
          },
          zlevel: 8
        },
        {
          name: "线路",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 2,
          large: true,
          effect: {
            show: true,
            constantSpeed: 50,
            symbol: "pin",
            symbolSize: 10,
            trailLength: 0.5,
            color: "#fff"
          },
          lineStyle: {
            normal: {
              color: new Echart.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "#03E2E2"
                  },
                  {
                    offset: 1,
                    color: "#03E2E2"
                  }
                ],
                false
              ),
              width: 2,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: moveLines
        }
      ]
    };
    myChart.setOption(option);
  }
  mounted() {
    this.informationCharts("info1", 0, 2800);
    this.informationCharts("info2", 0, 2800);
    this.informationCharts("info3", 0, 2800);
    this.informationCharts("info4", 0, 2800);
    this.cabinetsCharts("cabint");
    this.costomerCharts("customer");
    this.bandwidthCharts("bandwidth", 0, 9.2);
    this.mapCharts("map");
  }
}
</script>

<style  lang="scss">
.el-tabs__header {
  margin: 0;
}
p {
  margin: 0;
}
body,
html {
  height: 100%;
  margin: 0;
}
div {
  box-sizing: border-box;
}

.mapShow {
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/images/bg.jpg);
  background-size: cover;
  .tittle {
    color: #fff;
    font-size: 18px;
    span {
      font-size: 14px;
    }
  }
  section {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    #customer {
      margin: auto;
    }
    #bandwidth,
    #cabint,
    #customer {
      height: 90%;
    }
    .section-left {
      width: 27%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-between;
      .top,
      .bottom {
        height: 49%;
        flex-shrink: 0;
        background-color: rgba(10, 78, 180, 0.5);
        box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
      }
      .top {
        padding: 16px;
        .info-chars {
          display: flex;
          flex-wrap: wrap;
          height: 85%;
          div {
            width: 48%;
            height: 48%;
            font-style: 0;
          }
        }
      }
      .bottom {
        padding: 12px;
      }
    }
    .section-middle {
      width: 44%;
      height: 100%;
      background-color: rgba(10, 78, 180, 0.5);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
      padding: 12px;
      box-sizing: border-box;
      border-radius: 4px;
      .blue {
        background-color: rgba(29, 140, 248, 0.8);
      }
      .blue0 {
        background-color: rgba(29, 140, 248, 0.5);
      }
      .skyblue {
        background-color: rgba(79, 196, 246, 0.8);
      }
      .skyblue0 {
        background-color: rgba(79, 196, 246, 0.5);
      }
      .violet {
        background-color: rgba(225, 78, 202, 0.8);
      }
      .violet0 {
        background-color: rgba(225, 78, 202, 0.5);
      }
      .yellow {
        background-color: rgba(230, 162, 60, 0.8);
      }
      .yellow0 {
        background-color: rgba(230, 162, 60, 0.5);
      }
      .red {
        background-color: rgba(245, 108, 108, 0.8);
      }
      .red0 {
        background-color: rgba(245, 108, 108, 0.5);
      }
      .green {
        background-color: rgba(0, 242, 195, 0.8);
      }
      .green0 {
        background-color: rgba(0, 242, 195, 0.5);
      }

      .header {
        margin-top: 50px;
        .citys {
          div {
            display: inline-block;
          }
          text-align: center;
          .city {
            color: #fff;
            width: 90px;
            height: 90px;
            box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.5);
            text-align: center;
            margin-right: 20px;
            box-sizing: border-box;
            overflow: hidden;
            border-radius: 3px;
            .number {
              font-size: 20px;
              height: 55px;
              line-height: 55px;
            }
            .name {
              font-size: 18px;
              height: 35px;
              line-height: 35px;
            }
            div {
              display: block;
            }
          }
        }
      }
      .footer {
        display: flex;
        justify-content: center;
        .footer-city {
          margin-right: 20px;
          display: flex;
          height: 35px;
          width: 140px;
          color: #fff;
          border-radius: 3px;
          overflow: hidden;
          .number {
            font-size: 20px;
            line-height: 35px;
            width: 85px;
          }
          .name {
            font-size: 18px;
            line-height: 35px;
            width: 55px;
          }
        }
      }
      .map {
        height: 65%;
      }
    }
    .section-right {
      width: 27%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      justify-content: space-between;
      .top,
      .bottom {
        padding: 12px;
        height: 49%;
        flex-shrink: 0;
        background-color: rgba(10, 78, 180, 0.5);
        box-shadow: 0 1px 15px rgba(0, 0, 0, 0.5);
        border-radius: 4px;
        box-sizing: border-box;
        div {
          width: 100%;
          height: 90%;
          font-style: 0;
        }
      }
    }
  }
}
</style>
