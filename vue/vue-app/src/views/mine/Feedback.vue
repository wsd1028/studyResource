<template>
  <div class="Feedback">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="用户反馈">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text">图片</p>
      <div class="itemContent">
        <div style="display:flex;flexWrap:wrap;width:100%">
          <van-image :key="index" :src="item" height="80" style="margin:5px;flexShrink:0" v-for="(item, index) in hasUploadImg" width="80" />
          <van-uploader :accept="'image/*'" :after-read="afterRead" multiple style="margin:5px;flexShrink:0" v-model="fileList" />
        </div>
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
export default {
  data() {
    return {
      //图片上传列表
      fileList: [],
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
  components: {},
  methods: {
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
    },
    //文件选中之后调用
    async afterRead(file) {
      let imgList = [file.content]
      //给上传中的文件添加上传表示
      this.fileList[0].message = '上传中...'
      this.fileList[0].status = 'uploading'
      let resp = await this.$http.post('/carp/business/a/q/upload/uploadImgs', JSON.stringify(imgList), { headers: { 'Content-Type': 'application/json' } })
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '上传成功',
          confirmButtonColor: 'green'
        })
        this.hasUploadImg.push(resp.data[0])
      } else {
        this.$dialog.alert({
          message: '上传失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      this.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.Feedback {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  header {
    background-color: #fff;
    .nav {
      text-align: left;
      line-height: 42px;
      i {
        color: #666;
      }
      .van-nav-bar__title {
        font-weight: 800;
        font-size: 18px !important;
      }
    }
  }
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
