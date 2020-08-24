<template>
  <div class="common-table">
    <el-table :data="tableData" height="90%" stripe v-loading="config.loading">
      <el-table-column align="center" label="序号" width="85">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ (config.page - 1) * 20 + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
      >
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.visible === '0' ? 'primary' : 'success'" disable-transitions>{{ scope.row.visible === '0' ? '禁用' : '启用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="180">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-delete" @click="handleDelete(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-s-custom" @click="handleRole(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pager" background layout="prev, pager, next" :total="config.total" :current-page.sync="config.page" @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object
  },
  methods: {
    handleEdit(row) {
      this.$emit('edit', row)
    },
    handleDelete(row) {
      this.$emit('del', row)
    },
    handleRole(row) {
      this.$emit('SetRole', row)
    },
    changePage(page) {
      this.$emit('changePage', page)
    }
  }
}
</script>

<style lang="less" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
</style>
