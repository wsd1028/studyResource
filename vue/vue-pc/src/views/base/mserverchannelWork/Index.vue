<template>
  <div style="display:flex" id="mserverchannel-container">
    <common-table-control
      ref="tableControl"
      :form-config="form"
      search-url="/carp/business/a/q/business/msworklive/work/list"
      :allow-add="false"
      :allow-delete="false"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :show-control-edit="false"
      :bind-buttons="[
        { label: '播放', key: 'video', rule: { regExp: /^1$/, key: 'status' } },
        { label: '', key: 'flush', type: 'info', icon: 'el-icon-refresh' }
      ]"
      @bindButtonClick="
        mserverchannel = $event.row
        switch ($event.key) {
          case 'video':
            videoShow = true
            break
          case 'workstation':
            workstationShow = true
            break
          case 'flush':
            $http.put(`/carp/business/a/q/business/mserverchannel/status/${mserverchannel.channelIdentifier}`).then(({ code, message }) => {
              if (code !== 0) {
                $message.error('更新失败:' + message)
              } else {
                $refs.tableControl.getList()
              }
            })
            break
        }
      "
      :filters="filters"
    ></common-table-control>

    <!-- 视频播放弹窗 -->
    <el-dialog
      v-if="videoShow"
      :visible="true"
      :fullscreen="true"
      style="padding:10px"
      @close="videoShow = false"
      custom-class="mserverchannel-container-dialog"
    >
      <m-video
        :mserverchannel="mserverchannel"
        :close="
          () => {
            videoShow = false
          }
        "
      ></m-video>
    </el-dialog>
  </div>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
import mVideo from './Video'
export default {
  name: 'mserverchannel',
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      edit: false,
      del: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`${uri}_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })
    const user = this.$store.state.user.userInfo
    return {
      // 当前登录用户
      user,

      // 表操作权限
      tablePermission,

      // 视频弹窗显示控制器
      videoShow: false,

      // 点击的监测站
      mserverchannel: {},

      // 表格表单操作器
      form: {
        formHeight: 'auto',
        formWidth: '500px',
        labelPosition: 'top',
        tableControlWidth: '120px',
        label: {
          // 封面图地址
          coverImage: {
            label: '封面图',
            show: false,
            colShow: false,
            colType: 'img',
            span: 24
          },

          // 检测点名称
          name: {
            label: '检测点',
            show: false,
            colType: 'edit',
            span: 24
          },

          // 工作站名称
          workName: {
            label: '工作站名称',
            show: false,
            data: data => `<span style="text-align:left">${(data && data.replace(/,/g, '<hr style="background-color:#888"/>')) || ''}</span>`
          },

          // 摄像头类型
          cameraTypeName: {
            label: '摄像头类型',
            width: 60,
            show: false,
            span: 24
          },

          // 通道数
          chanNum: {
            label: '通道数',
            show: false,
            colShow: false,
            span: 24
          },

          // 检测点编号
          channelIdentifier: {
            label: '检测点编号',
            show: false,
            span: 24
          },

          // hls地址
          hls: {
            label: 'hls地址',
            show: false,
            span: 24
          },

          // 创建时间
          createDate: {
            label: '创建时间',
            show: false,
            colShow: false,
            span: 24
          },

          // 修改时间
          modifyDate: {
            label: '修改时间',
            show: false,
            width: 80,
            span: 24
          },

          // 检测点描述
          detail: {
            label: '检测点描述',
            type: 'textarea',
            rows: 5,
            span: 24
          },

          // 是否在线 1是 0离线
          status: {
            label: '是否在线',
            show: false,
            width: 40,
            colType: 'tag',
            item: [
              { label: '在线', code: 1, type: 'success' },
              { label: '离线', code: 0, type: 'danger' }
            ],
            span: 24
          }
        }
      },

      // 筛选器
      filters: {
        workId: {
          show: false,
          value: user.accountTypeDto.ancillaryId || ''
        }
      }
    }
  },
  components: {
    commonTableControl,
    mVideo
  }
}
</script>

<style lang="less">
.mserverchannel-container {
  .mserverchannel-container-dialog {
    & > .el-dialog__body {
      position: relative;
    }
  }
}
</style>
