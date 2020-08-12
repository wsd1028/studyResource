<template>
  <div class="Feedback">
    <myTitle class="mainBox2" titleName="用户反馈" v-if="$store.state.user.user.accountTypeDto.type == $dictionaries.userType.garbage"></myTitle>
    <div class="boxItem mt50">
      <p class="text">图片</p>
      <div class="itemContent" style="padding:10px">
        <MyUpload :limit="3" @uploadYes="uploadYes"></MyUpload>
      </div>
    </div>
    <div class="boxItem">
      <p class="text">问题</p>
      <div class="itemContent">
        <van-field placeholder="请输入具体问题" type="textarea" v-model="updateData.info" />
      </div>
    </div>
    <div class="boxItem">
      <p class="text">联系方式</p>
      <div class="itemContent">
        <van-form>
          <van-field
            :rules="[{ pattern: checkPhone, message: '请输入正确手机号' }]"
            label="联系电话"
            name="pattern"
            placeholder="请输入联系电话"
            v-model="updateData.phone"
          />
          <van-field
            :rules="[{ pattern: checkEmail, message: '请输入正确邮箱' }]"
            label="邮箱"
            name="pattern"
            placeholder="请输入邮箱"
            v-model="updateData.mailbox"
          />
        </van-form>
      </div>
    </div>
    <van-button @click="updateYes" block style="marginTop:30px" type="info">保存</van-button>
  </div>
</template>

<script>
import { checkPhone, checkEmail } from '@/assets/js/pattern.js'
import MyUpload from '@/components/MyUpload.vue'

export default {
  data() {
    return {
      //图片以及上传列表
      hasUploadImg: [],
      checkPhone,
      checkEmail,
      updateData: {
        userId: '',
        userName: '', //账号名
        info: '', //反馈信息
        createDate: '', //创建时间
        photo: '', //多个图片地址
        phone: '', //电话
        mailbox: '' //邮箱
      }
    }
  },
  mounted() {},
  components: {
    MyUpload
  },
  methods: {
    //上传图片
    uploadYes(fileList) {
      this.hasUploadImg = fileList
    },
    //保存
    async updateYes() {
      this.updateData.userId = this.$store.state.user.user.id
      this.updateData.userName = this.$store.state.user.user.username
      this.updateData.createDate = this.$moment().format('YYYY-MM-DD hh:mm:ss')
      this.updateData.photo = this.hasUploadImg.join(',')
      let bool = true
      //验证必填项
      for (let key in this.updateData) {
        if (!this.updateData[key]) {
          bool = false
        }
      }
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/feedback'
        let resp = await this.$http.post(url, this.updateData)
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '创建成功',
            confirmButtonColor: 'green'
          })
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: '创建失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$dialog.alert({
          message: '信息不完整',
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Feedback {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .boxItem {
    margin-top: 30px;
    p {
      color: #999;
      margin-bottom: 10px;
      margin-left: 16px;
    }
    .itemContent {
      background-color: #fff;
    }
  }
}
</style>
