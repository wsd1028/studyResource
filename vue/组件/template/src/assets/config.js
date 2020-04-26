let config = {
  "v-model": {
    explain: "数据双向绑定",
    parameter: "返回选中的节点或机房"
  },
  change: {
    explain: "节点/机房 变化时触发",
    parameter: "返回当前选中节点/机房"
  },
  includeRoom: {
    explain: "是否包含节点",
    parameter: "true/false"
  },
  layout: {
    explain: "节点与机房的布局方式",
    parameter: "vertical/horizontal"
  },
  nodeClearable: {
    explain: "节点能否清空",
    parameter: "true/false"
  },
  nodeChange: {
    explain: "点击节点触发事件",
    parameter: "返回当前选中节点"
  },
  nodeConfig: {
    explain: "节点树配置项",
    parameter: "与element节点树Attributes相同,参数一律驼峰命名法",
    add: {
      size: "控制节点树的下拉选择框"
    }
  },
  nodeData: {
    explain: "节点树数据",
    parameter: "与element节点树数据格式相同，具体字段可在nodeConfig.props配置"
  },
  defaultNode: {
    explain: "默认选中的节点",
    parameter: "{nodeName: '',nodeId: ''}"
  },

  roomConfig: {
    explain: "select配置项",
    parameter: "与element的select的Attributes相同,参数一律驼峰命名法"
  },
  roomData: {
    explain: "select数据",
    parameter: "与element的select数据格式相同，具体字段可在roomConfig.props配置"
  },
  defaultRoom: {
    explain: "默认选中的机房",
    parameter: "单选时传入字符串，多选时传入数组"
  }
};
