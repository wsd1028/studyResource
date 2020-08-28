<template>
  <div id="table-tree-container">
    <el-tree :data="menu" node-key="id">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <div class="title">
          <span>{{ data.label || data.name }}</span>
        </div>
        <div class="bt-group">
          <el-tooltip class="item" effect="dark" content="添加" placement="top">
            <el-button class="el-icon-circle-plus-outline" type="primary" size="mini" @click="() => append(data)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改" placement="top">
            <el-button class="el-icon-edit-outline" type="success" size="mini" @click="() => edit(data)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button class="el-icon-delete" type="danger" size="mini" @click="() => remove(data)"></el-button>
          </el-tooltip>
        </div>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: this.menuList
    }
  },

  props: {
    // 数据列表
    menuList: Array,
    // 表格配置
    config: Object,
    // 列信息
    tableLable: Array
  },

  watch: {
    menuList(val) {
      this.menu = val
    }
  },

  methods: {
    // 添加
    append(data) {
      this.$emit('add', {
        type: data.type + 1,
        parentId: data.id
      })
    },

    // 编辑
    edit(data) {
      this.$emit('edit', data)
    },

    // 删除
    remove(data) {
      this.$emit('del', data)
    }
  }
}
</script>

<style lang="less" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style lang="less">
#table-tree-container {
  padding: 8px;
  .el-tree-node {
    .el-tree-node__content {
      padding: 8px;
    }
  }
}
</style>
