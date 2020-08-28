import echarts from 'echarts'

let data = {
  x: ['翠屏', '南溪', '叙州', '江安', '长宁', '高县', '珙县', '筠连', '兴文', '屏山']
}

var option = {
  backgroundColor: '#091C3D',
  tooltip: {
    //提示框组件
    trigger: 'axis',
    formatter: '{b}<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%',
    axisPointer: {
      type: 'shadow',
      label: {
        backgroundColor: '#6a7985'
      }
    },
    textStyle: {
      color: '#fff',
      fontStyle: 'normal',
      fontFamily: '微软雅黑',
      fontSize: 12
    }
  },
  legend: {
    //图例组件，颜色和名字
    right: '2%',
    top: '2%',
    itemGap: 16,
    itemWidth: 18,
    itemHeight: 6,
    data: [
      {
        name: 'PM10'
      },
      {
        name: 'GPS在线率'
      },
      {
        name: '履职率'
      }
    ],
    textStyle: {
      color: '#a8aab0',
      fontStyle: 'normal',
      fontFamily: '微软雅黑',
      fontSize: 12
    }
  },
  xAxis: [
    {
      type: 'category',
      //	boundaryGap: true,//坐标轴两边留白
      data: data['x'],
      axisLabel: {
        //坐标轴刻度标签的相关设置。
        //		interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
        //	margin:15,
        textStyle: {
          color: '#fff',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 12
        }
      },
      axisTick: {
        //坐标轴刻度相关设置。
        show: false
      },
      axisLine: {
        //坐标轴轴线相关设置
        lineStyle: {
          color: '#fff',
          opacity: 0.2
        }
      },
      splitLine: {
        //坐标轴在 grid 区域中的分隔线。
        show: false
      }
    }
  ],
  yAxis: [
    {
      min: 0,
      max: 100,
      type: 'value',
      splitNumber: 10,
      axisLabel: {
        textStyle: {
          color: '#fff',
          fontStyle: 'normal',
          fontFamily: '微软雅黑',
          fontSize: 12
        },
        formatter: '{value}%'
      },
      axisLine: {
        lineStyle: {
          color: '#fff',
          opacity: 0.2
        }
      },
      axisTick: {
        lineStyle: {
          color: '#fff',
          opacity: 0.2
        }
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: 'PM10',
      type: 'bar',
      data: [70, 85, 60, 45, 75, 60, 82, 40, 60, 82],
      barWidth: 10,
      barGap: 0.2, //柱间距离
      // label: {//图形上的文本标签
      //     normal: {
      //       show: true,
      //       position: 'top',
      //       textStyle: {
      //           color: '#a8aab0',
      //           fontStyle: 'normal',
      //           fontFamily: '微软雅黑',
      //           fontSize: 12,
      //       },
      //     },
      // },
      itemStyle: {
        normal: {
          show: true,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#F97D2C'
            }
          ]),
          barBorderRadius: 50,
          borderWidth: 0
        }
      }
    },
    {
      name: 'GPS在线率',
      type: 'bar',
      data: [28, 75, 45, 80, 65, 45, 72, 86, 95, 45],
      barWidth: 10,
      barGap: 0.2, //柱间距离
      // label: {//图形上的文本标签
      //     normal: {
      //       show: true,
      //       position: 'top',
      //       textStyle: {
      //           color: '#a8aab0',
      //           fontStyle: 'normal',
      //           fontFamily: '微软雅黑',
      //           fontSize: 12,
      //       },
      //     },
      // },
      itemStyle: {
        normal: {
          show: true,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#21DF44'
            }
          ]),
          barBorderRadius: 50,
          borderWidth: 0
        }
      }
    },
    {
      name: '履职率',
      type: 'bar',
      data: [60, 45, 39, 49, 73, 85, 62, 76, 85, 75],
      barWidth: 10,
      barGap: 0.2, //柱间距离
      // label: {//图形上的文本标签
      //     normal: {
      //       show: true,
      //       position: 'top',
      //       textStyle: {
      //           color: '#a8aab0',
      //           fontStyle: 'normal',
      //           fontFamily: '微软雅黑',
      //           fontSize: 12,
      //       },
      //     },
      // },
      itemStyle: {
        normal: {
          show: true,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: '#28A2FE'
            }
          ]),
          barBorderRadius: 50,
          borderWidth: 0
        }
      }
    }
  ]
}

export default option
