<template>
  <div class="list-container">
    <!-- 列表弹出按钮 -->
    <div v-show="!listShow" @click="listShow = true" class="list-bt-wrap">
      <i class="list-bt el-icon-menu"></i>
    </div>
    <!-- 列表 -->
    <el-drawer title="禁运区列表" :visible.sync="listShow" direction="rtl" custom-class="table-control-wrap">
      <table-control
        ref="tableControl"
        :form-config="form"
        add-url="/carp/business/a/q/embargo/increase"
        del-url="/carp/business/a/q/embargo"
        edit-url="/carp/business/a/q/embargo"
        search-url="/carp/business/a/q/embargo/page"
        :allow-add="false"
        :show-control-edit="false"
        :show-control-del="false"
        :filters="filters"
        :bind-buttons="[
          { label: '修改', key: 'edit' },
          { label: '查看', key: 'view', type: 'warning' }
        ]"
        @bindButtonClick="
          $emit('clickRow', { row: $event.row, enableEdit: $event.key === 'edit' })
          listShow = false
        "
        style="height:100%"
      >
        <div slot="control" style="display:inline-block;margin-left:4px">
          <el-button
            type="primary"
            size="mini"
            @click="
              $emit('handleNew')
              listShow = false
            "
            >新增</el-button
          >
        </div>
      </table-control>
    </el-drawer>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'disableTransportList',
  data() {
    return {
      listShow: false,

      form: {
        label: {
          // 名称
          name: {
            label: '名称',
            required: true
          },

          // 是否禁用
          embargo: {
            label: '是否禁运',
            colType: 'switch',
            url: '/carp/business/a/q/embargo',
            item: [
              { label: '禁运', code: true },
              { label: '不禁运', code: false }
            ],
            required: true
          }
        }
      },

      // 筛选条件
      filters: {
        embargo: {
          label: '是否禁运',
          type: 'select',
          width: '100px',
          item: [
            { label: '全部', code: null },
            { label: '禁运', code: 1 },
            { label: '不禁运', code: 0 }
          ],
          value: null
        },

        name: {
          label: '根据名称搜索',
          type: 'search',
          value: null
        }
      }
    }
  },
  methods: {
    flushList() {
      this.$refs.tableControl && this.$refs.tableControl.getList(1)
    }
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color';
@import '../../style/size';
.list-bt-wrap {
  position: absolute;
  padding: 0.1rem;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4285f4;
  border-radius: @radius-size 0 0 @radius-size;
  cursor: pointer;
  .list-bt {
    font-size: 0.3rem;
    color: @white;
  }
}
</style>
