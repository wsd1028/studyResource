<!--
  普通增删改查组件
  @prop formConfig: 表单配置文件
  @prop addUrl: 添加请求地址
  @prop delUrl: 删除请求地址
  @prop editUrl: 编辑请求地址
  @prop searchUrl: 搜索请求地址
  @prop filters: 筛选器
-->
<template>
  <div class="manage common-table-control" v-loading="loading">
    <!-- 表单弹窗 -->
    <el-dialog
      ref="formDialog"
      class="dialog"
      :visible.sync="formShow"
      :modal="false"
      :show-close="false"
      :top="form.formTop || '0.7rem'"
      :width="form.formWidth || '80%'"
      :close-on-click-modal="false"
      custom-class="common-table-control-form-dialog"
      v-loading="formLoading"
      @closed="
        formInit()
        $emit('formClosed')
      "
    >
      <div slot="title" style="display:flex;justify-content:space-between">
        <span v-text="formType === 'add' ? addDescription : '修改条目'"></span>
        <i class="el-icon-close" @click="formShow = false" style="cursor:pointer"></i>
      </div>
      <!-- 表单 -->
      <div class="form-container" :style="{ height: form.formHeight || '52vh' }">
        <el-scrollbar class="custom-scrollbar">
          <common-form ref="commonForm" :formConfig="form" style="padding:10px 40px"></common-form>
          <!-- 自定义内容 -->
          <div class="custom-form" style="padding:0 40px 10px">
            <slot name="form"></slot>
          </div>
        </el-scrollbar>
      </div>
      <!-- 提交按钮 -->
      <div slot="footer" style="text-align:center">
        <el-button v-if="formType == 'add' || form.enableEdit" @click="submit" type="primary">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 表单end -->

    <!-- 控制器end -->
    <el-card shadow="never" class="card-container" body-style="flex:auto;height:0;padding:0;overflow:visible">
      <template slot="header">
        <div class="control">
          <!-- 筛选器 -->
          <div class="filter-wrap" v-if="showFilters">
            <div
              class="filter"
              v-for="(item, key) in filters"
              :key="key"
              v-show="item.show !== undefined ? item.show : true"
              :style="{ width: item.width || 'auto', clear: item.lineBreak ? 'left' : 'none', marginRight: '10px' }"
            >
              <span v-if="item.name" v-text="item.name" class="label"></span>
              <!-- 下拉框 -->
              <el-select
                v-if="item.type == 'select'"
                v-model="item.value"
                @change="
                  item.change ? item.change($event) : null
                  item.real !== false && getList(1) && getList(1)
                "
                :placeholder="item.placeholder || item.label"
                size="mini"
              >
                <el-option
                  v-for="(_item, key) in item.item"
                  :key="key"
                  :label="_item[(item.props && item.props.label) || 'label']"
                  :value="_item[(item.props && item.props.code) || 'code']"
                ></el-option>
              </el-select>
              <!-- 下拉框end -->
              <!-- 下拉搜索框 -->
              <el-select
                size="mini"
                v-else-if="item.type == 'subSearch'"
                v-model="item.value"
                filterable
                remote
                :placeholder="item.placeholder || item.label"
                :remote-method="query => $debounce(() => handleFormSearch(query, item), 500)()"
                @change="
                  item.change ? item.change($event) : null
                  item.real !== false && getList(1)
                "
              >
                <el-option v-for="_item in item.item" :key="_item.code" :label="_item.label" :value="_item.code"></el-option>
              </el-select>
              <!-- 下拉搜索框end -->
              <!-- 日期 -->
              <el-date-picker
                v-else-if="item.type == 'date'"
                v-model="item.value"
                type="datetime"
                size="mini"
                format="yyyy年MM月dd日-HH时mm分ss秒"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="item.hasOwnProperty('clearable') ? item.clearable : true"
                :placeholder="item.placeholder || item.label"
                @change="
                  item.change && item.change($event, getList)
                  item.real !== false && !item.manualFlush && getList(1)
                "
              ></el-date-picker>
              <!-- 日期end -->
              <!-- 地区筛选 -->
              <el-cascader
                v-else-if="item.type == 'area'"
                :options="item.area || area.tree"
                :props="{ checkStrictly: true, emitPath: false, value: (item.props && item.props.code) || 'id', label: 'name', children: 'nodes' }"
                v-model="item.value"
                @change="item.real !== false && getList(1)"
                :placeholder="item.placeholder || item.label"
                size="mini"
              ></el-cascader>
              <!-- 地区筛选end -->
              <!-- 搜索框 -->
              <el-input
                v-if="item.type == 'search'"
                v-model="item.value"
                :placeholder="item.placeholder || item.label"
                size="mini"
                @input="item.input && item.input($event)"
                @keyup.enter.native="getList(1)"
              ></el-input>
              <el-button
                v-if="item.type == 'search' && (item.showBt !== undefined ? item.showBt : true)"
                type="primary"
                @click="getList(1)"
                size="mini"
                class="el-icon-search"
                style="margin-left:4px"
              ></el-button>
              <el-button v-if="item.showSelectButton" size="mini" type="primary" @click="getList(1)" style="margin-left:4px">查询</el-button>
              <!-- 搜索框end -->
            </div>
          </div>
          <!-- 筛选器end -->
          <!-- 表单操作 -->
          <div class="handle">
            <el-button
              v-if="allowAdd"
              type="primary"
              size="mini"
              @click="
                formType = 'add'
                $set(form, 'enableEdit', true)
                formShow = true
                form.onBeforeAddShow && form.onBeforeAddShow.call(form)
              "
              >{{ addDescription }}</el-button
            >
            <el-button v-if="allowDelete && tableCheckdData.length" size="mini" type="danger" icon="el-icon-delete" @click="handleTableDeleteMultiple">
              <span>删除选中&nbsp;</span>
              <span v-text="tableCheckdData.length ? tableCheckdData.length : ''"></span>
            </el-button>
            <el-button
              v-if="allowExport && tableCheckdData.length"
              type="primary"
              size="mini"
              class="iconfont iconfont-excel"
              @click="JSONToExcelConvertor(tableCheckdData, uuid())"
              >导出选中数据</el-button
            >
            <el-button v-if="allowExport" type="primary" size="mini" class="iconfont iconfont-excel" @click="AllExcelExport(1)">导出Excel</el-button>
            <el-button size="mini" class="el-icon-refresh" @click="getList()">刷新</el-button>

            <!-- 控制台自定义块 -->
            <slot name="control"></slot>
          </div>
          <!-- 表单操作end -->
        </div>
      </template>
      <!-- 表格 -->
      <common-table
        ref="tableControl"
        :tableData="tableData"
        :tableLabel="tableLabel"
        :config="tableConfig"
        :allowEdit="allowEdit"
        :allowDelete="allowDelete"
        :showControl="showControl"
        :showControlEdit="showControlEdit"
        :showControlDel="showControlDel"
        :bind-buttons="bindButtons"
        :paginationShow="paginationShow"
        @add="addChild"
        @edit="showEditForm"
        @del="del"
        @changePage="getList"
        @sizeChange="
          tableConfig.limit = $event
          getList(1)
        "
        @bindButtonClick="$emit('bindButtonClick', $event)"
        @row-click="$emit('row-click', $event)"
        @checked="
          rows => {
            this.tableCheckdData = rows
          }
        "
        @getList="getList(1)"
        @detailsView="showEditForm($event, false)"
      ></common-table>
      <!-- 表格end -->
    </el-card>
  </div>
