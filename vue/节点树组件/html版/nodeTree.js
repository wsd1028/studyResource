Vue.component("my-tree", {
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: function() {
        return {
          value: "nodeid", // ID字段名
          label: "nodename", // 显示名称
          children: "children" // 子级字段名
        };
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: function() {
        return [];
      }
    },
    /* 初始值 */
    value: {
      type: Number,
      default: function() {
        return null;
      }
    },
    default_title: {
      type: String,
      default: function() {
        return "";
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  template:
    '<el-select placeholder="请选择节点" :value="valueTitle" :clearable="clearable" @clear="clearHandle" class="node-sel">' +
    '<el-option :value="valueTitle" :label="valueTitle" class="nodeTree">' +
    '<el-tree id="tree-option" ref="selectTree" :accordion="accordion" :data="options" :props="props"' +
    ':node-key="props.value"' +
    ':default-expanded-keys="defaultExpandedKey"' +
    '@node-click="handleNodeClick"></el-tree>' +
    "</el-option>" +
    "</el-select>",
  data() {
    return {
      valueId: this.value, // 初始值
      valueTitle: this.default_title,
      defaultExpandedKey: []
    };
  },

  created: function() {
    this.initHandle();
  },

  methods: {
    // 初始化值
    initHandle: function() {
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[
          this.props.label
        ]; // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId); // 设置默认选中
        this.defaultExpandedKey = [this.valueId]; // 设置默认展开
      }
      this.$nextTick(function() {
        let scrollWrap = document.querySelectorAll(
          ".el-scrollbar .el-select-dropdown__wrap"
        )[0];
        let scrollBar = document.querySelectorAll(
          ".el-scrollbar .el-scrollbar__bar"
        );
        scrollWrap.style.cssText =
          "margin: 0px; max-height: none; overflow: hidden;";
        scrollBar.forEach(function(ele) {
          ele.style.width = 0;
        });
      });
    },
    // 切换选项
    handleNodeClick: function(node) {
      this.valueTitle = node[this.props.label];
      this.valueId = node[this.props.value];
      this.$emit("get-value", this.valueId);
      this.defaultExpandedKey = [];
    },
    // 清除选中
    clearHandle: function() {
      this.valueTitle = "";
      this.valueId = null;
      this.defaultExpandedKey = [];
      this.clearSelected();
      this.$emit("get-value", null);
    },
    /* 清空选中样式 */
    clearSelected: function() {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach(function(element) {
        element.classList.remove("is-current");
      });
    }
  },
  watch: {
    value: function() {
      this.valueId = this.value;
      this.initHandle();
    },
    default_title: function(value) {
      this.valueTitle = value;
    }
  }
});
