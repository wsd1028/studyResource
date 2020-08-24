<template>
  <!-- 表单 -->
  <el-form
    class="common-form"
    :class="['left', 'right', undefined].includes(form.labelPosition) ? 'no-wrap' : 'wrap'"
    :model="form.data"
    status-icon
    :rules="form.rules"
    ref="ruleForm"
    size="mini"
    :inline="true"
    :label-position="form.labelPosition || 'left'"
  >
    <el-row :gutter="form.gutter ? form.gutter : 40">
      <el-col
        v-for="(item, key) in form.label"
        :key="key"
        :offset="item.offset"
        :pull="item.pull"
        :push="item.push"
        :lg="item.span ? item.span : 12"
        :xl="item.span ? item.span : 8"
        v-show="item.show === undefined ? true : item.show"
        :style="item.style || {}"
      >
        <!-- 标题块 -->
        <div v-if="item.type == 'title'">
          <div v-if="item.label" style="display:flex;align-items:stretch;padding:30px 0 20px 0">
            <span style="width:6px;background-color:#4186f4"></span>
            <h3 v-html="item.label" style="padding:0;margin:0 0 0 4px"></h3>
          </div>
        </div>
        <!-- 表单组件 -->
        <el-form-item
          :ref="`form-item-${key}`"
          v-else-if="item.show === undefined ? true : item.show"
          :label="item.label"
          :prop="key"
          :label-width="item.labelWidth || form.labelWidth || '100px'"
          :error="item.error"
        >
          <!-- 数字类型 -->
          <el-input
            v-if="item.type === 'number'"
            v-model="form.data[key]"
            @input="
              form.data[key] = $event.toString().replace(/[^\d\.]|\..*\./g, '')
              enableEdit(key)
            "
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          >
            <template v-if="item.beforeUnit" slot="prepend">{{ item.beforeUnit }}</template>
            <template v-if="item.unit" slot="append">{{ item.unit }}</template>
          </el-input>
          <!-- 多选框/复选框 -->
          <div v-else-if="item.type === 'checked'">
            <el-checkbox-group
              v-model="form.data[key]"
              :disabled="item.disabled"
              @change="
                data => {
                  item.change ? item.change(data) : null
                  enableEdit(key)
                }
              "
            >
              <el-checkbox v-for="(item, i) in item.item" :key="i" :label="item.code">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!-- 下拉框类型 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form.data[key]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            @change="enableEdit(key)"
          >
            <el-option
              v-for="(_item, key) in item.item"
              :key="key"
              :label="_item[(item.props && item.props.label) || 'label']"
              :value="_item[(item.props && item.props.code) || 'code']"
              @click.native="item.change && item.change(_item[(item.props && item.props.code) || 'code'], _item)"
            ></el-option>
          </el-select>
          <!-- 单选框 -->
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="form.data[key]"
            :disabled="item.disabled"
            @change="
              item.change && item.change($event)
              enableEdit(key)
            "
          >
            <el-radio-button v-for="(item, key) in item.item" :key="key" :label="item.code">{{ item.label }}</el-radio-button>
          </el-radio-group>
          <!-- 时间类型 -->
          <el-time-picker
            v-else-if="item.type == 'time'"
            v-model="form.data[key]"
            :format="item.format || 'HH时mm分ss秒'"
            :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
            :placeholder="item.placeholder || '请输入日期'"
            :disabled="item.disabled"
            @change="enableEdit(key)"
          >
          </el-time-picker>
          <!-- 日期类型 -->
          <el-date-picker
            v-else-if="item.type == 'date'"
            v-model="form.data[key]"
            :type="item.dataType || 'datetime'"
            :format="item.format || 'yyyy年MM月dd日 HH时mm分ss秒'"
            :value-format="item.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
            :placeholder="item.placeholder || '请输入日期'"
            :disabled="item.disabled"
            @change="enableEdit(key)"
          ></el-date-picker>
          <!-- 下拉搜索框 -->
          <el-select
            v-else-if="item.type == 'search'"
            v-model="form.data[key]"
            filterable
            remote
            :placeholder="item.placeholder"
            :remote-method="query => $debounce(() => handleFormSearch(query, key, item), 500)()"
            :disabled="item.disabled"
            @focus="
              $debounce(() => {
                if (!item.item) $set(item, 'item', [])
                if (item.item.length == 0) {
                  handleFormSearch('', key, item)
                }
              }, 500)()
            "
            @change="
              val => {
                if (item.target) {
                  $set(form.data, item.target, val)
                }
                item.change ? item.change(val) : null
                enableEdit(key)
              }
            "
          >
            <el-option
              v-for="_item in item.item"
              :key="_item.code"
              :label="_item[(item.props && item.props.label) || 'label']"
              :value="_item[(item.props && item.props.code) || 'code']"
            ></el-option>
          </el-select>
          <!-- 企业选择器 -->
          <el-input
            v-else-if="item.type == 'company'"
            v-model="form.data[key]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            @input="$set(item, 'error', '')"
            @keyup.enter.native="getCompanyInfo(form.data[key], key)"
            @blur="getCompanyInfo(form.data[key], key)"
            @change="enableEdit(key)"
          >
            <el-button
              slot="append"
              :icon="getCompanyInfoIcon"
              @click="getCompanyInfo(form.data[key], key)"
              @dblclick.native="getCompanyInfo(form.data[key], key, 1)"
            >
              {{ '获取详情' }}
            </el-button>
          </el-input>
          <!-- 项目选择器 -->
          <choose-project
            :ref="key"
            v-else-if="item.type == 'project'"
            :props="item.props ? item.props : {}"
            v-model="form.data[key]"
            :area="item.area"
            :disabled="item.disabled"
            :clear-validate="
              () => {
                $refs[`form-item-${key}`] && $refs[`form-item-${key}`][0].clearValidate()
              }
            "
            @change="
              data => {
                item.target ? (form.data[item.target] = data.id) : null
                item.change ? item.change.call(form, data) : null
                enableEdit(key)
              }
            "
          />
          <!-- 消纳站选择器 -->
          <choose-garbage-station
            :ref="key"
            v-else-if="item.type == 'garbageStation'"
            :props="item.props ? item.props : {}"
            v-model="form.data[key]"
            :disabled="item.disabled"
            :clear-validate="
              () => {
                $refs[`form-item-${key}`] && $refs[`form-item-${key}`][0].clearValidate()
              }
            "
            @change="
              data => {
                item.target ? (form.data[item.target] = data.id) : null
                item.change ? item.change.call(form, data) : null
                enableEdit(key)
              }
            "
          />
          <!-- 设备厂商选择器 -->
          <choose-manufacturer
            :ref="key"
            v-else-if="item.type == 'manufacturer'"
            :props="item.props ? item.props : {}"
            v-model="form.data[key]"
            :disabled="item.disabled"
            :clear-validate="
              () => {
                $refs[`form-item-${key}`] && $refs[`form-item-${key}`][0].clearValidate()
              }
            "
            @change="
              data => {
                item.target ? (form.data[item.target] = data.id) : null
                item.change ? item.change(data) : null
                enableEdit(key)
              }
            "
          />
          <!-- 设备厂商选择器 -->
          <choose-agent
            :ref="key"
            v-else-if="item.type == 'agent'"
            :props="item.props ? item.props : {}"
            v-model="form.data[key]"
            :disabled="item.disabled"
            :clear-validate="
              () => {
                $refs[`form-item-${key}`] && $refs[`form-item-${key}`][0].clearValidate()
              }
            "
            @change="
              data => {
                item.target ? (form.data[item.target] = data.id) : null
                item.change ? item.change(data) : null
                enableEdit(key)
              }
            "
          />
          <!-- 文件上传 -->
          <el-upload
            :ref="key"
            v-else-if="item.type == 'uploadFile'"
            v-show="!item.disabled"
            drag
            :file-list="item.fileList || []"
            :name="item.name || 'files'"
            :headers="{ token: token }"
            :action="item.url"
            :before-upload="
              file => {
                item.before && item.before(file)
              }
            "
            :on-success="
              ({ data }) => {
                $set(form.data, key, data[0].id || data[0])
                item.success && item.success.call(form, data[0])
              }
            "
            :on-preview="
              file => {
                item.onPreview && item.onPreview(file)
              }
            "
            :on-remove="
              (file, fileList) => {
                item.onRemove && item.onRemove(file, fileList)
              }
            "
            :limit="item.limit"
            v-model="form.data[key]"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <!-- 图片上传 -->
          <el-upload
            v-else-if="item.type == 'uploadImg'"
            :disabled="item.disabled"
            class="avatar-uploader"
            :name="item.name || 'files'"
            :action="item.url || ''"
            :show-file-list="false"
            :on-success="
              res => {
                $set(form.data, key, res.data[0] || res.data)
                item.success
                  ? item.success({
                      code: res.code,
                      data: res.data[0] || res.data
                    })
                  : null
              }
            "
            :before-upload="
              file => {
                item.before && item.before(file)
              }
            "
            :headers="{ token: token }"
            @change="enableEdit(key)"
          >
            <img v-if="form.data[key]" :src="$store.state.config.convertImgUrl(form.data[key], item.HBase)" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- 多张图片/视频上传 -->
          <div class="uploadImgs" v-else-if="item.type == 'uploadImgs'">
            <el-upload
              :ref="key"
              size="mini"
              list-type="picture-card"
              :limit="item.limit !== undefined ? item.limit : 10"
              :name="item.name ? item.name : 'files'"
              :disabled="item.disabled"
              :action="item.url"
              :before-upload="file => handlePictureCardBefore(file, item)"
              :on-success="
                (response, file, fileList) => {
                  handlePictureCardChange(fileList, key)
                  item.success ? item.success(response, file, fileList) : null
                }
              "
              :on-remove="
                (file, fileList) => {
                  handlePictureCardChange(fileList, key)
                }
              "
              :file-list="uploadImgs.fileList[key]"
              :on-preview="handlePictureCardPreview"
              :headers="{ token: token }"
              @change="enableEdit(key)"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog append-to-body :show-close="false" :visible.sync="uploadImgs.dialogVisible">
              <div slot="title" style="height:30vh"></div>
              <div slot="footer" style="height:30vh"></div>
              <!-- 图片展示 -->
              <img
                v-if="/^image/.test(uploadImgs.dialogImageType)"
                :src="uploadImgs.dialogImageUrl"
                width="100%"
                height="100%"
                style="position:absolute;top:0;left:0"
              />
              <!-- 视频展示 -->
              <video
                v-if="/^video/.test(uploadImgs.dialogImageType)"
                controls
                muted
                :src="uploadImgs.dialogImageUrl"
                width="100%"
                height="100%"
                style="position:absolute;top:0;left:0"
              />
            </el-dialog>
          </div>
          <!-- 百度地图选择器 -->
          <form-map-location
            v-else-if="item.type == 'map'"
            :form-config="form"
            :field="key"
            :item="item"
            v-model="form.data[key]"
            :clear-validate="
              () => {
                $refs[`form-item-${key}`] && $refs[`form-item-${key}`][0].clearValidate()
              }
            "
          />
          <!-- 地区选择器 -->
          <el-cascader
            v-else-if="item.type == 'area'"
            separator="-"
            :options="item.areaTree || area.tree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: item.props && item.props.code ? item.props.code : 'id',
              label: item.props && item.props.label ? item.props.label : 'name',
              children: 'nodes'
            }"
            @change="item.change ? item.change($event) : null"
            :disabled="item.disabled"
            v-model="form.data[key]"
          ></el-cascader>
          <!-- 组织机构选择器 -->
          <el-cascader
            :ref="key"
            v-else-if="item.type == 'organization'"
            :options="organization.tree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'name'
            }"
            :disabled="item.disabled"
            v-model="form.data[key]"
            @focus="getOrganizationTree()"
            @change="
              data => {
                let node = $refs[key][0].getCheckedNodes()[0]
                item.change ? item.change.call(form, data, (node && node.data) || null) : null
              }
            "
          ></el-cascader>
          <!-- 菜单选择器 -->
          <el-cascader
            v-else-if="item.type == 'menu'"
            :options="menu.tree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'id'
            }"
            :disabled="item.disabled"
            v-model="form.data[key]"
            @focus="getMenuTree()"
          ></el-cascader>
          <!-- 权限选择器 -->
          <el-cascader
            v-else-if="item.type == 'permission'"
            :options="permission.tree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'name'
            }"
            :disabled="item.disabled"
            v-model="form.data[key]"
            @focus="getPermissionTree()"
          ></el-cascader>
          <!-- 字典表选择器 -->
          <el-cascader
            v-else-if="item.type == 'dict'"
            :options="dict.tree"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'id',
              label: 'name',
              children: 'list'
            }"
            :disabled="item.disabled"
            v-model="form.data[key]"
            @focus="getDictTree()"
          ></el-cascader>
          <!-- 多行文本输入框 -->
          <el-input
            v-else-if="item.type == 'textarea'"
            type="textarea"
            :rows="item.rows ? item.rows : 2"
            :maxlength="item.maxlength ? item.maxlength : 600"
            :show-word-limit="!!item.maxlength"
            v-model="form.data[key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            @input="enableEdit(key)"
          ></el-input>
          <!-- 富文本编辑器 -->
          <vue-editor
            v-else-if="item.type == 'editor'"
            v-model="form.data[key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
            :useCustomImageHandler="true"
            @image-added="handleEditorImageUpload"
            style="height:400px;margin-bottom:48px;"
            @input="enableEdit(key)"
          ></vue-editor>
          <!-- 密码输入框 -->
          <el-input
            v-else-if="item.type == 'password'"
            show-password
            v-model="form.data[key]"
            :disabled="item.disabled"
            @focus="item.focus && item.focus.call(form, $event)"
            @input="enableEdit(key)"
            @blur="enableEdit(key)"
          ></el-input>
          <!-- 文本输入框 -->
          <el-input
            v-else
            v-model="form.data[key]"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
            @input="
              item.input && item.input(form.data[key])
              enableEdit(key)
            "
            @focus="item.focus && item.focus.call(form, $event)"
            @blur="item.blur && item.blur(form.data[key], $event)"
            @keyup.enter.native="item.keyup && item.keyup(form.data[key], $event)"
          >
            <template v-if="item.beforeUnit" slot="prepend">
              {{ item.beforeUnit }}
            </template>
            <el-button
              v-if="item.beforeUnitButton"
              :type="item.theme ? item.theme : 'info'"
              slot="prepend"
              @click="item.clickBeforeUnit && item.clickBeforeUnit()"
              :icon="item.iconBeforeUnit"
              style="background-color:#409EFF"
            >
              {{ item.beforeUnit }}
            </el-button>
            <template v-if="item.unit" slot="append">
              {{ item.unit }}
            </template>
            <el-button
              v-if="item.unitButton"
              :type="item.theme ? item.theme : 'info'"
              slot="append"
              @click="item.clickUnit && item.clickUnit(form.data[key])"
              :icon="item.iconUnit"
            >
              {{ item.unitButton }}
            </el-button>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import ChooseGarbageStation from './ChooseGarbageStation'