</template>

<script>
import commonTable from './CommonTable'
import commonForm from './CommonForm'
export default {
  data() {
    return {
      // 加载
      loading: false,
      formLoading: false,
      // 表单配置
      formShow: false,
      formType: 'add',
      // 表单数据及其配置项目
      form: this.formConfig,
      // token
      token: this.$store.state.user.token,
      // 表格配置
      tableConfig: {
        page: 1,
        limit: 10,
        total: 1,
        formType: this.formConfig.tableType,
        tableTreeConfig: this.formConfig.tableTreeConfig ? this.formConfig.tableTreeConfig : {},
        controlWidth: this.formConfig.tableControlWidth
      },
      // 表格内容
      tableData: [],
      // 表格选中内容
      tableCheckdData: [],
      // 表格列信息
      tableLabel: [],
      // 地区选择器配置
      area: {
        // 地区树
        tree: this.$customAreaTree
      },

      // 详情展示
      rowDetailsShow: false
    }
  },
  props: {
    // 表单配置项
    formConfig: Object,
    // 添加操作接口
    addUrl: {
      type: String,
      default: null
    },
    // 添加按钮描述
    addDescription: {
      type: String,
      default: '新增'
    },
    // 删除操作接口地址
    delUrl: {
      type: String,
      default: null
    },
    // 删除操作配置
    delConfig: {
      type: Object,
      default: () => ({
        // id传递方式,path:路径传递,query:url参数传递
        method: 'path',
        params: {}
      })
    },
    // 编辑操作接口
    editUrl: {
      type: String,
      default: null
    },
    // 模糊搜索接口
    searchUrl: String,
    // 筛选器
    filters: {
      type: Object,
      default: () => ({})
    },
    // 获取详情的标识,默认为id
    detailsIdKey: {
      type: String,
      default: 'id'
    },
    // 允许新增
    allowAdd: {
      type: Boolean,
      default: true
    },
    // 允许编辑
    allowEdit: {
      type: Boolean,
      default: true
    },
    // 允许删除
    allowDelete: {
      type: Boolean,
      default: true
    },
    // 允许导出表单
    allowExport: {
      type: Boolean,
      default: false
    },
    // 显示操作
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
    // 显示分页组件
    paginationShow: {
      type: Boolean,
      default: true
    },
    // 绑定按钮组
    bindButtons: Array
  },
  computed: {
    showFilters() {
      return Object.keys(this.filters).filter(filed => this.filters[filed].show != false).length
    }
  },
  watch: {
    // 监听模糊搜索接口变动,从新调用getList
    searchUrl() {
      this.getList(1)
    }
  },
  methods: {
    /* *
     * 添加条目
     * * */
    add(data) {
      /* *
       * 查看是否有自定义方法,若有则执行自定义方法,并传递一下参数
       * @param data: 表单数据
       * @param flush: 刷新表单数据
       * * */
      if (this.form.customCreate) {
        this.form.customCreate.call(this, data, err => {
          if (!err) {
            this.getList(1)
            this.formShow = false
          } else {
            this.$message.error(err)
          }
          this.formLoading = false
        })
        return
      }
      /* *
       * 不存在自定义方法,则执行默认操作
       * * */
      if (this.form.contentType == 'application/x-www-form-urlencoded') {
        data = this.$qs.stringify(data)
      }
      let reqData = data
      this.$http.post(this.addUrl, data).then(({ code, message, data }) => {
        if (code === 0) {
          this.getList(1)
          this.$message.success(this.addDescription + '成功')
          // 存在监听方法则执行监听方法
          this.form.onCreated && this.form.onCreated.call(this, data, reqData)
          // 隐藏表单
          this.formShow = false
        } else {
          this.$message.error(message)
        }
        this.formLoading = false
      })
    },

    /* *
     * 删除表格内容
     * * */
    del({ id }) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          /* *
           * 查看是否有自定义方法,若有则执行自定义方法,并传递一下参数
           * @param data: 表单数据
           * @param flush: 刷新表单数据
           * * */
          if (this.form.customDelete) {
            this.form.customDelete.call(this, id, err => {
              if (!err) {
                this.getList(1)
              } else {
                this.$message.error(err)
              }
            })
            return
          }
          /* *
           * 不存在自定义方法,则执行默认操作
           * * */
          let url = this.delUrl || this.delConfig.url
          let params = JSON.parse(JSON.stringify(this.delConfig.params || {}))
          if (this.delConfig.method === 'query') {
            params.id = id
          } else {
            url += `/${id}`
          }
          this.$http
            .delete(url, {
              params
            })
            .then(({ code }) => {
              if (code === 0) {
                this.getList(1)
                this.$message.success('当前条目已成功删除')
              } else {
                this.$message.error('删除失败')
              }
            })
        })
        .catch(error => {
          if (error) {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          }
        })
    },

    /* *
     * 批量删除选中的表格内容
     * * */
    handleTableDeleteMultiple() {
      this.$confirm('此操作将删除所有选中数据, 是否继续?', '警告', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // Promise异步删除装载到数组
          Promise.all(
            // 遍历选中的表格数据,并返回删除请求的Promise数组
            this.tableCheckdData.map(item => {
              let promise = null
              // 存在自定义删除方法
              if (this.form.customDelete) {
                promise = new Promise((resolve, reject) => {
                  this.form.customDelete(item.id, state => {
                    if ([null, undefined, NaN, true].includes(state)) {
                      // 请求成功返回Promise成功状态
                      resolve({
                        id: item.id,
                        state: true
                      })
                    } else {
                      // 请求失败返回Promise失败状态
                      reject({
                        id: item.id,
                        state: false
                      })
                    }
                  })
                })
              }
              // 不存在自定义删除方法
              else {
                promise = new Promise(resolve => {
                  let url = this.delUrl || this.delConfig.url
                  let params = JSON.parse(JSON.stringify(this.delConfig.params || {}))
                  if (this.delConfig.method === 'query') {
                    params.id = item.id
                  } else {
                    url += `/${item.id}`
                  }
                  // 发送删除请求
                  this.$http
                    .delete(url, {
                      params
                    })
                    .then(({ code }) => {
                      if (code === 0) {
                        // 请求成功返回Promise成功状态
                        resolve({
                          id: item.id,
                          state: true
                        })
                      } else {
                        // 请求失败返回Promise失败状态
                        resolve({
                          id: item.id,
                          state: false
                        })
                      }
                    })
                    .catch(err => {
                      // 如遇异常返回Promise失败状态
                      if (err)
                        resolve({
                          id: item.id,
                          state: false
                        })
                    })
                })
              }
              return promise
            })
          )
            // 所有请求均已完成
            .then(result => {
              // 刷新表格
              this.getList(1)
              // 弹出结果
              let err = result.filter(item => !item.state)
              if (!err.length) {
                this.$message.success('选中条目均已删除')
              } else {
                err.forEach(item => {
                  this.$message.error(`id: ${item.id} 删除失败`)
                })
              }
            })
            .catch(err => {
              if (err) this.$message.error('请求失败,网络错误')
            })
        })
        .catch(() => this.$message('已取消删除'))
    },

    /* *
     * 添加子项
     * * */
    addChild(row) {
      this.form.onBeforeAddShow && this.form.onBeforeAddShow.call(this.form)
      // 是否可编辑
      this.$set(this.form, 'enableEdit', true)
      this.formShow = true
      this.formType = 'add'
      let timer = setTimeout(() => {
        this.form.data[
          this.formConfig.tableTreeConfig && this.formConfig.tableTreeConfig.props && this.formConfig.tableTreeConfig.props.parentId
            ? this.formConfig.tableTreeConfig.props.parentId
            : 'parentId'
        ] = row.id
        clearTimeout(timer)
      }, 0)
    },

    /* *
     * 修改表格内容
     * * */
    // 显示修改表单并填充已有表单
    showEditForm(row, enableEdit = true) {
      // 触发钩子
      this.form.onBeforeEditShow && this.form.onBeforeEditShow.call(this.form, row)

      // 设置表单模式为修改
      this.formType = 'edit'

      // 是否可编辑
      this.$set(this.form, 'enableEdit', enableEdit)

      // 开启加载遮罩
      this.formLoading = true

      // 获取行数据
      row = JSON.parse(JSON.stringify(row))

      // 显示表单
      this.formShow = true
      // 配置表单内容是否可修改
      Object.keys(this.form.label).forEach(key => {
        // 编辑模式
        if (enableEdit) {
          this.form.label[key].disabled = !(this.form.label[key].allowReset !== undefined ? this.form.label[key].allowReset : true)
        }
        // 阅读模式
        else {
          this.$set(
            this.form.label[key],
            'disabled',
            ['project', 'garbageStation', 'uploadImg', 'uploadImgs', 'map', 'area', 'organization', 'menu', 'permission', 'dict'].includes(
              this.form.label[key].type
            )
              ? true
              : false
          )
        }
      })
      // 根据id获取详细信息
      this.$http
        .get(`${this.delUrl}/${row[this.detailsIdKey]}`)
        .then(({ code, data }) => {
          if (code === 0) {
            this.$refs.commonForm.formFill(Object.assign(row, data))
          } else {
            this.$refs.commonForm.formFill(row)
          }
          this.formLoading = false
        })
        .catch(err => {
          if (err) {
            this.$refs.commonForm.formFill(row)
            this.formLoading = false
          }
        })
    },
    // 修改提交
    edit(data) {
      // 参数装填
      let params = Object.assign(this.form.originData, data)

      /* *
       * 查看是否有自定义方法,若有则执行自定义方法,并传递一下参数
       * @param data: 表单数据
       * @param flush: 刷新表单数据
       * * */
      if (this.form.customEdit) {
        this.form.customEdit.call(this, params, err => {
          if (!err) {
            this.getList(1)
            this.formShow = false
          } else {
            this.$message.error(err)
          }
          this.formLoading = false
        })
        return
      }
      /* *
       * 不存在自定义方法,则执行默认操作
       * * */
      if (this.form.contentType == 'application/x-www-form-urlencoded') {
        params = this.$qs.stringify(params)
      }
      this.$http.put(this.editUrl, params).then(({ code, message }) => {
        // 判断请求结果,请求成功刷新表格
        if (code === 0) {
          this.getList(1)
          this.$message.success('修改成功')
          // 隐藏表单
          this.formShow = false
        } else {
          this.$message.error('修改失败 ' + message)
        }
        this.formLoading = false
      })
    },

    /* *
     * 初始化表单
     * * */
    formInit() {
      Object.keys(this.form.label).forEach(key => {
        this.$set(this.form.label[key], 'disabled', false)
      })
      if (this.$refs.commonForm) {
        this.$refs.commonForm.formInit()
      }
    },

    /* *
     * 取消表单编辑
     * * */
    cancel() {
      // 隐藏表单
      this.formShow = false
    },

    /* *
     * 表单提交
     * * */
    submit() {
      // 触发提交按钮监听事件
      let isBreak = false
      this.form.onBeforeSubmit &&
        this.form.onBeforeSubmit(() => {
          isBreak = true
        })
      if (isBreak) return

      this.formLoading = true
      // 验证输入内容是否全都正确
      this.$refs.commonForm.$refs.ruleForm.validate(valid => {
        // 内容正确,提交
        let params = JSON.parse(JSON.stringify(this.form.data))
        if (valid) {
          // 删除假数据
          Object.keys(this.form.label).forEach(key => {
            if (!(this.form.label[key].real === undefined ? true : this.form.label[key].real)) {
              if (this.form.originData) {
                delete this.form.originData[key]
              }
              delete params[key]
            }
          })
          // 判断是新建还是修改数据
          if (this.formType === 'add') this.add(params)
          else if (this.formType === 'edit') this.edit(params)
        }
        // 内容格式错误
        else {
          this.$message.error('提交驳回,内容格式不正确')
          this.formLoading = false
          return false
        }
      })
    },

    /* *
     * 请求表格内容
     * @param page: 页数
     * @param limit: 内容长度
     * * */
    getList(page = this.tableConfig.page) {
      // 打开加载动画
      this.loading = true
      // 请求参数
      let params = {
        limit: this.tableConfig.limit,
        page: page
      }
      // 添加筛选器
      Object.keys(this.filters).forEach(key => {
        if (this.filters[key].real !== false) {
          params[key] = this.filters[key].value
        }
      })
      // 请求展示内容
      this.$http
        .get(this.searchUrl, {
          params: params
        })
        .then(res => {
          if (res.code !== 0) {
            this.$message.error('表格内容请求失败')
            return
          } else {
            // 刷新表格数据
            let result = res.data.records || res.data
            /* *
             * 判断是树形还是表格,表格则提取对象中的子对象
             * * */
            if (this.form.tableType !== 'menu') {
              result.forEach((item, index) => {
                Object.keys(item).forEach(key => {
                  if (item[key] && /Object]$/.test(item[key].toString())) {
                    // 判断值是否为对象
                    Object.keys(item[key]).forEach(_key => {
                      result[index][key + '_' + _key] = item[key][_key]
                    })
                  }
                })
              })
            }
            this.tableData = result
            // 获取表格当前索引号
            this.tableConfig.page = parseInt(res.data.current) || 1
            // 获取表格页数
            this.tableConfig.total = parseInt(res.data.total) || res.data.length
          }

          // 关闭加载动画
          this.loading = false
        })
    },

    /* *
     * 初始化表格信息
     * * */
    tableInit() {
      // 查看表单操作对象中的label是否存在,不存在则新建
      !this.form.label && this.$set(this.form, 'label', {})
      // 查看表单操作对象中是否声明表格排序
      let sortKey = this.form.tableSort || Object.keys(this.form.label)
      this.tableLabel = []
      sortKey.forEach(key => {
        let show = this.form.label[key].colShow === undefined ? true : this.form.label[key].colShow
        if (show) {
          this.tableLabel.push({
            prop: key,
            label: this.form.label[key].label,
            colLabel: this.form.label[key].colLabel,
            width: this.form.label[key].width || 100,
            colType: this.form.label[key].colType ? this.form.label[key].colType : '',
            type: this.form.label[key].type,
            editButton: this.form.label[key].editButton,
            target: this.form.label[key]
          })
        }
      })
    },

    /* *
     * 表格导出Excel
     * * */
    JSONToExcelConvertor(JSONData, FileName) {
      // 查看JSON长度是否为零
      if (!JSONData.length) return
      //先转化json
      let arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData
      let excel = '<table>'
      let row = '<tr>'
      //设置表头
      let keys = Object.keys(JSONData[0])
      // 序号
      row += '<td>序号</td>'
      keys.forEach(key => {
        // 判断当前列是否允许导出
        if (this.form.label[key] && (this.form.label[key].allowExport !== undefined ? this.form.label[key].allowExport : true)) {
          row += '<td>' + this.form.label[key].label + '</td>'
        }
      })
      //换行
      excel += row + '</tr>'
      //设置数据
      arrData.forEach((arr, rowIndex) => {
        let row = '<tr>'
        // 序号
        row += `<td>${rowIndex + 1}</td>`
        Object.keys(arr).forEach(key => {
          // 判断当前列是否允许导出
          if (this.form.label[key] && (this.form.label[key].allowExport !== undefined ? this.form.label[key].allowExport : true)) {
            row += '<td>' + (arr[key] !== null ? arr[key] : '') + '</td>'
          }
        })
        excel += row + '</tr>'
      })

      excel += '</table>'

      let excelFile =
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"
      excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
      excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel'
      excelFile += '; charset=UTF-8">'
      excelFile += '<head>'
      excelFile += '<!--[if gte mso 9]>'
      excelFile += '<xml>'
      excelFile += '<x:ExcelWorkbook>'
      excelFile += '<x:ExcelWorksheets>'
      excelFile += '<x:ExcelWorksheet>'
      excelFile += '<x:Name>'
      excelFile += '{worksheet}'
      excelFile += '</x:Name>'
      excelFile += '<x:WorksheetOptions>'
      excelFile += '<x:DisplayGridlines/>'
      excelFile += '</x:WorksheetOptions>'
      excelFile += '</x:ExcelWorksheet>'
      excelFile += '</x:ExcelWorksheets>'
      excelFile += '</x:ExcelWorkbook>'
      excelFile += '</xml>'
      excelFile += '<![endif]-->'
      excelFile += '</head>'
      excelFile += '<body>'
      excelFile += excel
      excelFile += '</body>'
      excelFile += '</html>'

      let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile)

      let link = document.createElement('a')
      link.href = uri

      link.style = 'visibility:hidden'
      link.download = FileName + '.xls'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 导出所有数据
    AllExcelExport(page = 1, exportData = [], repeatRequestTime = 0) {
      this.$http
        .get(this.searchUrl, {
          params: {
            limit: 400,
            page: page++
          }
        })
        .then(({ code, data }) => {
          // 当前分页还存在内容
          if (data && (data.records.length || data.length)) {
            exportData = exportData.concat(data.records || data)
            this.AllExcelExport(page, exportData)
          } else {
            // 当前分页内容为空且请求成功,则导出excel
            if (code === 0) {
              if (exportData.length) {
                this.JSONToExcelConvertor(exportData, this.uuid())
              }
            }
            // 当前分页请求失败则重复请求,5次请求失败则停止继续操作并抛异常
            else {
              if (repeatRequestTime >= 4) {
                this.$message.error('服务器异常,未能导出所有数据')
                if (exportData.length) {
                  this.JSONToExcelConvertor(exportData, this.uuid())
                }
              } else {
                this.AllExcelExport(--page, exportData, ++repeatRequestTime)
              }
            }
          }
        })
    },

    /* *
     * 表单下拉搜索框事件
     * @param query:输入的值
     * @param target:筛选器配置对象
     * * */
    handleFormSearch(query, target) {
      // 如果自定义搜索方法存在则直接调用自定义方法
      if (target.search) {
        target.search(query)
        return
      }
      // 无自定义搜索方法则继续执行默认操作
      let props = target.props || {}
      let params = {
        page: 1,
        limit: 6
      }
      params[props.search || 'name'] = query
      this.$http
        .get(target.url, {
          params
        })
        .then(({ code, data }) => {
          let result = []
          if (code === 0) {
            result = data.records || data
            result = result.map(item => ({
              code: item[props.code ? props.code : 'id'],
              label: item[props.label ? props.label : 'name']
            }))
          } else result = []
          this.$set(target, 'item', result)
        })
    }
  },
  created() {
    // 初始化表格列信息
    this.tableInit()
    // 请求表格内容
    if (this.searchUrl && this.searchUrl.length) {
      this.getList(1)
    }
  },
  components: {
    commonTable,
    commonForm
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';

.manage {
  @flex-column();

  // 控制头
  .control {
    margin: -10px 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .filter-wrap {
      display: block;

      & > * {
        display: flex;
        float: left;
        align-items: center;
        margin: 4px 4px 4px 0;
        .label {
          margin-right: 8px;
          font-size: 13px;
          color: #888;
          white-space: nowrap;
        }
      }
    }
  }

  // 表格
  .card-container {
    height: 100%;
    @flex-column();
  }

  /* *
  * 表单
  * */
  .dialog {
    position: absolute;
    background-color: rgba(34, 34, 34, 0.8);

    .form-dialog {
      .map-baidu {
        height: 300px;

        .map-baidu-view {
          margin-top: 10px;
          width: 100%;
          height: 100%;
          flex: 1;
        }
      }
    }
  }

  // 分页器
  .pagination {
    display: flex;
    justify-content: center;
  }

  // 上传图片
  .avatar-uploader {
    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>

<style lang="less">
.common-table-control-form-dialog {
  & > .el-dialog__body {
    padding: 0;
    .form-container {
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      max-height: 7.6rem;
    }
  }
}
</style>
