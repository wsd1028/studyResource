let obj = {
  code: 100,
  desc: "OK",
  content: [
    {
      gtime: 1566799699,
      lossed: 0,
      route: [
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 1 },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 2 },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 3 },
        {
          address: "36.158.194.113",
          host: "",
          rtt: [7, 4, 3],
          status: 11013,
          ttl: 4
        },
        {
          address: "36.158.194.121",
          host: "",
          rtt: [2, 1, 1],
          status: 11013,
          ttl: 5
        },
        {
          address: "36.158.193.5",
          host: "",
          rtt: [1, 1, 1],
          status: 11013,
          ttl: 6
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 7 },
        {
          address: "221.183.19.185",
          host: "",
          rtt: [5, 5, 7],
          status: 11013,
          ttl: 8
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 9 },
        {
          address: "221.176.27.9",
          host: "",
          rtt: [62, 56, 70],
          status: 11013,
          ttl: 10
        },
        {
          address: "221.176.20.150",
          host: "",
          rtt: [35, 34, 34],
          status: 11013,
          ttl: 11
        },
        {
          address: "221.183.66.62",
          host: "",
          rtt: [-1, -1, 35],
          status: 11013,
          ttl: 12
        },
        {
          address: "202.97.95.65",
          host: "",
          rtt: [-1, 33, -1],
          status: 11013,
          ttl: 13
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 14 },
        {
          address: "61.139.113.58",
          host: "",
          rtt: [35, 121, 34],
          status: 11013,
          ttl: 15
        },
        {
          address: "61.139.2.69",
          host: "",
          rtt: [37, 36, 36],
          status: 0,
          ttl: 16
        }
      ],
      site: "61.139.2.69",
      size: 64,
      status: 0,
      time: 34,
      ttl: 16
    },
    {
      gtime: 1566799704,
      lossed: 0,
      route: [
        {
          address: "36.158.94.13",
          host: "",
          rtt: [-1, -1, -1],
          status: -1,
          ttl: 1
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 2 },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 3 },
        {
          address: "36.158.94.113",
          host: "",
          rtt: [7, 4, 3],
          status: 11013,
          ttl: 4
        },
        {
          address: "36.158.194.121",
          host: "",
          rtt: [2, 1, 1],
          status: 11013,
          ttl: 5
        },
        {
          address: "36.158.13.5",
          host: "",
          rtt: [1, 1, 1],
          status: 11013,
          ttl: 6
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 7 },
        {
          address: "",
          host: "",
          rtt: [5, 5, 7],
          status: 11013,
          ttl: 8
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 9 },
        {
          address: "221.16.27.9",
          host: "",
          rtt: [62, 56, 70],
          status: 11013,
          ttl: 10
        },
        {
          address: "221.176.20.150",
          host: "",
          rtt: [35, 34, 34],
          status: 11013,
          ttl: 11
        },
        {
          address: "221.183.66.62",
          host: "",
          rtt: [-1, -1, 35],
          status: 11013,
          ttl: 12
        },
        {
          address: "202.9.95.65",
          host: "",
          rtt: [-1, 33, -1],
          status: 11013,
          ttl: 13
        },
        { address: "", host: "", rtt: [-1, -1, -1], status: -1, ttl: 14 },
        {
          address: "61.139.113.58",
          host: "",
          rtt: [35, 121, 34],
          status: 11013,
          ttl: 15
        },
        {
          address: "61.139.2.69",
          host: "",
          rtt: [37, 36, 36],
          status: 0,
          ttl: 16
        }
      ],
      site: "61.139.2.69",
      size: 64,
      status: 0,
      time: 33,
      ttl: 16
    }
  ]
};

function singleArrObj(oldArr, rule) {
  let newArr = [];
  for (var i = 0; i < oldArr.length; i++) {
    var flag = true;
    for (var j = 0; j < newArr.length; j++) {
      let oldItem = oldArr[i];
      let newItem = newArr[j];
      if (oldItem[rule] == newItem[rule]) {
        flag = false;
      }
    }
    if (flag) {
      newArr.push(oldArr[i]);
    }
  }
  // console.log("new",newArr)
  return newArr;
}