import ChooseProject from './ChooseProject'
import ChooseManufacturer from './ChooseManufacturer'
import ChooseAgent from './ChooseAgent'
import FormMapLocation from './FormMapLocation'
export default {
  data() {
    return {
      token: this.$store.state.user.token,
      // 地区选择器配置
      area: {
        // 地区树
        tree: [{ name: '无', id: null }].concat(
          (() => {
            let tree = {}
            this.$getAreaTree('290871061266829312', area => (tree = area || { name: '地区树加载失败', id: '-1' }))
            return tree
          })()
        )
      },
      // 组织机构选择器
      organization: {
        tree: []
      },
      // 菜单选择器
      menu: {
        tree: []
      },
      // 权限选择器
      permission: {
        tree: []
      },
      // 字典表选择器
      dict: {
        tree: []
      },
      // 表单信息
      form: this.formConfig,
      // 多图片上传配置
      uploadImgs: {
        fileList: {},
        // 预览图片/视频配置
        dialogImageUrl: '',
        dialogImageType: '',
        dialogVisible: false
      },

      /* *
       * 根据企业名称查询企业信息防抖方法
       * @param query: 搜索值
       * @param field: 当前输入框在表单对象中的键名
       * @param online: 1:直接从线上拉取数据 0:从库中拉取数据
       * * */
      getCompanyInfoIcon: 'el-icon-search',
      getCompanyInfo: this.$debounce((query, field, online = 0) => {
        if (!query || !query.length) return
        this.getCompanyInfoIcon = 'el-icon-loading'
        this.$http
          .get('/carp/business/a/q/company/aliyun', {
            params: {
              companyName: query,
              typeId: this.form.label[field].companyType,
              flag: online
            }
          })
          .then(({ code, data, message }) => {
            if (code === 0) {
              this.form.label[field].change && this.form.label[field].change.call(this, data.id, data)
              this.$message({
                offset: 280,
                type: 'success',
                message: '企业信息查询成功'
              })
              this.form.label[field].getCompanyInfo && this.form.label[field].getCompanyInfo.call(this.form, data)
              this.form.label[field].target && (this.form.data[this.form.label[field].target] = data.id)
              this.form.data[field] = data.name
              this.$set(this.form.label[field], 'error', '')
            } else {
              this.$set(this.form.label[field], 'error', message)
            }
            this.getCompanyInfoIcon = 'el-icon-search'
          })
      }, 600)
    }
  },
  props: {
    formConfig: Object
  },
  created() {
    // 参数配置
    !this.form.data && this.$set(this.form, 'data', {})
    !this.form.label && this.$set(this.form, 'label', {})
    this.formInit()
    this.setRules()
  },
  methods: {
    /* *
     * 初始化表单
     * * */
    formInit() {
      // 遍历表单填充预设初始值
      Object.keys(this.form.label).forEach(key => {
        // 清除表单报错
        this.$set(this.form.label[key], 'error', '')
        // 有预设初始值,则替换为该值
        if (![undefined, NaN].includes(this.form.label[key].default)) {
          this.$set(this.form.data, key, JSON.parse(JSON.stringify(this.form.label[key].default)))
        }
        // 无预设初始值,则替换为空字符串
        else if (this.form.label[key] != 'title') {
          this.$set(this.form.data, key, '')
        }
      })
      // 清除表单验证
      this.clearForm()
    },
    /* *
     * 清除表单缓存
     * * */
    clearForm() {
      // 清除表单验证
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
      // 遍历表单填充originData初始值
      this.$set(this.form, 'originData', {})
      // 遍历表单填充预设初始值
      Object.keys(this.form.label).forEach(key => {
        // 有预设初始值,则替换为该值
        if (![undefined, NaN].includes(this.form.label[key].default)) {
          this.$set(this.form.data, key, JSON.parse(JSON.stringify(this.form.label[key].default)))
        }
        // 无预设初始值,则替换为空字符串
        else {
          this.$set(this.form.data, key, '')
        }
        // 清除多图片上传模块的图片池及文件上传缓存
        if (['uploadImgs', 'uploadFile'].includes(this.form.label[key].type)) {
          this.$set(this.uploadImgs.fileList, key, [])
          if (this.$refs[key]) {
            Array.prototype.forEach.call(this.$refs[key], item => {
              item.clearFiles()
            })
          }
        }
        // 清除(项目,消纳站,厂商)选择器的缓存
        else if (['project', 'garbageStation', 'manufacturer'].includes(this.form.label[key].type)) {
          if (this.$refs[key]) {
            this.$refs[key][0].clear(this.form.label[key].default || null)
          }
        }
      })
    },
    /* *
     * 表单填充数据
     * @param data:要填充的数据
     * * */
    formFill(data) {
      // 保存原有数据
      this.$set(this.form, 'originData', data)

      // 填充表单
      Object.keys(this.form.label).forEach(key => {
        this.$set(this.form.data, key, [undefined, null].includes(data[key]) ? this.form.label[key].default : data[key])
        this.$set(this.form.originData, key, [undefined, null].includes(data[key]) ? this.form.label[key].default : data[key])
      })

      // 提取多图片上传模块需要用到的图片列表
      this.handlePictureCardList(this.form.originData)
    },
    /* *
     * 多图片上传钩子函数
     * * */
    // 预览按钮事件
    handlePictureCardPreview(file) {
      this.uploadImgs.dialogImageUrl = file.url
      this.uploadImgs.dialogImageType = this.$urlConvertType(file.raw ? file.raw.type : file.url)
      this.uploadImgs.dialogVisible = true
    },
    // 验证当前是否为编辑模式,若不是则还原数据
    enableEdit(key) {
      if (this.form.enableEdit === false) {
        this.form.data[key] = this.form.originData[key]
      }
    },
    /* *
     * 上传图片之前的操作钩子
     * @param file: 待上传文件
     * @param target: 表单模块对象
     * @return flag: true:上传该文件 false:阻止上传
     * * */
    handlePictureCardBefore(file, target) {
      // 是否上传文件
      let flag = true
      // 如果表单模块对象中有自定义方法,则先执行该方法
      if (target.before) {
        flag = target.before(file)
      }
      return flag
    },
    /* *
     * 多图片上传文件状态改变时
     * @param file:改变的文件
     * @param fileList:文件列表
     * @param key:表单中绑定的数据模型的key
     * * */
    handlePictureCardChange(fileList, key) {
      let files = []
      fileList.forEach((item, index) => {
        let url = ''
        if (item.response && item.response.data) {
          url = item.response.data[0] ? item.response.data[0] : item.response.data
        } else {
          url = item.url
        }
        // 添加文件到数据池
        files.push(url.replace(/^(?!http).*\//g, ''))
        // 如果为视频格式则展示用的img节点替换为video
        if (/video/.test(this.$urlConvertType(url))) {
          this.$refs[key].forEach(item => {
            let timer = setTimeout(() => {
              let imgWrapEl = item.$el.getElementsByClassName('el-upload-list__item')[index]
              imgWrapEl.removeChild(imgWrapEl.children[0])
              // 创建视频标签
              let videoEl = document.createElement('video')
              videoEl.className = 'el-upload-list__item-thumbnail'
              videoEl.src = this.$store.state.config.convertVideoUrl(url, this.form.label[key].HBase)
              imgWrapEl.insertBefore(videoEl, imgWrapEl.getElementsByClassName('el-upload-list__item-name')[0])
              clearTimeout(timer)
            }, 0)
          })
        }
      })
      this.form.data[key] = files
    },
    /* *
     * 多图片上传已有图片/视频列表获取
     * @param originData: 变动的form.originData改动前数据
     * * */
    handlePictureCardList(originData) {
      Object.keys(this.form.label).forEach(key => {
        if (this.form.label[key].type === 'uploadImgs') {
          // 返回图片或视频地址
          this.$set(
            this.uploadImgs.fileList,
            key,
            originData[key].map(item => {
              return {
                name: this.uuid(),
                url: (() => {
                  let type = this.$urlConvertType(item)
                  // 图片
                  if (/image/i.test(type)) {
                    return this.$store.state.config.convertImgUrl(item, this.form.label[key].HBase)
                  }
                  // 视频
                  else if (/video/i.test(type)) {
                    return this.$store.state.config.convertVideoUrl(item, this.form.label[key].HBase)
                  } else {
                    return item
                  }
                })()
              }
            })
          )
          // 视频格式预览img标签替换为video
          let timer = setTimeout(() => {
            let fileListEl = this.$refs[key][0].$el.getElementsByClassName('el-upload-list__item-thumbnail')
            ;[].forEach.call(fileListEl, item => {
              let parentEl = item.parentElement
              let src = item.getAttribute('src')
              if (/video/g.test(this.$urlConvertType(src))) {
                // 创建视频标签
                let videoEl = document.createElement('video')
                videoEl.className = 'el-upload-list__item-thumbnail'
                videoEl.src = src
                parentEl.removeChild(item)
                parentEl.insertBefore(videoEl, parentEl.getElementsByClassName('el-upload-list__item-name')[0])
              }
            })
            clearTimeout(timer)
          }, 0)
        }
      })
    },

    /* *
     * 富文本编辑器图片上传操作
     * * */
    handleEditorImageUpload(file, Editor, cursorLocation, resetUploader) {
      let formData = new FormData()
      formData.append('files', file)
      this.$http.post('/carp/file/a/q/file/upload/files/rich_text_image', formData).then(({ code, data }) => {
        if (code !== 4002) {
          this.$message.error('图片上传失败')
          return
        }
        /*插入路径*/
        Editor.insertEmbed(cursorLocation, 'image', this.$store.state.config.convertImgUrl(data[0]))
        resetUploader()
      })
    },

    /* *
     * 表单下拉搜索框事件
     * @param query:输入的值
     * @param key:表单数据绑定的键名
     * @param target:表单配置对象
     * * */
    handleFormSearch(query, key, target) {
      // 如果自定义搜索方法存在则直接调用自定义方法
      if (target.search) {
        target.search.call(this.form, query)
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
            /* result = result.map(item => ({
              code: item[props.code ? props.code : 'id'],
              label: item[props.label ? props.label : 'name']
            })) */
          } else result = []
          this.$set(this.form.label[key], 'item', result)
        })
    },

    /* *
     * 设置表单验证规则
     * * */
    setRules() {
      this.$set(this.form, 'rules', {})
      /* *
       * 表单验证方法
       * * */
      let validator = ({ field }, value, callback) => {
        // 获取当前项的规则对象
        let rule = this.form.label[field].rule
        // 若未配置规则,则直接通过验证
        value += ''
        if (!rule || value.search(rule.regExp) !== -1) {
          callback()
        } else {
          callback(new Error(rule.message || rule.$message))
        }
      }

      /* *
       * 装载验证
       * * */
      Object.keys(this.form.label).forEach(key => {
        this.$set(this.form.rules, key, [
          { validator, trigger: 'change' },
          {
            required: this.form.label[key].required !== undefined ? this.form.label[key].required : false,
            message: '不能为空',
            trigger: 'change'
          }
        ])
      })
    },

    /* *
     * 表单验证测试
     * * */
    formValidate(callback) {
      this.$refs.ruleForm.validate(valid => {
        callback(valid)
      })
    },

    // 获取组织机构树
    getOrganizationTree() {
      this.$http.get('/carp/auth/a/q/organization').then(({ code, data }) => {
        if (code === 0) {
          this.organization.tree = [{ name: '无', id: null }].concat(data)
        } else {
          this.$message.error('未获取到组织机构数据')
        }
      })
    },
    // 获取菜单树
    getMenuTree() {
      this.$http.get('/carp/auth/a/q/menu').then(({ code, data }) => {
        if (code === 0) {
          this.menu.tree = [{ label: '无', id: null }].concat(data)
        } else {
          this.$message.error('菜单数据获取失败')
        }
      })
    },
    // 获取权限树
    getPermissionTree() {
      this.$http.get('/carp/auth/a/q/permission').then(({ code, data }) => {
        if (code === 0) {
          this.permission.tree = [{ name: '无', id: null }].concat(data)
        } else {
          this.$message.error('菜单数据获取失败')
        }
      })
    },
    // 获取字典表树
    getDictTree() {
      this.$http.get('/carp/business/a/q/dict/tree').then(({ code, data }) => {
        if (code === 0) {
          // 去除level为2的list值
          let removeChildren = data => {
            data.forEach(item => {
              if (item.level == 2) {
                item.list = null
              } else {
                if (item.list) {
                  removeChildren(item.list)
                }
              }
            })
          }
          removeChildren(data)
          this.dict.tree = [{ name: '无', id: null }].concat(data)
        } else {
          this.$message.error('字典表树获取失败')
        }
      })
    }
  },
  components: {
    VueEditor,
    ChooseGarbageStation,
    ChooseProject,
    ChooseManufacturer,
    ChooseAgent,
    FormMapLocation
  }
}
</script>

