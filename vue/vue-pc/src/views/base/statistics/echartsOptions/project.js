/* *
 * 项目建设情况
 * */

let option = {
  color: ['#154ab4', '#47338f', '#aa763a', '#3b9cb4'],
  title: {
    text: 781,
    subtext: '项目总数',
    textStyle: {
      color: '#f2f2f2',
      fontSize: 30,
      lineHeight: 30
    },
    subtextStyle: {
      fontSize: 10,
      color: ['#ff9d19']
    },
    x: 'center',
    y: 'center'
  },
  grid: {
    bottom: 150,
    left: 100,
    right: '10%'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}<br/> {c}个项目  ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    textStyle: {
      color: '#f2f2f2',
      fontSize: 10
    },
    icon: 'roundRect',
    data: [
      {
        name: '在建',
        value: 2
      },
      {
        name: '完成',
        value: 4
      }
    ]
  },
  series: [
    // 主要展示层的
    {
      radius: ['50%', '90%'],
      center: ['50%', '50%'],
      type: 'pie',
      label: {
        position: 'inner',
        formatter: '{b}：{c}个项目'
      },
      labelLine: {
        normal: {
          show: true,
          length: 30,
          length2: 55
        },
        emphasis: {
          show: true
        }
      },
      data: [
        {
          name: '在建',
          value: 2
        },
        {
          name: '完成',
          value: 4
        }
      ]
    },
    // 边框的设置
    {
      radius: ['45%', '50%'],
      center: ['50%', '50%'],
      type: 'pie',
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      animation: false,
      tooltip: {
        show: false
      },
      data: [
        {
          value: 1,
          itemStyle: {
            color: 'rgba(250,250,250,0.3)'
          }
        }
      ]
    },
    {
      name: '外边框',
      type: 'pie',
      clockWise: false, //顺时加载
      hoverAnimation: false, //鼠标移入变大
      center: ['50%', '50%'],
      radius: ['100%', '100%'],
      label: {
        normal: {
          show: false
        }
      },
      data: [
        {
          value: 9,
          name: '',
          itemStyle: {
            normal: {
              borderWidth: 2,
              borderColor: '#0b5263'
            }
          }
        }
      ]
    }
  ]
}

// 数据请求
function request() {
  // 请求地址
  let url = [
    // 在建项目数量接口地址
    '/carp/business/a/q/data/num/getBuildingNum',
    // 项目完成数量接口地址
    '/carp/business/a/q/data/num/getCompleteNum',
    // 项目总数接口地址
    '/carp/business/a/q/data/num/getProjectNum'
  ]
  // 并发请求数据
  return Promise.allSettled(
    url.map((url, i) => {
      return new Promise(resolve => {
        this.$http.get(url).then(({ code, data }) => {
          if (code === 0) {
            if (i !== 2) {
              option.series[0].data[i].value = option.legend.data[i].value = data
            } else {
              option.title.text = data
            }
            resolve()
          }
        })
      })
    })
  )
}

/* *
 * out
 * */
export default function() {
  return new Promise(resolve => {
    // 数据请求
    request.call(this).then(() => {
      resolve(option)
    })
  })
}
