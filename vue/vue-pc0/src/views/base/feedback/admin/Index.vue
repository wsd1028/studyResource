<template>
  <div class="container">
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :filters="filters"
      :bind-buttons="[{ label: '查看详情', key: 'details', icon: 'el-icon-view' }]"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 用户反馈详情 -->
    <el-dialog class="dialog details-container headerTitle" :visible.sync="detailsView.show" top="5vh" width="600px" style="padding:24px">
      <div slot="title" style="font-size: 20px;font-weight: bold">反馈详情</div>
      <details-view :info="details" class="headerTitle"></details-view>
    </el-dialog>
    <!-- 用户反馈详情 -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import detailsView from './DetailsView'
export default {
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

    // 当前登录用户
    const user = this.$store.state.user.userInfo

    return {
      user,
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        labelPosition: 'top',
        formWidth: '500px',
        data: {
          userId: user.id,
          photo: ''
        },
        // 表格标题
        label: {
          // 上报人名称
          userName: {
            label: '用户',
            show: false,
            default: user.accountBaseDto.name,
            span: 24,
            rule: {
              regExp: /^./,
              message: '不能为空'
            }
          },
          // 联系方式
          phone: {
            label: '联系方式',
            width: 120,
            span: 24,
            required: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 邮箱
          mailbox: {
            label: '邮箱',
            width: 260,
            span: 24,
            required: true,
            rule: {
              regExp: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/g,
              message: '请填写正确的邮箱格式'
            }
          },
          // 反馈信息
          info: {
            label: '反馈信息',
            type: 'textarea',
            span: 24,
            width: 500,
            rows: '5',
            allowReset: false,
            required: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 图片
          photoList: {
            label: '图片',
            type: 'uploadImgs',
            colShow: false,
            allowReset: false,
            default: [],
            span: 24,
            real: false,
            // 上传请求地址
            url: '/carp/file/a/q/file/upload/files/feedback_img',
            // 文件上传前执行该钩子
            before: file => {
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isLt2M
            },
            // 文件上传成功后执行该钩子
            success: ({ code }) => {
              if (code !== 4002) {
                this.$message.error('图片上传失败')
              }
            }
          },
          // 问题是否解决
          useState: {
            label: '问题是否解决',
            colType: this.$userType === 0 ? 'switch' : 'tag',
            url: '/carp/business/a/q/feedback',
            show: false,
            span: 24,
            width: 120,
            type: 'radio',
            default: false,
            item: [
              { label: '已解决', code: true, type: 'success' },
              { label: '未解决', code: false, type: 'danger' }
            ]
          }
        }
      },
      addUrl: '/carp/business/a/q/feedback',
      delUrl: '/carp/business/a/q/feedback/remove',
      editUrl: '/carp/business/a/q/feedback',
      searchUrl: `/carp/business/a/q/feedback/page?userId=${[0, 50].includes(this.$userType) ? '' : user.id}`,
      // 反馈数据
      details: {},
      // 反馈详情弹出框
      detailsView: {
        show: false
      },
      // 筛选器
      filters: {
        useState: {
          label: '问题进度',
          type: 'select',
          item: [
            { label: '全部', code: ' ' },
            { label: '已解决', code: 1 },
            { label: '未解决', code: 0 }
          ],
          value: ''
        }
      }
    }
  },
  watch: {
    'form.data.photoList': {
      handler(val) {
        this.form.data.photo = val.join()
      }
    }
  },
  methods: {
    /* *
     * 获取表格行
     * * */
    getRow({ row, key }) {
      this.details = row
      switch (key) {
        case 'details':
          this.detailsView.show = true
          break

        default:
          break
      }
    }
  },
  components: {
    commonTableControl,
    detailsView
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  flex: auto;
  height: 0;
  @flex-column();
}
.headerTitle .el-dialog__title {
  font-size: 20px !important;
  font-weight: bold !important;
}
</style>