function makeData() {
  let data = [];
  let mainData = [];
  //取出所有路由信息将其变为二维数组
  for (let i = 0; i < obj.content.length; i++) {
    data.push(obj.content[i].route);
  }
  //获取多少跳
  let count = data[0].length;
  //将路由分组并初次过滤 空address
  for (let i = 0; i < count; i++) {
    let arr = [];
    for (let j = 0; j < data.length; j++) {
      if (data[j][i].address) {
        arr.push(data[j][i]);
      }
    }
    mainData.push(arr);
  }
  //去除相同address
  for (let i = 0; i < mainData.length; i++) {
    mainData[i] = singleArrObj(mainData[i], "address");
  }
  //去空数组项
  let newMainData = [];
  for (let i = 0; i < mainData.length; i++) {
    if (mainData[i].length > 0) {
      newMainData.push(mainData[i]);
    }
  }
  let row = 30;
  let cole = 20;
  let rectX = 100;
  let rectY = 50;
  let showNodes = [];
  let lines = [];
  //生成节点
  for (let i = 0; i < newMainData.length; i++) {
    for (let j = 0; j < newMainData[i].length; j++) {
      let nodeObj = {};
      nodeObj.name = newMainData[i][j].ttl;
      nodeObj.symbol = "rect";
      nodeObj.symbolSize = [80, 25];
      nodeObj.value = [];
      nodeObj.value[0] = (rectX + row) * (i + 1);
      if (j == 0) {
        nodeObj.value[1] = 300;
        0;
      } else {
        if (j % 2 > 0) {
          nodeObj.value[1] = 300 - ((j + 1) / 2) * (cole + rectY / 2);
        } else {
          nodeObj.value[1] = 300 + (j / 2) * (cole + rectY / 2);
        }
      }
      showNodes.push(nodeObj);
      //生成线条
      if (i < newMainData.length - 1) {
        for (let m = 0; m < newMainData[i + 1].length; m++) {
          let lineObj = {};
          lineObj.coords = [[newMainData[i][j], newMainData[i + 1][m]]];
          lines.push(lineObj);
        }
      }
    }
  }

  console.log(lines);
}
makeData();
let arr = [
  [{ address: "36.158.94.13", host: "", rtt: [Array], status: -1, ttl: 1 }],
  [
    {
      address: "36.158.194.113",
      host: "",
      rtt: [Array],
      status: 11013,
      ttl: 4
    },
    { address: "36.158.94.113", host: "", rtt: [Array], status: 11013, ttl: 4 }
  ],
  [
    { address: "36.158.194.121", host: "", rtt: [Array], status: 11013, ttl: 5 }
  ],
  [
    { address: "36.158.193.5", host: "", rtt: [Array], status: 11013, ttl: 6 },
    { address: "36.158.13.5", host: "", rtt: [Array], status: 11013, ttl: 6 }
  ],
  [
    { address: "221.183.19.185", host: "", rtt: [Array], status: 11013, ttl: 8 }
  ],
  [
    { address: "221.176.27.9", host: "", rtt: [Array], status: 11013, ttl: 10 },
    { address: "221.16.27.9", host: "", rtt: [Array], status: 11013, ttl: 10 }
  ],
  [
    {
      address: "221.176.20.150",
      host: "",
      rtt: [Array],
      status: 11013,
      ttl: 11
    }
  ],
  [
    { address: "221.183.66.62", host: "", rtt: [Array], status: 11013, ttl: 12 }
  ],
  [
    { address: "202.97.95.65", host: "", rtt: [Array], status: 11013, ttl: 13 },
    { address: "202.9.95.65", host: "", rtt: [Array], status: 11013, ttl: 13 }
  ],
  [
    { address: "61.139.113.58", host: "", rtt: [Array], status: 11013, ttl: 15 }
  ],
  [{ address: "61.139.2.69", host: "", rtt: [Array], status: 0, ttl: 16 }]
];
