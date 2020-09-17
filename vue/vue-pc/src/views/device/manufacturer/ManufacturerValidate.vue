<template>
  <div class="company-validate-container">
    <div class="row">
      <div class="col label">企业名称</div>
      <div class="col" v-text="company.name"></div>
      <div class="col label">企业地址</div>
      <div class="col" v-text="company.address"></div>
    </div>
    <div class="row">
      <div class="col label">登记机关</div>
      <div class="col" v-text="company.regOrgName"></div>
      <div class="col label">税务登记号</div>
      <div class="col" v-text="company.taxNumber"></div>
    </div>
    <div class="row">
      <div class="col label">公司类型</div>
      <div class="col" v-text="company.regType"></div>
      <div class="col label">所属行业</div>
      <div class="col" v-text="company.industry"></div>
    </div>
    <div class="row">
      <div class="col label">经营范围</div>
      <div class="col" v-text="company.businessDes" style="flex:7.48"></div>
    </div>
    <div class="row">
      <div class="col label">注册号</div>
      <div class="col" v-text="company.regNumber"></div>
      <div class="col label">注册日期</div>
      <div class="col" v-text="company.registerDate"></div>
      <div class="col label">注册资金</div>
      <div class="col" v-text="company.regMoney"></div>
    </div>
    <div class="row">
      <div class="col label" style="flex:1.2">社会统一信用代码</div>
      <div class="col">
        <el-input size="mini" placeholder="输入社会统一信用代码" v-model="code"></el-input>
      </div>
      <div class="col label" style="flex:1.2">组织机构代码</div>
      <div class="col">
        <el-input size="mini" placeholder="输入组织机构代码" v-model="companyCode"></el-input>
      </div>
    </div>
    <div class="row submit">
      <el-button type="primary" @click="submit">核验</el-button>
      <el-button type="info" @click="close">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'manufacturerValidate',
  data() {
    return {
      // 社会统一信用代码
      code: '',
      // 组织机构代码
      companyCode: ''
    }
  },
  props: {
    // 企业信息
    company: {
      type: Object,
      default: () => ({})
    },
    // 关闭弹窗方法
    close: Function
  },
  methods: {
    // 提交核验
    submit() {
      if (this.code == this.company.code && this.companyCode == this.company.companyCode) {
        this.$message.success('核验通过')
        this.$emit('validate-complete')
        this.close()
      } else {
        this.$message.error('核验失败')
      }
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.company-validate-container {
  margin: -20px 0 0;
  .row {
    display: flex;
    .col {
      margin: -1px 0 0 -1px;
      padding: 8px 12px;
      line-height: 24px;
      border: #eee solid 1px;
      flex: 3;
      display: flex;
      align-items: center;
      &.label {
        background-color: #f8f8f8;
        color: #999999;
        flex: 1;
      }
    }

    &.submit {
      display: block;
      margin-top: 12px;
      text-align: center;
    }
  }
}
</style>
