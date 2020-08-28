<template>
  <div style="display:flex">
    <table-control
      :form-config="form"
      add-url="/carp/business/a/q/emergency/plan/increase"
      del-url="/carp/business/a/q/emergency/plan"
      edit-url="/carp/business/a/q/emergency/plan"
      search-url="/carp/business/a/q/emergency/plan/page"
      :allow-add="tablePermission.add"
      :allow-edit="tablePermission.edit"
      :allow-del="tablePermission.del"
      :show-control-del="false"
      :show-control-edit="false"
      :filters="filters"
      :bind-buttons="[{ label: '查看详情' }]"
      @bindButtonClick="
        emergency = $event.row
        detailsShow = true
      "
    >
      <!-- 附件上传 -->
      <div slot="form">
        <el-upload
          ref="fileUploader"
          name="files"
          :headers="{ token: $store.state.user.token }"
          action="/carp/file/a/q/file/upload/files/increase_module"
          :before-upload="beforeUpload"
          :on-success="
            (res, file, fileList) => {
              fileListChange(fileList)
            }
          "
          :on-remove="
            (file, fileList) => {
              fileListChange(fileList)
            }
          "
          :file-list="fileList"
          :on-preview="
            file => {
              onPreview(file)
            }
          "
          drag
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传txt,pdf,excel,word文件，且不超过5MB</div>
        </el-upload>
      </div>
    </table-control>
    <!-- 查看详情弹窗 -->
    <el-dialog :title="emergency.title" v-if="detailsShow" :visible="true" top="10vh" width="1100px" height="100vh" @close="detailsShow = false">
      <emergency-details
        :emergency="emergency"
        :close="
          () => {
            detailsShow = false
          }
        "
      ></emergency-details>
    </el-dialog>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import emergencyDetails from './Details'
export default {
  name: 'emergency',
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`${uri}_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })

    const user = this.$store.state.user.userInfo

    return {
      // 表操作权限
      tablePermission,

      // 当前登录用户
      user,

      // 文件上传成功列表
      fileList: [],

      // 显示详情弹窗
      detailsShow: false,

      // 查看详情的应急预案对象
      emergency: {},

      // 表单表格管理
      form: {
        labelPosition: 'top',
        formWidth: '600px',
        // 新增弹窗打开事件
        onBeforeAddShow: () => {
          // 清除文件池
          this.clearFiles()
        },
        // 修改弹窗打开事件
        onBeforeEditShow: data => {
          // 清除文件池
          this.clearFiles()
          // 应急详情
          this.$http.get(`/carp/business/a/q/emergency/plan/${data.id}`).then(({ code, data, message }) => {
            if (code === 0) {
              this.fileList = data.textEntityList.map(file => ({ name: file.textName, url: file.textPath, id: file.id }))
            } else {
              this.$message.error('获取应急详情失败: ' + message)
            }
          })
        },
        label: {
          // 标题
          title: {
            label: '标题',
            colType: 'edit',
            span: 24
          },

          // 版本号
          version: {
            label: '版本号',
            type: 'number',
            span: 24
          },

          // 内容
          message: {
            label: '简介',
            type: 'textarea',
            span: 24
          },

          // 详细内容
          text: {
            label: '详细内容',
            type: 'editor',
            colShow: false,
            span: 24
          },

          // 创建人
          createPersonId: {
            show: false,
            colShow: false,
            default: user.id
          },
          createPersonName: {
            label: '创建人',
            show: false,
            default: user.accountBaseDto.name
          },

          // 附件列表
          textEntityList: {
            show: false,
            colShow: false,
            default: []
          },

          // 附件上传标题
          fileUploader: {
            label: '附件上传',
            type: 'title',
            colShow: false,
            real: false
          }
        }
      },

      // 筛选器
      filters: {
        createPersonId: {
          show: false,
          value: null
        }
      }
    }
  },
  methods: {
    // 文件上传前相关判断操作
    beforeUpload(file) {
      // 判断文件是否为txt,pdf文件
      let fileTypeValidate = ['txt', 'pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(file.name.replace(/^.*\./, ''))
      if (!fileTypeValidate) {
        this.$message.error('文件类型只能是txt,pdf,excel,word')
      }
      // 判断文件是否小于5MB
      let fileSizeValidate = file.size <= 5 * 1024 * 1024
      if (!fileSizeValidate) {
        this.$message.error('文件大小不能超过5MB')
      }
      return fileTypeValidate && fileSizeValidate
    },
    // 文件列表变动事件
    fileListChange(fileList) {
      this.form.data.textEntityList = []
      fileList.forEach(file => {
        if (!(file.response && file.response.data) && !file.url) return
        this.form.data.textEntityList.push({
          emergencyPlanId: this.form.originData.id || null,
          id: file.id || null,
          textName: file.name,
          textPath: (file.response && file.response.data[0]) || file.url,
          visible: null
        })
      })
    },
    // 文件列表点击下载事件
    onPreview(file) {
      const link = document.createElement('a')
      link.href = this.$store.state.config.convertFileUrl((file.response && file.response.data[0]) || file.url)
      link.click()
    },
    // 清除文件缓存池
    clearFiles() {
      this.fileList = []
      this.$refs.fileUploader && this.$refs.fileUploader.clearFiles && this.$refs.fileUploader.clearFiles()
    }
  },
  components: {
    tableControl,
    emergencyDetails
  }
}
</script>