<style lang="less">
// 表单横向布局
.common-form.no-wrap {
  // 布局样式
  .el-row {
    display: flex;
    flex-flow: row wrap;
    align-items: stretch;
    .el-form-item {
      display: inline-flex;
      flex-wrap: wrap;
      flex: none;
      margin-right: 0;
      width: 100%;
      .el-form-item__label {
        position: relative;
        flex: none;
        &::before {
          position: absolute;
          left: -8px;
        }
      }
      .el-form-item__content {
        flex: 1;
        & > div {
          width: 100%;
        }
      }
    }
  }
}

// 表单纵向布局
.common-form.wrap {
  // 布局样式
  .el-row {
    .el-form-item,
    .el-form-item__label,
    .el-form-item__content {
      width: 100%;
    }
    .el-form-item__content {
      & > * {
        width: 100%;
      }
    }
  }
}

.common-form {
  // 图片上传
  .avatar-uploader {
    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      font-size: 28px;
      color: #8c939d;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;

      &:hover {
        color: #409eff;
        border-color: #409eff;
      }
    }

    .avatar {
      width: 60px;
      height: 60px;
      display: block;
    }
  }

  .uploadImgs {
    .el-upload-list__item {
      width: 94px;
      height: 94px;
    }
    .el-upload.el-upload--picture-card {
      width: 94px;
      height: 94px;
      line-height: 94px;
    }
  }

  [_cid],
  .anchorBL {
    display: none !important;
  }
  .BMapLabel {
    padding: 6px 10px !important;
    background-color: #222222cc !important;
    border-width: 0 !important;
    border-radius: 2px !important;
    color: white !important;
    font-size: 16px !important;
    line-height: 16px !important;
    left: 50% !important;
    transform: translate(-40%, 24%) !important;
  }
}
</style>
