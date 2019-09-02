let obj = {
  class: "GraphLinksModel",
  linkFromPortIdProperty: "fromPort",
  linkToPortIdProperty: "toPort",
  nodeDataArray: [
    {
      key: 1,
      category: "Start",
      loc: "-7.105427357601002e-15 -28",
      color: "",
      text: "开始",
      state: 1
    },
    {
      key: 2,
      category: "Step",
      loc: "0 70",
      color: "",
      text: "提交申请",
      state: 1
    },
    {
      key: 3,
      category: "Step",
      loc: "336 70",
      color: "",
      text: "网管审核",
      state: 1
    },
    {
      key: 4,
      category: "Conditional",
      loc: "336.00000000000006 159.00000000000003",
      color: "",
      text: "审核是否通过",
      state: 1
    },
    {
      key: 5,
      category: "Step",
      loc: "336.00000000000006 278",
      color: "",
      text: "工程师配置",
      state: 2
    },
    {
      key: 6,
      category: "Conditional",
      loc: "5.000000000000057 157.00000000000006",
      color: "",
      text: "调整申请",
      state: 1
    },
    {
      key: 7,
      category: "Step",
      loc: "133 278.00000000000006",
      color: "",
      text: "业务完成确认",
      state: 0
    },
    {
      key: 8,
      category: "Step",
      loc: "358 366.99999999999983",
      color: "",
      text: "备案",
      state: 0
    },
    { key: 9, category: "End", loc: "5 461", color: "", text: "结束", state: 0 }
  ],
  linkDataArray: [
    { from: 0, to: 1, fromPort: "B", toPort: "T", visible: false, text: "" },
    {
      from: 1,
      to: 2,
      fromPort: "B",
      toPort: "T",
      visible: false,
      text: "",
      points: [0, -8, 0, 2, 0, 21, 0, 21, 0, 40, 0, 50]
    },
    {
      from: 2,
      to: 3,
      fromPort: "R",
      toPort: "L",
      visible: false,
      text: "",
      points: [60, 70, 70, 70, 168, 70, 168, 70, 266, 70, 276, 70]
    },
    {
      from: 3,
      to: 4,
      fromPort: "B",
      toPort: "T",
      visible: false,
      text: "",
      points: [336, 90, 336, 100, 336, 114.5, 336, 114.5, 336, 129, 336, 139]
    },
    {
      from: 4,
      to: 5,
      fromPort: "B",
      toPort: "T",
      visible: true,
      text: "是",
      points: [336, 179, 336, 189, 336, 218.5, 336, 218.5, 336, 248, 336, 258]
    },
    {
      from: 5,
      to: 7,
      fromPort: "L",
      toPort: "R",
      visible: false,
      text: "",
      points: [
        276,
        278,
        266,
        278,
        234.75,
        278,
        234.75,
        278,
        203.5,
        278,
        193.5,
        278
      ]
    },
    {
      from: 7,
      to: 8,
      fromPort: "B",
      toPort: "L",
      visible: false,
      text: "",
      points: [
        133,
        298.5,
        133,
        308.5,
        133,
        367,
        210.25,
        367,
        287.5,
        367,
        297.5,
        367
      ]
    },
    {
      from: 8,
      to: 9,
      fromPort: "B",
      toPort: "R",
      visible: false,
      text: "",
      points: [
        358,
        387.5,
        358,
        397.5,
        358,
        461,
        216.75,
        461,
        75.5,
        461,
        65.5,
        461
      ]
    },
    {
      from: 4,
      to: 6,
      fromPort: "L",
      toPort: "R",
      visible: true,
      text: "否",
      points: [276, 159, 266, 159, 170.5, 159, 170.5, 157, 75, 157, 65, 157]
    },
    {
      from: 6,
      to: 2,
      fromPort: "L",
      toPort: "L",
      visible: true,
      text: "是",
      points: [-55, 157, -65, 157, -70, 157, -70, 113.5, -70, 70, -60, 70]
    },
    {
      from: 6,
      to: 9,
      fromPort: "B",
      toPort: "T",
      visible: true,
      text: "否",
      points: [5, 177, 5, 187, 5, 308.75, 5, 308.75, 5, 430.5, 5, 440.5]
    }
  ]
};
let nowChild = {};
let obj2 = obj.linkDataArray;
let arr = [];
function AddChildNode(node) {
  node.Childs = [];
  obj2.forEach((item, index) => {
    if (item.from == node.key) {
      let child = { key: item.to, from: item.from, to: item.to };
      node.Childs.push(child);
      arr.push(node.key);
      if (findLoop(arr, child.key)) AddChildNode(child);
    }
  });
  return node;
}
console.log(
AddChildNode({
  key: 1,
  category: "Start",
  loc: "-7.105427357601002e-15 -28",
  color: "",
  text: "开始",
  state: 1
})
);
function findLoop(loopObj, item) {
  if (loopObj.indexOf(item) > -1) {
    return false;
  }
  return true;
}
