<template>
  <el-row :gutter="10" class="details-container">
    <!-- 基本信息 -->
    <el-col style="display:flex;flex-flow:column nowrap">
      <!-- 基本信息 -->
      <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">基本信息</span>
        </div>
        <div class="content" style="font-size: 14px">
          <div class="content-item">
            <span>巡检项目:</span>
            <span class="value" v-text="details.name"></span>
          </div>
          <div class="content-item">
            <span>巡检地址:</span>
            <span class="value" v-text="details.address"></span>
          </div>
          <div class="content-item">
            <span>巡检人:</span>
            <span class="value" v-text="details.checkPeopleName"></span>
          </div>
          <div class="content-item">
            <span>巡检时间:</span>
            <span class="value" v-text="details.createDate"></span>
          </div>
        </div>
      </el-card>
    </el-col>
    <!-- 企业处理时上传图片 -->
    <el-col v-if="[30, 60].includes($userType) && stateIndex == 0" style="display:flex;flex-flow:column nowrap">
      <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
        <div slot="header" class="clearfix title">
          <span>上传图片</span>
        </div>
        <common-form ref="companyForm" :form-config="companyForm"></common-form>
        <div class="bt" style="text-align:center">
          <el-button type="primary" @click="handleCompanySubmit">提交整改结果</el-button>
        </div>
      </el-card>
    </el-col>
    <!-- 查看每日巡检图片及政府审核 -->
    <el-col v-if="[0, 50].includes($userType) || stateIndex !== 0" style="display:flex;flex-flow:column nowrap">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in details.contentList" :key="item.id" :lg="24" style="display:flex;flex-flow:column nowrap">
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix title" style="display:flex;align-items:center">
              <!-- 巡检项名称 -->
              <span v-text="`${index + 1}.${getDictName(item.dictId)}`" style="font-weight: bold"></span>
              <!-- 显示待审核 -->
              <el-tag v-if="item.checkState === null" type="warning" size="mini" style="margin-left:4px">
                <span>待审核</span>
              </el-tag>
              <!-- 显示审核通过或未通过 -->
              <el-tag v-if="item.checkState !== null" :type="item.checkState ? 'success' : 'danger'" size="mini" style="margin-left:4px">
                <span v-text="item.checkState ? '审核通过' : `未通过 ${item.checkRemark ? item.checkRemark : ''}`"></span>
              </el-tag>
            </div>
            <div class="content" style="display:block">
              <div v-for="(_item, key) in details.imgList.filter(imgObj => imgObj.typeCode == item.dictId)" :key="key" style="display:inline-block">
                <video
                  v-if="/video/g.test($urlConvertType(_item.imageUrl))"
                  :src="$store.state.config.convertVideoUrl(_item.imageUrl, true)"
                  controls
                  style="height:140px;width:140px;background-color:black;margin:2px"
                ></video>
                <el-image
                  v-else-if="/image/g.test($urlConvertType(_item.imageUrl))"
                  :src="$store.state.config.convertImgUrl(_item.imageUrl, true)"
                  :preview-src-list="
                    (() => {
                      let imgs = []
                      details.imgList
                        .filter(imgObj => imgObj.typeCode == item.dictId)
                        .forEach(imgObj => {
                          if (/image/g.test($urlConvertType(imgObj.imageUrl))) {
                            imgs.push($store.state.config.convertImgUrl(imgObj.imageUrl, true))
                          }
                        })
                      return imgs
                    })()
                  "
                  style="height:140px;width:140px;background-color:black;margin:2px"
                  fit="contain"
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
    <el-col style="text-align:center;margin:20px auto 40px">
      <el-button type="warning" @click="close" v-text="'返回'" />
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
      // 每日巡检详细信息数据对象
      details: {
        imgList: []
      },
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
    // 当前每日巡检对象
    info: Object,
    // 每日巡检进度状态
    state: Array,
    // 巡检准则字典表(六不准六必须)
    dict: Array,
    // 关闭动作方法
    close: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    /* *
     * 当前每日巡检进度状态索引号
     * 0:整改中 1:待审核 2:已结案
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
   * 监听当前每日巡检进度状态索引号
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
    // 获取每日巡检详情
    this.getDetails()
  },
  methods: {
    /* *
     * 获取每日巡检详情
     * * */
    getDetails() {
      this.$http
        .get(`/carp/business/a/q/todays/check/${this.info.id}`)
        .then(({ code, data }) => {
          if (code === 0) {
            this.details = data
          } else {
            this.$message.error('未获取到每日巡检详情')
            this.close()
          }
        })
        .catch(err => {
          if (err) {
            this.$message.error('未获取到每日巡检详情')
            this.close()
          }
        })
    },

    /* *
     * 根据巡检准则(六不准六必须)的id获取name
     * * */
    getDictName(id) {
      let name = ''
      this.dict.every(item => {
        if (item.code == id) {
          name = item.label
          return false
        } else {
          return true
        }
      })
      return name
    },

    /* *
     * 初始化政府审核表单数据
     * * */
    initReviewForm() {
      this.details.contentList.forEach(item => {
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
        let params = JSON.parse(JSON.stringify(this.details))

        // 装载数据
        params.todaysCheckContentDtoList = []
        params.contentList.forEach(checkContent => {
          params.todaysCheckContentDtoList.push(
            Object.assign(checkContent, {
              checkState: this.reviewFormData[`${checkContent.dictId}-checkState`],
              checkRemark: this.reviewFormData[`${checkContent.dictId}-remark`],
              todaysImgEntityList: params.imgList.filter(imageObj => imageObj.typeCode == checkContent.dictId)
            })
          )
        })

        // 是否已结案
        let complete = true
        params.todaysCheckContentDtoList.forEach(item => {
          if (!item.checkState) complete = false
        })
        // 结案
        if (complete) {
          params.state = this.state[2].code
        }
        // 整改
        else {
          params.state = this.state[0].code
        }

        delete params.contentList
        delete params.imgList
        delete params.name
        delete params.address

        // 发送请求
        this.$http.put('/carp/business/a/q/todays/check', params).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.details.name + ' 整改已提交')
            this.close()
          } else {
            this.$message.error('发送失败: ' + message)
          }
        })
      })
    },

    /* *
     * 初始化企业初始每日巡检表单
     * * */
    initCompanyForm() {
      // 整改前数据
      this.companyOldData = {}

      // 初始化表单项
      this.details.contentList.forEach(item => {
        // 标题
        this.$set(this.companyForm.label, `${item.dictId}-title`, {
          label: `${this.getDictName(item.dictId)}${
            item.checkState ? `<span style="color:green">(该项已通过审核)</span>` : `<span style="color:red">(${item.checkRemark})</span>`
          }`,
          type: 'title',
          span: 24
        })

        // 图片视频上传
        this.$set(this.companyForm.label, `${item.dictId}-photos`, {
          type: 'uploadImgs',
          limit: 3,
          colShow: false,
          allowReset: false,
          disabled: item.checkState,
          default: [],
          span: 24,
          rule: {
            regExp: /^./,
            message: '该项不能为空'
          },
          // 上传请求地址
          url: '/carp/file/a/q/hbase/file/upload/files/today_module',
          HBase: true,
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
        this.$set(this.companyOldData, `${item.dictId}-photos`, [])
        this.details.imgList.forEach(imgObj => {
          if (item.dictId == imgObj.typeCode) {
            this.companyOldData[`${item.dictId}-photos`].push(imgObj.imageUrl)
          }
        })
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
          let params = JSON.parse(JSON.stringify(this.details))

          // 装载数据
          params.todaysCheckContentDtoList = []
          params.contentList.forEach(checkContent => {
            params.todaysCheckContentDtoList.push(
              Object.assign(checkContent, {
                checkState: checkContent.checkState ? true : null,
                todaysImgEntityList: this.companyForm.data[`${checkContent.dictId}-photos`].map(imageUrl => ({
                  id: null,
                  imageUrl,
                  todayCheckId: checkContent.todayCheckId,
                  todayContentId: checkContent.id,
                  typeCode: checkContent.dictId,
                  visible: true
                }))
              })
            )
          })

          params.state = this.state[1].code

          delete params.contentList
          delete params.imgList
          delete params.name
          delete params.address

          // 发送请求
          this.$http.put('/carp/business/a/q/todays/check', params).then(({ code, message }) => {
            if (code === 0) {
              this.$message.success(this.details.name + ' 整改已提交')
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
