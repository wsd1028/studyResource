import Mock from 'mockjs'

// 图表数据
let List = []
export default {
  getStatisticalData: () => {
    for (let i = 0; i < 7; i++) {
      List.push(
        Mock.mock({
          混泥土: Mock.Random.float(100, 8000, 0, 0),
          建渣: Mock.Random.float(100, 8000, 0, 0),
          水泥: Mock.Random.float(100, 8000, 0, 0),
          费汽车: Mock.Random.float(100, 8000, 0, 0),
          泥沙: Mock.Random.float(100, 8000, 0, 0),
          污染水: Mock.Random.float(100, 8000, 0, 0)
        })
      )
    }
    return {
      code: 20000,
      data: {
        // 饼图
        videoData: [
          {
            name: '建渣',
            value: Mock.Random.float(1000, 10000, 0, 0)
          },
          {
            name: '混泥土',
            value: Mock.Random.float(1000, 10000, 0, 0)
          },
          {
            name: '污染水',
            value: Mock.Random.float(1000, 10000, 0, 0)
          },
          {
            name: '泥沙   ',
            value: Mock.Random.float(1000, 10000, 0, 0)
          },
          {
            name: '废弃车',
            value: Mock.Random.float(1000, 10000, 0, 0)
          },
          {
            name: '水泥',
            value: Mock.Random.float(1000, 10000, 0, 0)
          }
        ],
        // 柱状图
        userData: [
          {
            date: '周一',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周二',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周三',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周四',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周五',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周六',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          },
          {
            date: '周日',
            new: Mock.Random.integer(1, 100),
            active: Mock.Random.integer(100, 1000)
          }
        ],
        // 折线图
        orderData: {
          date: ['20191001', '20191002', '20191003', '20191004', '20191005', '20191006', '20191007'],
          data: List
        },
        tableData: [
          {
            name: '混泥',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          },
          {
            name: '建渣',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          },
          {
            name: '污染水',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          },
          {
            name: '泥沙',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          },
          {
            name: '费汽车',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          },
          {
            name: '水泥',
            todayBuy: Mock.Random.float(100, 1000, 0, 0),
            monthBuy: Mock.Random.float(3000, 5000, 0, 0),
            totalBuy: Mock.Random.float(40000, 1000000, 0, 0)
          }
        ]
      }
    }
  }
}
