<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-edit="false"
      :show-control-del="false"
      :filters="filters"
      :bind-buttons="[{ label: '设备管理', key: 'device', icon: 'el-icon-video-camera' }]"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 车辆绑定操作 -->
    <el-dialog class="dialog" :visible.sync="deviceBind.show" title="设备管理" top="6vh" width="60%" fullscreen style="padding:24px">
      <!-- 绑定操作表单 -->
      <device-bind :info="company" ref="car"></device-bind>
    </el-dialog>
    <!-- 车辆绑定操作end -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import deviceBind from './DeviceBind'
export default {
  name: 'intersection',
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
    return {
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        labelPosition: 'top',
        formWidth: '500px',
        // 显示
        show: false,
        // 操作格式
        type: 'add',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          // 卡口图片
          image: {
            label: '卡口图片',
            type: 'uploadImg',
            colType: 'img',
            width: 160,
            span: 24,
            url: '/carp/file/a/q/file/upload/files/road_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('只能上传图片格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            }
          },
          // 道路卡口名称
          name: {
            label: '名称',
            width: 200,
            colType: 'edit',
            span: 24,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 地区id
          areaId: {
            label: '所属地区',
            type: 'area',
            colShow: false,
            span: 24,
            default: '290871061266829312',
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 地址
          address: {
            label: '地址',
            width: 200,
            span: 24,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 纬度
          latitude: {
            label: '纬度',
            span: 24,
            show: false,
            colShow: false,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 经度
          longitude: {
            label: '经度',
            show: false,
            span: 24,
            colShow: false,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 项目定位
          location: {
            label: '项目定位',
            type: 'map',
            colShow: false,
            span: 24,
            real: false,
            // 定位相关配置
            target: {
              address: 'address',
              lng: 'longitude',
              lat: 'latitude'
            }
          }
        }
      },
      addUrl: '/carp/business/a/q/road/intersection/increase',
      delUrl: '/carp/business/a/q/road/intersection',
      editUrl: '/carp/business/a/q/road/intersection',
      searchUrl: '/carp/business/a/q/road/intersection/areaId',
      // 企业信息
      company: {},
      // 车辆绑定操作模块的数据
      deviceBind: {
        show: false
      },
      // 筛选器
      filters: {
        // 地区id
        areaId: {
          label: '根据地区筛选',
          type: 'area',
          value: ''
        }
      }
    }
  },
  created() {},
  methods: {
    /* *
     * 获取点击的行内容
     * * */
    getRow({ row, key }) {
      // 获取用户信息
      this.company = row

      switch (key) {
        // 车辆绑定操作
        case 'device':
          this.deviceBind.show = true
          break

        default:
          break
      }
    }
  },
  components: {
    commonTableControl,
    deviceBind
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
</style>
