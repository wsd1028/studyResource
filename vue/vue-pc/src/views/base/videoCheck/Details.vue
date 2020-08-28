<template>
  <el-row class="details-container">
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
    <!-- 查看视频巡检图片及政府审核 -->
    <el-col style="display:flex;flex-flow:column nowrap">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in details.contentList" :key="item.id" :lg="24" style="display:flex;flex-flow:column nowrap">
          <el-card class="box-card" shadow="hover" style="flex:auto;overflow:visible">
            <div slot="header" class="clearfix" style="display:flex;align-items:center;justify-content: space-between">
              <div>
                <!-- 巡检项名称 -->
                <span v-text="`${index + 1}.${getDictName(item.dictId)}`" style="font-weight: bold"></span>
                <el-tag :type="item.checkState ? 'success' : 'danger'" size="mini" style="margin-left:4px">
                  <span v-text="item.checkState ? '审核通过' : `未通过 ${item.checkRemark ? item.checkRemark : ''}`"></span>
                </el-tag>
              </div>
              <div v-if="stateIndex == 1 && [50].includes($userType)" class="review-wrap">
                <el-radio-group style="display: flex" v-model="reviewFormData[`${item.dictId}-checkState`]">
                  <el-radio style="margin-right:20px" :label="true" v-model="reviewFormData[`${item.dictId}-checkState`]">合格</el-radio>
                  <div class="redRadio">
                    <el-radio :label="false" v-model="reviewFormData[`${item.dictId}-checkState`]">整改</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </div>

            <div class="content" style="display:block;text-align:center">
              <div v-for="(_item, key) in details.imgList.filter(imgObj => imgObj.typeCode == item.dictId)" :key="key" style="display:inline-block">
                <video
                  :src="$store.state.config.convertVideoUrl(_item.videoUrl, true)"
                  controls
                  style="height:260px;width:500px;background-color:black;margin:2px"
                ></video>
              </div>
              <div v-if="stateIndex == 1 && [50].includes($userType)" class="review-wrap" style="margin-top:10px">
                <el-input type="textarea" :rows="2" v-model="reviewFormData[`${item.dictId}-remark`]" placeholder="审核备注" style="margin-top:10px"></el-input>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="24" style="text-align:center">
          <el-button v-if="stateIndex == 1 && [50].includes($userType)" type="primary" @click="handleSubmitReview">提交审核</el-button>
          <el-button @click="close">返回</el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 登录用户信息
      user,
      // 视频巡检详细信息数据对象
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
    // 当前视频巡检对象
    info: Object,
    // 视频巡检进度状态
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
     * 当前视频巡检进度状态索引号
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
   * 监听当前视频巡检进度状态索引号
   * 0:整改中 1:待审核 2:已结案 3:已作废
   * * */
  watch: {
    stateIndex(index) {
      if (index == 1) {
        // 初始化审核表单
        this.initReviewForm()
      }
    }
  },
  created() {
    // 获取视频巡检详情
    this.getDetails()
  },
  methods: {
    /* *
     * 获取视频巡检详情
     * * */
    getDetails() {
      this.$http
        .get(`/carp/business/a/q/video/check/${this.info.id}`)
        .then(({ code, data }) => {
          if (code === 0) {
            this.details = data
          } else {
            this.$message.error('未获取到视频巡检详情')
            this.close()
          }
        })
        .catch(err => {
          if (err) {
            this.$message.error('未获取到视频巡检详情')
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
        params.videoCheckContentDtoList = []
        params.contentList.forEach(checkContent => {
          params.videoCheckContentDtoList.push(
            Object.assign(checkContent, {
              checkState: this.reviewFormData[`${checkContent.dictId}-checkState`],
              checkRemark: this.reviewFormData[`${checkContent.dictId}-remark`],
              videoImageEntityList: params.imgList.filter(videoObj => videoObj.typeCode == checkContent.dictId)
            })
          )
        })

        // 是否已结案
        let complete = true
        params.videoCheckContentDtoList.forEach(item => {
          if (!item.checkState) complete = false
        })
        // 结案
        if (complete) {
          params.state = 5140
        }
        // 整改
        else {
          params.state = 5120
        }

        delete params.contentList
        delete params.imgList
        delete params.name
        delete params.address

        // 设置审核人信息
        params.examinePeopleId = this.user.id

        // 发送请求
        this.$http.put('/carp/business/a/q/video/check', params).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.details.name + ' 整改已提交')
            this.close()
          } else {
            this.$message.error('发送失败: ' + message)
          }
        })
      })
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/less/common';
.content-item {
  width: 100%;
}
.redRadio {
  .is-checked {
    .el-radio__inner {
      border-color: #f00 !important;
      background: #f00 !important;
    }
    .el-radio__label {
      color: #f00;
    }
  }
}
</style>
