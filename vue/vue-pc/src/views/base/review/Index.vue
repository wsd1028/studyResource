<template>
  <div class="manage">
    <!-- 导航栏 -->
    <!-- <nav>
      <div v-for="item in headerInfo" :key="item.key" class="nav-item">
        <span class="number" v-text="item.value"></span>
        <span v-text="item.label"></span>
      </div>
    </nav> -->
    <table-control
      ref="tableControl"
      :form-config="formConfig"
      :allow-add="false"
      :allow-delete="false"
      :allow-edit="false"
      search-url="/carp/business/a/q/review/message/showPage"
      :bind-buttons="[
        { label: '查看', key: 'details' },
        { label: '轨迹', key: 'orbit', type: 'info' },
        { label: '审核', key: 'review', rule: { regExp: /^20$/, key: 'state' }, type: 'warning' }
      ]"
      :filters="filters"
      @bindButtonClick="handle"
    ></table-control>
    <!-- 审核操作弹出框 -->
    <el-dialog :visible.sync="form.show" @close="clearForm" top="10vh" width="600px">
      <div slot="title" style="font-size: 20px;font-weight: bold">审核操作</div>
      <el-form>
        <el-form-item label="审核项">
          <el-checkbox label="车身干净" v-model="form.params.clean"></el-checkbox>
          <el-checkbox label="覆盖严密" v-model="form.params.cover"></el-checkbox>
          <el-checkbox label="已检查" v-model="form.params.checkReviewed"></el-checkbox>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="form.params.message" autocomplete="off" type="textarea" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            form.show = false
            clearForm()
          "
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="
            form.show = false
            review()
            clearForm()
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 审核操作弹出框end -->
    <!-- 电子联单详情弹出框 -->
    <el-dialog
      class="dialog electronic-form-container"
      :visible.sync="electronicForm.show"
      @close="electronicForm.data = { adminPhoto: [], carPhoto: [] }"
      top="5vh"
      width="600px"
      style="padding:24px"
    >
      <div slot="title" style="font-size: 20px;font-weight: bold">电子联单详情</div>
      <el-row :gutter="10" align="center">
        <!-- 第一列 -->
        <el-col>
          <!-- 排放企业 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">排放企业</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item">
                <i class="icon el-icon-office-building"></i>
                <span class="value" v-text="electronicForm.data.projectName"></span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-location-outline"></i>
                <span class="value" v-text="electronicForm.data.address"></span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-user"></i>
                <span class="value" v-text="electronicForm.data.endAccountStr"></span>
              </div>
            </div>
          </el-card>
          <!-- 消纳企业 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">消纳企业</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item">
                <i class="icon el-icon-truck"></i>
                <span v-cloak>
                  <span>企业名称:</span>
                  <span class="value" v-text="electronicForm.data.name"></span>
                </span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-office-building"></i>
                <span v-cloak>
                  <span>消纳地址:</span>
                  <span class="value" v-text="electronicForm.data.garbageStationAddress"></span>
                </span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-user"></i>
                <span v-cloak>
                  <span>消纳员:</span>
                  <span class="value" v-text="electronicForm.data.accountStr"></span>
                </span>
              </div>
            </div>
          </el-card>
          <!-- 联单状态 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">联单状态</span>
              </div>
            </div>
            <div class="content">
              <el-steps :active="electronicForm.data.state == 10 ? 2 : 3" style="flex:auto">
                <el-step title="待检查" icon="el-icon-remove-outline"></el-step>
                <el-step title="运输中" icon="el-icon-d-arrow-right"></el-step>
                <el-step title="已消纳" icon="el-icon-check"></el-step>
              </el-steps>
            </div>
          </el-card>
          <!-- 运输企业 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">运输企业</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item">
                <i class="icon el-icon-truck"></i>
                <span v-cloak>
                  <span>车牌号:</span>
                  <span class="value" v-text="electronicForm.data.licenseNumber"></span>
                </span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-office-building"></i>
                <span v-cloak>
                  <span>所属企业:</span>
                  <span class="value" v-text="electronicForm.data.companyName"></span>
                </span>
              </div>
              <div class="content-item">
                <i class="icon el-icon-user"></i>
                <span v-cloak>
                  <span>司机:</span>
                  <span class="value" v-text="electronicForm.data.driverName"></span>
                </span>
              </div>
            </div>
          </el-card>
          <!-- 车辆识别照片 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">车辆识别照片</span>
              </div>
            </div>
            <div class="content">
              <el-image
                v-for="(item, key) in electronicForm.data.carPhoto"
                :key="key"
                :src="$store.state.config.convertImgUrl(item, true)"
                :preview-src-list="electronicForm.data.carPhoto.map(item => $store.state.config.convertImgUrl(item, true))"
                style="height:100px;width:100px;background-color:black;margin:2px"
                fit="contain"
              >
                <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </el-card>
        </el-col>
        <!-- 第二列 -->
        <el-col>
          <!-- 固定源检查信息 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">固定源检查信息</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣类型:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.garbageTypeStr"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣重量:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.weight"></span>
                <span>Kg</span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣立方:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.cube"></span>
                <span>
                  m
                  <sup>3</sup>
                </span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否冲洗干净:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.clean ? '干净' : '不干净'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>篷布是否覆盖:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.cover ? '覆盖' : '未覆盖'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否超重:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.overload ? '超重' : '未超重'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否超高:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.height ? '超高' : '未超高'"></span>
              </div>
              <div style="flex:none;width:100%">
                <div style="margin-bottom:10px">车辆固定源照片:&nbsp;</div>
                <el-image
                  v-for="(item, key) in electronicForm.data.adminPhoto"
                  :key="key"
                  :src="$store.state.config.convertImgUrl(item, true)"
                  :preview-src-list="electronicForm.data.adminPhoto.map(item => $store.state.config.convertImgUrl(item, true))"
                  style="height:100px;width:100px;background-color:black;margin:2px"
                  fit="contain"
                >
                  <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
          <!-- 司机签名 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">司机签名</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item">
                <el-image
                  :src="$store.state.config.convertImgUrl(electronicForm.data.driverSignImage, true)"
                  :preview-src-list="[$store.state.config.convertImgUrl(electronicForm.data.driverSignImage, true)]"
                  style="height:100px;width:100px;background-color:white;margin:2px"
                  fit="contain"
                >
                  <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
        </el-col>
        <!-- 第三列 -->
        <el-col>
          <!-- 消纳场检查信息 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">消纳场检查信息</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣类型:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endGarbageTypeStr"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣重量:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endWeight"></span>
                <span>Kg</span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>建渣立方:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endCube"></span>
                <span>
                  m
                  <sup>3</sup>
                </span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否冲洗干净:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endClean ? '干净' : '不干净'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>篷布是否覆盖:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endCover ? '覆盖' : '未覆盖'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否超重:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endOverload ? '超重' : '未超重'"></span>
              </div>
              <div class="content-item" style="width: 170px;margin-right: 0">
                <span>是否超高:&nbsp;</span>
                <span class="value" v-text="electronicForm.data.endHeight ? '超高' : '未超高'"></span>
              </div>
              <div style="flex:none;width:100%">
                <div style="margin-bottom:10px">车辆固定源照片:&nbsp;</div>
                <el-image
                  v-for="(item, key) in electronicForm.data.endAdminPhoto"
                  :key="key"
                  :src="$store.state.config.convertImgUrl(item, true)"
                  :preview-src-list="electronicForm.data.endAdminPhoto.map(item => $store.state.config.convertImgUrl(item, true))"
                  style="height:100px;width:100px;background-color:black;margin:2px"
                  fit="contain"
                >
                  <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
          <!-- 消纳员签名 -->
          <el-card shadow="never" class="box-card" style="overflow:visible">
            <div slot="header" class="clearfix">
              <div class="title">
                <span style="font-weight: bold;line-height: 18px">消纳员签名</span>
              </div>
            </div>
            <div class="content">
              <div class="content-item">
                <el-image
                  :src="$store.state.config.convertImgUrl(electronicForm.data.endSignImage, true)"
                  :preview-src-list="[$store.state.config.convertImgUrl(electronicForm.data.endSignImage, true)]"
                  style="height:100px;width:100px;background-color:white;margin:2px"
                  fit="contain"
                >
                  <div slot="error" class="image-slot" style="height:100px;width:100px;text-align:center;line-height:100px">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 电子联单详情弹出框end -->

    <!-- 车辆轨迹弹出框 -->
    <history-map ref="historyMap"></history-map>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import historyMap from '../mapCarGPS/models/map/HistoryMap'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      user,
      // 头信息
      headerInfo: [],
      // 审核分页数据
      reviewList: [],
      // 审核字典表
      reviewType: {
        allNumber: '总共',
        cleanNumber: '车身不洁',
        coverNumber: '未覆盖',
        checkNumber: '未检查',
        qualifiedNumber: '合格'
      },
      // 审核表单配置
      form: {
        show: false,
        // 审核类型
        reviewState: null,
        // 请求参数
        params: {
          // 车身洁净
          clean: true,
          // 车身已覆盖
          cover: true,
          // 是否点检
          checkReviewed: true,
          // 审核留言
          message: ''
        },
        // 电子联单当前审核状态对象
        originParams: {}
      },
      // 电子联单展示配置
      electronicForm: {
        show: false,
        data: {}
      },

      // 表操作器对象
      formConfig: {
        tableControlWidth: '134px',
        label: {
          // 图像
          carPhoto: {
            label: '图像',
            colType: 'img',
            HBase: true
          },
          // 车牌号
          licenseNumber: {
            label: '车牌号'
          },
          // 项目
          projectName: {
            label: '项目'
          },
          areaName: {
            label: '地区'
          },
          state: {
            label: '联单状态',
            colType: 'tag',
            item: [
              { label: '运输中', type: 'primary', code: 10 },
              { label: '待审核', type: 'warning', code: 20 },
              { label: '已审核', type: 'success', code: 25 }
            ]
          },
          clean: {
            label: '车身洁净',
            colType: 'tag',
            item: [
              { label: '是', type: 'success', code: true },
              { label: '否', type: 'danger', code: false }
            ]
          },
          cover: {
            label: '覆盖严密',
            colType: 'tag',
            item: [
              { label: '是', type: 'success', code: true },
              { label: '否', type: 'danger', code: false }
            ]
          },
          createDate: {
            label: '创建时间',
            show: false
          }
        }
      },
      // 筛选器
      filters: {
        areaCode: {
          name: '区域',
          type: 'area',
          props: {
            code: 'code'
          },
          area: (() => {
            let area = []
            this.$getAreaTree(user.accountTypeDto.code, tree => {
              area = [tree]
            })
            return area
          })(),
          value: user.accountTypeDto.code
        },
        state: {
          name: '联单状态',
          type: 'select',
          item: [
            { label: '全部', type: 'primary', code: null },
            { label: '运输中', type: 'primary', code: 10 },
            { label: '待审核', type: 'warning', code: 20 },
            { label: '已审核', type: 'success', code: 25 }
          ],
          value: null
        },
        projectName: {
          label: '搜索项目名称',
          type: 'search',
          value: ''
        }
      }
    }
  },
  computed: {},
  created() {
    // 刷新
    this.flush()
  },
  methods: {
    /* *
     * 刷新操作
     * * */
    flush() {
      // 点击生成审核统计信息（头部）
      this.getHeaderInfo()
      this.$refs.tableControl && this.$refs.tableControl.getList()
    },
    /* *
     * 获取审核统计头信息
     * * */
    getHeaderInfo() {
      this.$http.get('/carp/business/a/q/review/message/showAll').then(({ code, data }) => {
        if (code === 0) {
          this.headerInfo = Object.keys(data).map(key => {
            return {
              key,
              label: this.reviewType[key],
              value: data[key]
            }
          })
        }
      })
    },
    /* *
     * 获取电子联单详细信息
     * @param electronicForm:审核信息对象
     * * */
    handleDetails(electronicForm) {
      // 请求电子联单详细信息
      this.$http.get(`/carp/business/a/q/electronic/workflow/${electronicForm.electronicFormId}`).then(({ code, data, message }) => {
        if (code === 0) {
          this.electronicForm.show = true
          this.electronicForm.data = data
        } else {
          this.$message.error(message)
        }
      })
    },
    /* *
     * 清除表单
     * * */
    clearForm() {
      this.form.params.clean = true
      this.form.params.cover = true
      this.form.params.checkReviewed = true
      this.form.params.message = ''
    },
    /* *
     * 点击检查事件
     * @param value:值
     * @param id: 审核id
     * @param type:审核类型--1.clean(是否干净) 2.cover(是否密闭) 3.checkReviewed(是否已检查)
     * * */
    handleReview(item) {
      // 如果当前联单已审核则不再往下执行
      // if (item.headId) return
      // 填充表单
      this.form.originParams = item
      this.form.params.clean = item.clean
      this.form.params.cover = item.cover
      this.form.params.checkReviewed = item.checkReviewed
      // 显示表单
      this.form.show = true
    },
    // 发送审查结果
    review() {
      let params = JSON.parse(JSON.stringify(this.form.originParams))
      params.id = params.reviewedId
      ;['areaName', 'carPhoto', 'carState', 'garbageId', 'licenseNumber', 'state', 'reviewedId'].forEach(feild => {
        delete params[feild]
      })
      params.headId = this.user.id
      this.$http.put('/carp/business/a/q/review/message/update', Object.assign(params, this.form.params)).then(({ code, message }) => {
        if (code === 0) {
          // 刷新页面
          this.flush()
          this.$message.success('已提交审核')
        } else {
          this.$message.error('提交审核失败 ' + message)
        }
      })
    },

    // 按钮点击
    handle({ row, key }) {
      switch (key) {
        case 'review':
          this.handleReview(row)
          break

        case 'details':
          this.handleDetails(row)
          break

        case 'orbit':
          this.$refs.historyMap && this.$refs.historyMap.watchHistoy({ licensePlate: row.licenseNumber })
          break
      }
    }
  },
  components: {
    tableControl,
    historyMap
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
@import '~@/assets/less/spotcheck';
.manage {
  /* *
  * 头信息
  * */
  nav {
    background-color: #fff;
    display: flex;
    .nav-item {
      padding: 10px 20px;
      @flex-column();
      .number {
        font-size: 18px;
      }
      & > * {
        text-align: center;
      }
    }
  }
  /* *
  * 审核列表
  * */
  .content-wrap {
    padding: 0;
    .left-content-wrap {
      margin: 0;
      background-color: #f9f9f9;
    }
    .card {
      background-color: #fff;
      .pic-wrap {
        .pic {
          cursor: pointer;
          width: 100% !important;
          & > * {
            position: absolute;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  /* *
  * 电子联单详情
  * */
  .electronic-form-container {
    .box-card {
      margin-bottom: 10px;
      font-size: 16px;
      color: #666;
      .title {
        display: inline-flex;
        align-items: stretch;
        font-size: 18px;
        &::before {
          content: '';
          background-color: #4186f4;
          width: 6px;
          margin-right: 8px;
        }
      }
      .content {
        display: flex;
        flex-flow: row wrap;
        .content-item {
          margin: 0 20px 10px 0;
          .icon {
            margin-right: 4px;
          }
        }
        .value {
          margin-left: 4px;
          color: #336699;
        }
      }
    }
  }
}
</style>
