<template>
  <div style="display:flex" id="mserverchannel-container">
    <common-table-control
      ref="tableControl"
      :form-config="form"
      del-url="/carp/business/a/q/business/mserverchannel"
      search-url="/carp/business/a/q/business/mserverchannel/list"
      :allow-add="false"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :show-control-edit="false"
      :bind-buttons="[
        { label: '播放', key: 'video', rule: { regExp: /^1$/, key: 'status' } },
        { label: '工作站', key: 'workstation', type: 'success' },
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

    <!-- 工作站绑定弹窗 -->
    <el-dialog v-if="workstationShow" :visible="true" width="800px" top="14vh" @close="workstationShow = false">
      <div slot="title">
        <span>工作站列表</span>
        <el-tag size="mini" type="success" v-text="mserverchannel.name"></el-tag>
      </div>
      <workstation-bind :mserverchannel="mserverchannel"></workstation-bind>
    </el-dialog>
  </div>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
import mVideo from './Video'
import workstationBind from './WorkstationBind'
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
    return {
      // 表操作权限
      tablePermission,

      // 视频弹窗显示控制器
      videoShow: false,

      // 工作站绑定弹窗显示控制器
      workstationShow: false,

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
            type: 'uploadImg',
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
        cameraType: {
          label: '摄像头类型',
          type: 'select',
          width: '120px',
          item: [
            { label: '枪机', code: 0 },
            { label: '半球', code: 1 },
            { label: '快球', code: 2 },
            { label: '带云台枪机', code: 3 }
          ],
          value: null
        },
        workType: {
          label: '工作站类型',
          type: 'select',
          width: '110px',
          item: [
            { label: '项目', code: 'fixed_source_project' },
            { label: '消纳站', code: 'fixed_source_garbage_station' },
            { label: '公共区域', code: 'fixed_source_public_area' }
          ]
        },
        status: {
          label: '是否在线',
          type: 'select',
          width: '96px',
          item: [
            { label: '在线', code: 1 },
            { label: '离线', code: 0 }
          ],
          value: null
        },
        channelIdentifier: {
          label: '监测点编号',
          type: 'search',
          showBt: false,
          value: ''
        },
        likeName: {
          label: '工作站名称/手机号/负责人/设备名称',
          type: 'search',
          width: '280px',
          value: ''
        }
      }
    }
  },
  components: {
    commonTableControl,
    mVideo,
    workstationBind
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
