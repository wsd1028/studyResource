<template>
  <el-row :gutter="10" class="details-container">
    <!-- 基本信息及按钮 -->
    <el-col style="display:flex;flex-flow:column nowrap">
      <!-- 基本信息 -->
      <el-card class="box-card" shadow="hover" style="flex:auto;">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">基本信息</span>
        </div>
        <div class="content" style="font-size: 14px">
          <div class="content-item">
            <span>指派人:</span>
            <span class="value" v-text="details.sponsorName"></span>
          </div>
          <div class="content-item">
            <span>指派人所属单位:</span>
            <span class="value" v-text="details.sponsorDept"></span>
          </div>
          <div class="content-item">
            <span>处理人:</span>
            <span class="value" v-text="details.manager"></span>
          </div>
          <div class="content-item">
            <span>联系电话:</span>
            <span class="value" v-text="details.managerPhone"></span>
          </div>
          <div class="content-item">
            <span>工作站:</span>
            <span class="value" v-text="details.workStationName"></span>
          </div>
          <div class="content-item">
            <span>工作站地址:</span>
            <span class="value" v-text="details.workStationAddress"></span>
          </div>
          <div class="content-item">
            <span>发起时间:</span>
            <span class="value" v-text="details.createDate"></span>
          </div>
          <div class="content-item">
            <span>处理时间:</span>
            <span class="value" v-text="details.finishDate"></span>
          </div>
          <div class="content-item" style="justify-content:center">
            <el-button v-if="[0, 1].includes(stateIndex) && user.id == details.sponsorId" type="danger" @click="handleInvalid">作废</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
    <!-- 企业处理时上传图片 -->
    <el-col v-if="details.receiverId == user.id && stateIndex == 0" style="display:flex;flex-flow:column nowrap">
      <el-card class="box-card" shadow="hover" style="flex:auto">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">上传图片</span>
        </div>
        <common-form ref="companyForm" :form-config="companyForm"></common-form>
        <div class="bt" style="text-align:center">
          <el-button type="primary" @click="handleCompanySubmit">提交处理结果</el-button>
          <el-button @click="close">返回</el-button>
        </div>
      </el-card>
    </el-col>
    <!-- 查看指派点检图片及政府审核 -->
    <el-col v-if="([0, 50].includes($userType) || stateIndex !== 0) && !(details.receiverId == user.id && stateIndex == 0)" style="flex-flow:column nowrap">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in details.list" :key="item.id" :lg="24" style="flex-flow:column nowrap">
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title" style="display:flex;ali + n-items:center">
              <span v-text="`${index + 1}.${item.dictName}`" style="font-weight: bold;line-height: 18px"></span>
              <el-tag :type="item.checkState ? 'success' : 'danger'" size="mini" style="margin-left:4px">
                <span v-text="item.checkState ? '审核通过' : `未通过 ${item.checkRemark ? item.checkRemark : ''}`"></span>
              </el-tag>
            </div>
            <div class="content" style="display:block">
              <div v-for="(_item, key) in item.photos" :key="key" style="display:inline-block">
                <video
                  v-if="/video/g.test($urlConvertType(_item))"
                  :src="$store.state.config.convertVideoUrl(_item, true)"
                  controls
                  style="height:140px;width:140px;background-color:black;margin:2px"
                ></video>
                <el-image
                  v-else-if="/image/g.test($urlConvertType(_item))"
                  :src="$store.state.config.convertImgUrl(_item, true)"
                  :preview-src-list="
                    (() => {
                      let imgs = []
                      item.photos.forEach(img => {
                        if (/image/g.test($urlConvertType(img))) {
                          imgs.push($store.state.config.convertImgUrl(img, true))
                        }
                      })
                      return imgs
                    })()
                  "
                  :z-index="3000"
                  fit="contain"
                  style="height:140px;width:140px;background-color:black;margin:2px"
                >
                  <div slot="error" class="image-slot" style="height:140px;width:140px;text-align:center;line-height:140px">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 登录用户信息
      user,
      // 督办派单详情
      details: {},
      // 企业整改旧数据
      companyOldData: {},
      // 企业整改数据表单
      companyForm: {
        label: {}
      },
      // 政府审核数据表单
      reviewFormData: {}
    }
  },
  props: {
    // 当前指派点检对象
    info: Object,
    // 指派点检进度状态
    state: Array,
    // 关闭动作方法
    close: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    /* *
     * 当前指派点检进度状态索引号
     * 0:整改中 1:待审核 2:已结案 3:已作废
     * * */
    stateIndex() {
      let index = -1
      this.state.every((item, i) => {
        if (item.code == this.details.state) {
          index = i
          return false
        } else {
          return true
        }
      })
      return index
    }
  },
  /* *
   * 监听当前指派点检进度状态索引号
   * 0:整改中 1:待审核 2:已结案 3:已作废
   * * */
  watch: {
    stateIndex(index) {
      if (index == 0) {
        // 初始化企业整改表单
        this.initCompanyForm()
      } else if (index == 1) {
        // 初始化审核表单
        this.initReviewForm()
      }
    }
  },
  created() {
    // 获取指派点检详情
    this.getDetails()
  },
  methods: {
    /* *
     * 获取指派点检详情
     * * */
    getDetails() {
      this.$http
        .get(`/carp/business/a/q/command/check/${this.info.id}`)
        .then(({ code, data }) => {
          if (code === 0) {
            this.details = data
          } else {
            this.$message.error('未获取到指派点检详情')
            this.close()
          }
        })
        .catch(err => {
          if (err) {
            this.$message.error('未获取到指派点检详情')
            this.close()
          }
        })
    },

    /* *
     * 初始化政府审核表单数据
     * * */
    initReviewForm() {
      this.details.list.forEach(item => {
        // 审核是否通过单选框
        let checkState = item.checkState ? true : false
        this.$set(this.reviewFormData, `${item.dictId}-checkState`, checkState)

        // 审核备注
        this.$set(this.reviewFormData, `${item.dictId}-remark`, item.checkRemark)
      })
    },

    /* *
     * 提交政府审核按钮事件
     * * */
    handleSubmitReview() {
      this.$confirm('确定审核内容无误?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 请求参数
        let params = this.details.list.map(item => {
          let checkObj = JSON.parse(JSON.stringify(item))
          checkObj.checkState = this.reviewFormData[`${item.dictId}-checkState`]
          checkObj.checkRemark = this.reviewFormData[`${item.dictId}-remark`]
          return checkObj
        })

        // 发送请求
        this.$http.post('/carp/business/a/q/command/check/check', params).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.details.workStationName + ' 已审核')
            // 关闭弹窗
            this.close()
          } else {
            this.$message.error('提交失败: ' + message)
          }
        })
      })
    },

    /* *
     * 发起人作废指派点检
     * * */
    handleInvalid() {
      this.$confirm(`确定作废该条指派点检: ${this.details.workStationName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post(
              '/carp/business/a/q/command/check/cancel',
              {},
              {
                params: {
                  id: this.details.id
                }
              }
            )
            .then(({ code, message }) => {
              if (code === 0) {
                this.$message.success(`指派点检 ${this.details.workStationName} 已废除`)
                this.close()
              } else {
                this.$message.error('请求失败: ' + message)
              }
            })
        })
        .catch(() => {})
    },

    /* *
     * 初始化企业初始指派点检表单
     * * */
    initCompanyForm() {
      // 整改前数据
      this.companyOldData = {}

      // 初始化表单项
      this.details.list.forEach(item => {
        // 标题
        this.$set(this.companyForm.label, `${item.dictId}-title`, {
          label: `${item.dictName}<span v-if="false" style="color:red">${item.checkRemark ? `(${item.checkRemark})` : ''}</span>`,
          type: 'title',
          span: 24
        })

        // 图片视频上传
        this.$set(this.companyForm.label, `${item.dictId}-photos`, {
          type: 'uploadImgs',
          limit: 4,
          colShow: false,
          allowReset: false,
          default: [],
          span: 24,
          HBase: true,
          rule: {
            regExp: /^./,
            message: '该项不能为空'
          },
          // 上传请求地址
          url: '/carp/file/a/q/file/upload/files/command_image',
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
        })

        // 装填已有数据
        this.companyOldData[`${item.dictId}-photos`] = item.photos
      })

      this.$nextTick(() => {
        if (this.$refs.companyForm) this.$refs.companyForm.formFill(this.companyOldData)
      })
    },

    /* *
     * 企业处理提交按钮事件
     * */
    handleCompanySubmit() {
      // 表单验证
      this.$refs.companyForm.formValidate(valid => {
        if (!valid) {
          this.$message.error('表单内容填写不正确')
          return
        }

        // 弹出确认框
        this.$confirm('确定内容填写无误?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 请求参数
          let params = this.details.list.map(item => {
            let checkObj = JSON.parse(JSON.stringify(item))
            checkObj.photos = this.companyForm.data[`${item.dictId}-photos`]
            return checkObj
          })

          // 发送请求
          this.$http.post('/carp/business/a/q/command/check/deal', params).then(({ code, message }) => {
            if (code === 0) {
              this.$message.success(this.details.workStationName + ' 指派点检处理成功')
              this.close()
            } else {
              this.$message.error('发送失败: ' + message)
            }
          })
        })
      })
    }
  },
  components: {
    commonForm
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.content-item {
  width: 100%;
}
</style>
