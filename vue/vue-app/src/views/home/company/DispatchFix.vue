<template>
  <div class="company-dispatchFix">
    <myTitle class="mainBox2" titleName="督办派单"></myTitle>
    <div class="top mt50">
      <div class="project">
        <span class="projectName textFlow">督办案件:{{ paramsData.id }}</span>
        <p class="carCreat">
          <span class="state-span updateState" v-if="paramsData.state == $dictionaries.dispatch.wait">待处理</span>
          <span class="state-span updateState" v-if="paramsData.state == $dictionaries.dispatch.handleing">处理中</span>
          <span class="state-span waitState" v-if="paramsData.state == $dictionaries.dispatch.waitCheck">待审核</span>
          <span class="state-span delState" v-if="paramsData.state == $dictionaries.dispatch.reject">已驳回</span>
          <span class="state-span finishState" v-if="paramsData.state == $dictionaries.dispatch.finish">已结案</span>
          <span class="state-span cancelState" v-if="paramsData.state == $dictionaries.dispatch.cancel">已作废</span>
        </p>
      </div>
      <p class="address">
        地址:
        <span v-text="paramsData.address"></span>
      </p>
    </div>
    <div style="padding:30px 10px 10px; background-color: #f9f9f9;">
      <span class="spanBox"></span>
      <span class="title">督办派单检查内容</span>
    </div>
    <div class="upload">
      <MyUpload :module="$dictionaries.imgType.dispatch" @uploadYes="uploadYes"></MyUpload>
      <div style="marginTop:20px">
        <span class="secondMsg" style="color:#646464">备注：</span>
        <van-field type="textarea" v-model="updateDate.remark" />
      </div>
    </div>
    <div style="padding:30px 10px">
      <van-button @click="updateYes" block style="marginTop:30px" type="info">督办处理完成</van-button>
    </div>
  </div>
</template>

<script>
import MyUpload from '@/components/MyUpload.vue'

export default {
  data() {
    return {
      paramsData: {},
      updateDate: {
        imageList: [],
        remark: '',
        taskId: '',
        accountId: ''
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
  },
  components: { MyUpload },
  methods: {
    //返回督办派单详情
    goBack() {
      this.$router.go(-1)
    },
    uploadYes(fileList) {
      this.updateDate.imageList = fileList
    },
    async updateYes() {
      if (this.updateDate.imageList.length == 0) {
        this.$dialog.alert({
          message: '信息不完整',
          confirmButtonColor: 'red'
        })
      } else {
        this.updateDate.taskId = this.paramsData.id
        this.updateDate.accountId = this.$store.state.user.user.id
        let resp = await this.$http.post('/carp/business/a/q/task/finishTask', this.updateDate)
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '处理成功',
            confirmButtonColor: 'green'
          })
          this.goBack()
        } else {
          this.$dialog.alert({
            message: '处理失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
    }
  }
}
</script>

<style lang="less">
.company-dispatchFix {
  text-align: left;
  min-height: 100%;
  .van-field__control {
    border: 1px dotted #c1c1c1;
  }
  .title {
    font-weight: 800;
    color: #9a9a9a;
    margin-left: 10px;
    vertical-align: top;
  }
  .top {
    background-color: #fff;
    padding: 10px;
    .project {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .projectName {
        color: #333;
        font-weight: 600;
        font-size: 18px;
      }
      .carCreat {
        flex-shrink: 0;
      }
    }
    .address {
      color: #949494;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
      line-height: 23px;
      margin-top: 10px;
    }
  }
  .upload {
    background-color: #fff;
    padding: 10px;
  }
}
</style>
