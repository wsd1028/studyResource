<template>
  <div
    class="NodeSelector"
    v-loading.fullscreen="loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    :style="{display:(layout=='vertical'?'flex':'block')}"
  >
    <el-popover
      placement="bottom"
      width="200"
      trigger="click"
      class="tree-popover"
      v-on:show="showTree"
      v-on:hide="hideTree"
      :style="{marginBottom:(layout=='vertical'?'0':'20px')}"
    >
      <el-input
        placeholder="输入关键字进行过滤"
        size="mini"
        suffix-icon="el-icon-search"
        v-model="filterText"
        class="treeInput"
      ></el-input>
      <el-tree
        class="my-tree"
        :data="nodeDataMy"
        :empty-text="nodeConfig.emptyText"
        :node-key="nodeConfig.nodeKey"
        :props="nodeConfig.props"
        :render-after-expand="nodeConfig.renderAfterExpand"
        :highlight-current="nodeConfig.highlightCurrent"
        :default-expand-all="nodeConfig.defaultExpandAll"
        :expand-on-click-node="nodeConfig.expandOnClickNode"
        :auto-expand-parent="nodeConfig.autoExpandParent"
        :default-expanded-keys="nodeConfig.defaultExpandedKeys"
        :accordion="nodeConfig.accordion"
        :indent="nodeConfig.indent"
        :icon-class="nodeConfig.iconClass"
        :draggable="nodeConfig.draggable"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree"
      ></el-tree>
      <el-input
        slot="reference"
        suffix-icon="el-icon-arrow-up"
        :clearable="nodeClearable"
        :class="[ 'treeButton',{'rotate':rotate}]"
        placeholder="请选择节点"
        v-model="defaultNode.nodeName"
        readonly
        :size="nodeConfig.size"
        v-on:clear="clearNode"
      ></el-input>
    </el-popover>

    <el-select
      v-if="includeRoom"
      v-model="roomId"
      class="my-select"
      v-on:change="changeRoom"
      :multiple="roomConfig.multiple"
      :disabled="roomConfig.disabled"
      :size="roomConfig.size"
      :clearable="roomConfig.clearable"
      :collapse-tags="roomConfig.collapseTags"
      :multiple-limit="roomConfig.multipleLimit"
      :name="roomConfig.name"
      :autocomplete="roomConfig.autocomplete"
      :placeholder="roomConfig.placeholder"
      :filterable="roomConfig.filterable"
      :allow-create="roomConfig.allowCreate"
      :no-match-text="roomConfig.noMatchText"
      :popper-class="roomConfig.popperClass"
      :reserve-keyword="roomConfig.reserveKeyword"
      :default-first-option="roomConfig.defaultFirstOption"
      :popper-append-to-body="roomConfig.popperAppendtoBody"
      :automatic-dropdown="roomConfig.automaticDropdown"
    >
      <el-option
        v-for="item in roomDataFilter"
        :key="item[roomConfig.props.value]"
        :label="item[roomConfig.props.label]"
        :value="item[roomConfig.props.value]"
      ></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ElementUI from "element-ui";
import Linq from "linq";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import { Node } from "../core/Node";
import { Room } from "../core/Room";

Vue.use(ElementUI);

@Component({
  props: {
    value: null,
    includeRoom: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    nodeDataUrl: {
      type: String,
      default: () => {
        return "";
      }
    },
    nodeClearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    layout: {
      type: String,
      default: () => {
        return "vertical";
      }
    },
    defaultNode: {
      type: Object,
      default: () => {
        return {
          nodeName: "",
          nodeId: 0
        };
      }
    },
    nodeConfig: {
      type: Object,
      default: () => {
        return {
          emptyText: "",
          nodeKey: "",
          props: {
            children: "children",
            label: "label",
            value: "id"
          },
          renderAfterExpand: false,
          highlightCurrent: true,
          defaultExpandAll: false,
          expandOnClickNode: false,
          autoExpandParent: true,
          defaultExpandedKeys: [],
          accordion: false,
          indent: 0,
          iconClass: "",
          draggable: false,
          size: ""
        };
      }
    },
    nodeData: Array,
    //机房
    roomData: Array,
    roomDataUrl: {
      type: String,
      default: () => {
        return "";
      }
    },
    defaultRoom: null,
    roomConfig: {
      type: Object,
      default: () => {
        return {
          props: {
            label: "label",
            value: "value"
          },
          multiple: false,
          disabled: false,
          size: "",
          clearable: false,
          collapseTags: false,
          multipleLimit: 0,
          name: "",
          autocomplete: "off",
          placeholder: "请选择机房",
          filterable: false,
          allowCreate: false,
          noMatchText: "无匹配数据",
          popperClass: "",
          reserveKeyword: false,
          defaultFirstOption: false,
          popperAppendtoBody: false,
          automaticDropdown: false
        };
      }
    }
  }
})
export default class NodeSelector extends Vue {
  private myValue = null; //数据双向绑定
  private loading: boolean = false; //控制加载锁屏用的遮罩
  private filterText: string = "";
  private rotate: boolean = true; //节点树input的icon能否旋转
  @Watch("filterText")
  watchFilterText(newVal: string, oldVal: string) {
    this.$refs.tree.filter(newVal);
  }
  @Watch("roomData")
  watchRoomData(newVal: Array, oldVal: Array) {
    this.roomDataMy = newVal;
    if (this.defaultNode.nodeId) {
      this.nodeId = this.defaultNode.nodeId;
      this.filterRoom();
    }
  }
  @Watch("nodeData")
  watchNodeData(newVal: Array, oldVal: Array) {
    this.nodeDataMy = newVal;
  }
  @Watch("defaultNode", { immediate: true })
  watchDefaultNode(newVal: Array, oldVal: Array) {
    this.nodeId = newVal.nodeId;
  }
  //节点
  private nodeDataMy = [];
  private nodeId: Number = 0;

