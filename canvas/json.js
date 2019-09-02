let obj = {
  Id: 1,
  Fatherid: 0,
  StepName: "开始",
  StepType: 0,
  LineTitle: "",
  State: 1,
  Childs: [
    {
      Id: 2,
      Fatherid: 1,
      StepName: "提交申请",
      StepType: 0,
      LineTitle: "",
      State: 1,
      Childs: [
        {
          Id: 3,
          Fatherid: 2,
          StepName: "网管审核",
          StepType: 0,
          LineTitle: "",
          State: 1,
          Childs: [
            {
              Id: 4,
              Fatherid: 3,
              StepName: "审核是否通过",
              StepType: 1,
              LineTitle: "",
              State: 1,
              Childs: [
                {
                  Id: 5,
                  Fatherid: 4,
                  StepName: "工程师配置",
                  StepType: 0,
                  LineTitle: "是",
                  State: 2,
                  Childs: [
                    {
                      Id: 7,
                      Fatherid: 5,
                      StepName: "业务完成确认",
                      StepType: 0,
                      LineTitle: "",
                      State: 0,
                      Childs: [
                        {
                          Id: 8,
                          Fatherid: 7,
                          StepName: "备案",
                          StepType: 0,
                          LineTitle: "",
                          State: 0,
                          Childs: [
                            {
                              Id: 9,
                              Fatherid: 8,
                              StepName: "结束",
                              StepType: 0,
                              LineTitle: "",
                              State: 0,
                              Childs: []
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  Id: 6,
                  Fatherid: 4,
                  StepName: "调整申请",
                  StepType: 1,
                  LineTitle: "否",
                  State: 1,
                  Childs: [
                    {
                      Id: 2,
                      Fatherid: 6,
                      StepName: "提交申请",
                      StepType: 0,
                      LineTitle: "是",
                      State: 1,
                      Childs: []
                    },
                    {
                      Id: 9,
                      Fatherid: 6,
                      StepName: "结束",
                      StepType: 0,
                      LineTitle: "否",
                      State: 0,
                      Childs: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
let newObj = {
  class: "go.GraphLinksModel",
  linkFromPortIdProperty: "fromPort",
  linkToPortIdProperty: "toPort",
  nodeDataArray: [],
  linkDataArray: []
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
  return newArr;
}

function sortByKey(array, key, updown) {
  return array.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    if (updown == "up") {
      return x < y ? -1 : x > y ? 1 : 0;
    }
    if (updown == "down") {
      return x < y ? 1 : x > y ? -1 : 0;
    }
  });
}
let itemWidth = 120; //每一项的宽
let itemHeight = 40; //每一项的高
let rowWidth = 30; //行间距
let coleWidth = 40; //列间距

function test(obj) {
  let type = "";
  let visible = false;
  if (obj.StepType == 1) {
    type = "Conditional";
  }
  let Xrandom = (parseInt(obj.Id) - 1) * (itemWidth + coleWidth);
  let Yrandom = (parseInt(obj.Id) - 1) * (itemWidth + rowWidth)

  if (obj.StepName == "开始") {
    type = "Start";
  }
  if (obj.StepName == "结束") {
    type = "End";
  }
  let nodeItem = {
    key: obj.Id,
    category: type,
    loc: Xrandom + " " + Yrandom,
    text: obj.StepName,
    state: obj.State,
    x: 0,
    y: 0
  };
  let linkItem = {
    from: obj.Fatherid,
    to: obj.Id,
    fromPort: "B",
    toPort: "T",
    visible: visible,
    text: obj.LineTitle
  };
  newObj.nodeDataArray.push(nodeItem);
  newObj.linkDataArray.push(linkItem);

  if (obj.Childs.length > 0) {
    for (let j = 0; j < obj.Childs.length; j++) {
      test(obj.Childs[j]);
    }
  }
}
test(obj);
newObj.nodeDataArray = singleArrObj(newObj.nodeDataArray, "key");
newObj.nodeDataArray = sortByKey(newObj.nodeDataArray, "key", "up");
for (let i = 0; i < newObj.linkDataArray.length; i++) {
  if (newObj.linkDataArray[i].text) {
    newObj.linkDataArray[i].visible = true;
  }
}


console.log(newObj);
