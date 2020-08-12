<template>
  <div class="MineMsg">
    <myTitle class="mainBox2" titleName="个人信息"></myTitle>
    <div class="mt50"></div>
    <div v-if="userType == 'government'">
      <div style="marginTop:20px">
        <van-field :value="user.username" disabled label="账号" />
        <van-field :value="user.organizationDto.areaName" disabled label="组织机构" />
        <van-field :value="user.accountBaseDto.name" disabled label="姓名" />
        <van-field :value="user.accountBaseDto.idCard" disabled label="身份号" />
        <van-field :value="jobTitleDtoList" disabled label="职务" />
      </div>
      <div class="update" style="marginTop:20px">
        <p class="text">可编辑信息</p>
        <van-field label="区县" placeholder="请输入区县" value />
        <van-field label="科室" placeholder="请输入科室" value />
      </div>
    </div>
    <div v-else>
      <div style="marginTop:20px">
        <van-field :value="user.username" disabled label="账号" />
        <van-field :value="user.organizationDto.areaName" disabled label="组织机构" />
        <van-field :value="jobTitleDtoList" disabled label="职务" />
      </div>
      <div class="update" style="marginTop:20px">
        <p class="text">可编辑信息</p>
        <van-form>
          <van-field label="姓名" placeholder="请输入姓名" v-model="updateData.name" />
          <van-field
            :rules="[{ pattern: checkPhone, message: '请输入正确手机号' }]"
            label="联系电话"
            name="pattern"
            placeholder="请输入联系电话       "
            v-model="updateData.phone"
          />
        </van-form>
      </div>
    </div>
    <van-button block style="marginTop:30px" type="info">保存</van-button>
  </div>
</template>

<script>
import { checkPhone } from '@/assets/js/pattern.js'

export default {
  data() {
    return {
      userType: 'government',
      checkPhone,
      jobTitleDtoList: '',
      user: {
        username: '',
        organizationDto: {},
        accountBaseDto: {}
      },
      updateData: {
        name: '',
        phone: ''
      }
    }
  },
  mounted() {
    this.user = this.$store.state.user.user
    this.updateData.name = this.user.accountBaseDto.name
    this.updateData.phone = this.user.accountBaseDto.phone
    try {
      if (this.user.organizationDto.areaName) {
      }
    } catch {
      this.user.organizationDto = {}
    }

    for (let i = 0; i < this.user.jobTitleDtoList.length; i++) {
      if (i != 0) {
        this.jobTitleDtoList += '/'
      }
      this.jobTitleDtoList += this.user.jobTitleDtoList[i].name
    }
    if (this.$store.state.user.user.accountTypeDto.type == 30 || this.$store.state.user.user.accountTypeDto.type == 60) {
      this.userType = 'company'
    }
  },
  components: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.MineMsg {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .update {
    p {
      color: #999;
      margin-bottom: 10px;
      margin-left: 16px;
    }
  }
}
</style>