  private filterNode(value, data) {
    if (!value) return true;
    return data[this.nodeConfig.props.label].indexOf(value) !== -1;
  }
  private clearNode() {
    this.nodeId = 0;
    this.defaultNode.nodeName = "";
    this.filterRoom();
    this.$emit("nodeChange", {});
    this.$emit("change", { nodeChoose: {} });
    this.$emit("input", { nodeChoose: {} });

    if (typeof this.roomId == "string") {
      this.roomId = "";
    } else {
      this.roomId = [];
    }
  }
  private handleNodeClick(node) {
    this.nodeId = node.id;
    this.defaultNode.nodeName = node.text;
    this.filterRoom();
    this.$emit("nodeChange", node);
    this.$emit("change", { nodeChoose: node });
    this.$emit("input", { nodeChoose: node });
    if (typeof this.roomId == "string") {
      this.roomId = "";
    } else {
      this.roomId = [];
    }
  }
  private showTree() {
    this.rotate = false;
  }
  private hideTree() {
    this.rotate = true;
  }
  //机房
  private roomDataFilter = [];
  private roomDataMy = [];
  private roomId: Array<String> | String = "";
  private changeRoom(roomId) {
    let roomDataMy = JSON.parse(JSON.stringify(this.roomDataMy));
    let that = this;
    if (typeof this.roomId == "string") {
      roomId = [roomId];
    }
    let roomChoose = [];
    for (let i = 0; i < roomId.length; i++) {
      let item = roomDataMy.filter(function(item) {
        return item[that.roomConfig.props.value] == roomId[i];
      });
      roomChoose.push(item[0]);
    }
    if (typeof this.roomId == "string") {
      this.$emit("roomChange", roomChoose[0]);
      this.$emit("change", { roomChoose: roomChoose[0] });
      this.$emit("input", { roomChoose: roomChoose[0] });

    } else {
      this.$emit("roomChange", roomChoose);
      this.$emit("change", { roomChoose: roomChoose });
      this.$emit("input", { roomChoose: roomChoose });

    }
  }
  private filterRoom() {
    let nodeId = this.nodeId;
    let roomDataMy = JSON.parse(JSON.stringify(this.roomDataMy));
    roomDataMy = roomDataMy.filter(function(item) {
      return item.nodeId == nodeId;
    });
    this.roomDataFilter = roomDataMy;
  }
  /*
   * 页面加载时执行
   */
  async mounted() {
    if (this.defaultRoom) {
      this.roomId = JSON.parse(JSON.stringify(this.defaultRoom));
    }
    if (this.nodeDataUrl) {
      let nodeRes = await Axios.post(this.nodeDataUrl);
      this.nodeDataMy = [nodeRes.data.content];
    }
    if (this.roomDataUrl) {
      let roomRes = await Axios.post(this.roomDataUrl);
      this.roomDataMy = roomRes.data.content;
      this.filterRoom();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.NodeSelector {
  .treeButton {
    width: 200px;
  }
  .el-input.el-input--suffix {
    cursor: pointer;
    overflow: hidden;
  }
  .el-input.el-input--suffix.rotate .el-input__suffix .el-icon-arrow-up {
    transform: rotate(180deg);
  }
}
.treeInput {
  width: 200px !important;
  display: block !important;
  margin: auto;
}
.tree-popover {
  margin-right: 20px;
  display: block;
}
.my-select {
  width: 200px;
}
.my-tree {
  overflow: auto;
  overflow-y: auto;
  overflow-x: auto;
  height: 350px;
  width: 200px;
  margin-top: 10px;
}
.my-tree::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 10px;
}

.my-tree::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.my-tree::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
