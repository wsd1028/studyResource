<template>
  <div class="common-table">
    <el-table
      ref="common-table"
      :data="tableData"
      height="90%"
      size="mini"
      @selection-change="$emit('checked', $event)"
      @row-click="
        (row, column, event) => {
          $emit('row-click', { row, column, event })
        }
      "
      v-loading="config.loading"
      highlight-current-row
      stripe
      fit
      border
      lazy
      :load="lazyload"
      row-key="id"
      :header-cell-style="{ backgroundColor: '#f9f9f9' }"
      :cell-style="setCellStyle"
      :tree-props="{
        children: config.tableTreeConfig && config.tableTreeConfig.props ? config.tableTreeConfig.props.children : 'children',
        hasChildren: config.tableTreeConfig && config.tableTreeConfig.lazyload ? 'id' : 'hasChildren'
      }"
      class="el-table"
    >
      <!-- 序号 -->
      <el-table-column align="center" label="序号" :width="config.formType === 'tree' ? 120 : 80">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ (config.page - 1) * config.limit + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- 多选框 -->
      <el-table-column type="selection" width="50" align="center" v-if="showChecked"></el-table-column>
      <!-- 内容列 -->
      <el-table-column
        align="center"
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.colLabel || item.label"
        :min-width="item.width ? item.width : 120"
        :sortable="item.target.sortable"
        :sort-by="item.target.sortBy || []"
      >
        <template slot-scope="scope">
          <!-- 文本信息 -->
          <span
            v-if="item.colType == 'text'"
            style="margin-left: 10px"
            v-html="
              typeof item.target.data === 'function'
                ? item.target.data.call(scope.row, scope.row[item.prop], scope.row)
                : item.target.data || scope.row[item.prop]
            "
          ></span>
          <!-- 下载 -->
          <el-link
            size="mini"
            v-else-if="item.colType == 'download'"
            type="primary"
            target="_blank"
            :href="`/carp/business/k/q/open/download/${scope.row[item.prop]}`"
            >下载{{ item.label }}</el-link
          >
          <!-- 头像 -->
          <el-avatar v-else-if="item.colType == 'avatar'" size="large" :src="$store.state.config.convertImgUrl(scope.row[item.prop], item.target.HBase)">
            <i class="el-icon-user-solid"></i>
          </el-avatar>
          <!-- 单张图片显示 -->
          <div class="img-wrap" v-else-if="item.colType == 'img'">
            <!-- 普通图片 -->
            <el-image
              style="width: 80px; height: 80px"
              :src="$store.state.config.convertImgUrl(scope.row[item.prop], item.target.HBase)"
              fit="contain"
              :preview-src-list="[$store.state.config.convertImgUrl(scope.row[item.prop], item.target.HBase)]"
              size="mini"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <!-- 多图片显示 -->
          <div class="img-wrap" v-else-if="item.colType == 'imgs'">
            <el-image
              v-for="(item, key) in scope.row[item.prop]"
              :key="key"
              style="width: 80px; height: 80px"
              :src="$store.state.config.convertImgUrl(scope.row[item.prop][0], item.target.HBase)"
              fit="contain"
              :preview-src-list="scope.row[item.prop].map(item => $store.state.config.convertImgUrl(item, item.target.HBase))"
              size="mini"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <!-- 编辑按钮 -->
          <el-tooltip v-else-if="item.colType == 'edit'" effect="dark" placement="right">
            <el-link type="primary" style="font-size:12px" v-text="(item.target.beforeUnit || '') + scope.row[item.prop] + (item.target.unit || '')" />
            <template slot="content">
              <a size="mini" v-if="allowEdit" @click="$emit('edit', scope.row)" v-text="'编辑 | '" style="cursor:pointer" />
              <a size="mini" @click="$emit('detailsView', scope.row)" v-text="'查看'" style="cursor:pointer" />
            </template>
          </el-tooltip>
          <!-- switch切换按钮 -->
          <el-switch
            v-else-if="item.colType == 'switch'"
            v-model="scope.row[item.prop]"
            size="mini"
            :active-value="item.target.item[0].code"
            :inactive-value="item.target.item[1].code"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="
              () => {
                handleSwitchChange(scope.row, item.prop, item.target)
              }
            "
          ></el-switch>
          <!-- 转换为标签显示 -->
          <div v-else-if="item.colType == 'tag'">
            <el-tag v-for="(_item, key) in item.target.item" :key="key" v-show="scope.row[item.prop] === _item.code" :type="_item.type" size="mini">
              {{ _item.label }}
            </el-tag>
          </div>
          <!-- 下拉选择value转label -->
          <span v-else-if="item.type == 'select' || item.type == 'radio'" style="margin-left: 10px">
            <span
              v-for="(_item, key) in item.target.item"
              :key="key"
              v-show="scope.row[item.prop] === _item[(item.target.props && item.target.props.code) || 'code']"
            >
              {{ _item[(item.target.props && item.target.props.label) || 'label'] }}
            </span>
          </span>
          <!-- 图标 -->
          <span
            v-else-if="item.colType == 'icon'"
            style="color:#888"
            :class="/^iconfont/.test(scope.row[item.prop]) ? `iconfont ${scope.row[item.prop]}` : `el-icon-${scope.row[item.prop]}`"
          ></span>
          <!-- 时间戳转换 -->
          <span v-else-if="item.colType == 'timestemp'" style="margin-left: 10px">{{ timestempFormate(scope.row[item.prop]) }}</span>
          <!-- 文本信息 -->
          <span
            v-else
            style="margin-left: 10px"
            v-html="
              typeof item.target.data === 'function'
                ? item.target.data.call(scope.row, scope.row[item.prop], scope.row)
                : item.target.data || scope.row[item.prop]
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column v-if="showControl" fixed="right" align="left" label="操作" :min-width="config.controlWidth || '120px'">
        <template slot-scope="scope">
          <!-- 查看按钮 -->
          <el-button
            v-if="(allowEdit && showControlEdit) || showDetailsButton"
            size="mini"
            icon="el-icon-search"
            v-text="'查看'"
            class="bt-control"
            @click="$emit('detailsView', scope.row)"
          />
          <!-- 编辑按钮 -->
          <el-button
            size="mini"
            v-if="allowEdit && showControlEdit"
            type="primary"
            icon="el-icon-edit"
            class="bt-control"
            v-text="'编辑'"
            @click="$emit('edit', scope.row)"
          />
          <!-- 删除按钮 -->
          <el-button
            size="mini"
            type="danger"
            v-if="allowDelete && showControlDel"
            icon="el-icon-delete"
            class="bt-control"
            v-text="'删除'"
            @click="$emit('del', scope.row)"
          />
          <!-- 添加子项 -->
          <el-button
            size="mini"
            type="primary"
            @click="$emit('add', scope.row)"
            v-if="
              (() => {
                if (config.formType !== 'tree') {
                  return false
                }
                const CONFIG = config.tableTreeConfig
                if (CONFIG && CONFIG.appendChild) {
                  const rule = CONFIG.appendChild
                  return rule.regExp.test(scope.row[rule.key] + '')
                } else {
                  return true
                }
              })()
            "
            class="bt-control"
            >添加子项</el-button
          >
          <!-- 更多操作 -->
          <el-button
            v-for="item in bindButtons"
            :key="item.key"
            v-show="bindBtShow(scope.row, item)"
            :type="item.type ? item.type : 'primary'"
            @click="$emit('bindButtonClick', { row: scope.row, key: item.key })"
            size="mini"
            class="bt-control"
          >
            <i :class="/^iconfont/.test(item.icon) ? `iconfont ${item.icon}` : item.icon" style="font-size:12px;margin-right:2px"></i>
            <span v-text="item.label"></span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="paginationShow"
      class="pager"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="config.total"
      :page-size="config.limit"
      :page-sizes="[10, 20, 50, 100, 200]"
      :current-page.sync="config.page"
      @current-change="$emit('changePage', $event)"
      @size-change="$emit('sizeChange', $event)"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object,
    allowEdit: {
      type: Boolean,
      default: true
    },
    allowDelete: {
      type: Boolean,
      default: true
    },
    // 显示查看详情按钮
    showDetailsButton: {
      type: Boolean,
      default: false
    },
    // 绑定按钮
    bindButtons: {
      type: Array,
      default: () => []
    },
    // 显示多选框
    showChecked: {
      type: Boolean,
      default: true
    },
    // 显示操作按钮
    showControl: {
      type: Boolean,
      default: true
    },
    // 显示操作列中的修改按钮
    showControlEdit: {
      type: Boolean,
      default: true
    },
    // 显示操作列中的删除按钮
    showControlDel: {
      type: Boolean,
      default: true
    },
    // 显示分页
    paginationShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    /* *
     * 绑定按钮是否显示
     * @param row: 当前列对象
     * @return true:显示 false:隐藏
     * * */
    bindBtShow(row, btObj) {
      let isShow = true
      if (btObj.rule && btObj.rule.regExp && btObj.rule.key) {
        isShow = btObj.rule.regExp.test(row[btObj.rule.key])
      }
      return isShow
    },
    /* *
     * 切换按钮事件
     * param row:表格行数据对象
     * param key:表单配置对象名
     * param target:表单配置对象
     * * */
    handleSwitchChange(row, key, target) {
      // 获取提示信息
      let message = ''
      target.item.forEach(item => {
        if (item.code === row[key]) {
          message = item.label
        }
      })
      // 弹窗提示
      this.$confirm(message, target.label, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: row[key] ? 'danger' : 'warning'
      })
        .then(() => {
          if (target.change) {
            target.change.call(this, row)
            return
          }
          // 发送请求
          this.$http
            .put(target.url, row)
            .then(({ code }) => {
              if (code !== 0) this.$message.error('网络错误')
              this.$emit('getList')
            })
            .catch(error => {
              if (error) {
                this.$message.error('网络错误')
                this.$emit('getList')
              }
            })
        })
        .catch(() => {
          this.$emit('getList')
        })
    },
    /* *
     * 时间戳转正常时间格式
     * * */
    timestempFormate(timestemp) {
      let date = new Date(timestemp)
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`
    },
    /* *
     * 设置表格单元格样式
     * * */
    setCellStyle({ row }) {
      // 添加随机色数组
      if (!this.colors && this.config.formType == 'tree') {
        let length = 400 //数组长度
        this.colors = []
        for (let i = 0; i < length; i++) {
          let color = []
          for (let i = 0; i < 4; i++) {
            let val = ''
            if (i === 3) {
              // 不透明度
              val = 0.06
            } else {
              // 随机色彩
              val = parseInt(Math.random() * 255 + 1)
            }
            color.push(val)
          }
          color = `rgba(${color.join()})`
          this.colors.push(color)
        }
      }
      // 定义样式对象
      let style = {}
      // 获取树状表格配置对象
      const CONFIG = this.config.tableTreeConfig
      if (this.config.formType == 'tree') {
        // 获取层级数
        let level = row[CONFIG.props ? CONFIG.props.type || 'type' : 'type']
        style.backgroundColor = this.colors[level]
      }
      return style
    },
    /* *
     * 懒加载事件
     * * */
    lazyload(row, treeNode, resolve) {
      let params = {
        limit: 10000,
        page: 1
      }
      params[this.config.tableTreeConfig.lazyPropId || 'id'] = row.id
      this.$http
        .get(this.config.tableTreeConfig.lazyUrl, {
          params
        })
        .then(({ code, data }) => {
          if (code === 0) {
            resolve(data.records || data)
          } else {
            this.$message.error('请求失败')
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
.common-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  position: relative;

  .el-table {
    flex: auto;
    height: 0;
    border-width: 0;
  }

  .pager {
    flex: none;
    padding: 10px;
    text-align: center;
  }
}

.bt-control {
  margin: 4px;
}
</style>

<style lang="less">
.common-table {
  .el-table {
    .cell {
      white-space: normal;
    }
  }
  // 图片样式
  .image-slot {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
  }
}
</style>
