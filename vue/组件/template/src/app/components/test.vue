<!--  -->
<template>
  <div>
    <NodeSelector
      :includeRoom="true"
      :nodeClearable="true"
      :layout="layout"
      :nodeConfig="nodeConfig"
      :nodeData="nodeData"
      :roomData="roomData"
      :roomConfig="roomConfig"
      v-on:nodeChange="nodeChange"
      v-on:roomChange="roomChange"
      v-on:change="change"
      v-model="choose"
    ></NodeSelector>
    <p>{{JSON.stringify(choose) }}</p>
  </div>
</template>

<script lang='ts'>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Axios from "axios";
import NodeSelector from "./NodeSelector";

//import引入的组件需要注入到对象中才能使用
@Component({
  components: {
    NodeSelector
  }
})
export default class Test extends Vue {
  private choose = "666";
  private layout: string = "vertical";
  private includeRoom: boolean = false;
  private change(data) {
    console.log("changeData", data);
  }
  //节点
  private nodeDataUrl: string = "/Node/GetNode";
  private nodeData = [];
  private defaultNode = {
    nodeName: "重庆移动",
    nodeId: 20005
  };
  private nodeConfig = {
    props: {
      children: "nodes",
      label: "text",
      value: "id"
    },
    highlightCurrent: true,
    draggable: true
  };
  private nodeChange(node) {
    console.log("node", node);
  }
  //机房
  private roomConfig = {
    props: {
      label: "roomName",
      value: "roomId"
    },
    multiple: true,
    disabled: false,
    size: "",
    clearable: true,
    collapseTags: true,
    multipleLimit: 10,
    name: "wsd",
    autocomplete: "off",
    filterable: true,
    allowCreate: false,
    noMatchText: "wsd",
    popperClass: "",
    reserveKeyword: true,
    defaultFirstOption: true,
    popperAppendtoBody: true,
    automaticDropdown: true
  };
  private roomChange(room) {
    console.log("room", room);
  }
  private roomData = [];
  private roomDataUrl: string = "/api/Room/GetAllRooms";

  created() {}
  async mounted() {
    let nodeRes = await Axios.post(this.nodeDataUrl);
    let roomRes = await Axios.post(this.roomDataUrl);
    this.roomData = roomRes.data.content;
    this.nodeData = [nodeRes.data.content];
  }
  beforeCreate() {} //生命周期 - 创建之前
  beforeMount() {} //生命周期 - 挂载之前
  beforeUpdate() {} //生命周期 - 更新之前
  updated() {} //生命周期 - 更新之后
  beforeDestroy() {} //生命周期 - 销毁之前
  destroyed() {} //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style lang='scss'>
//@import url(); 引入公共css类
</style>