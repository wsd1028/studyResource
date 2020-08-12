<template>
  <div class="CreatForm">
    <myTitle class="mainBox2" titleName="创建联单"></myTitle>
    <div class="mt50">
      <div class="head">排放企业</div>
      <van-divider />
      <div class="project-info">
        <van-cell :border="false" :value="project.name" icon="newspaper-o" title="项目名:" />
        <van-cell :border="false" :value="project.address" icon="location-o" title="地址:" />
        <van-cell :border="false" :value="$store.state.user.user.accountBaseDto.name" icon="user-o" title="排放员:" />
        <van-cell :border="false" icon="coupon-o" title="车牌号:" />
        <van-field @input="licenseInput" maxlength="7" placeholder="请输入车牌号" rows="1" type="textarea" v-model="metaForm.license" />
        <div class="license" v-show="metaForm.license.length > 0">
          <van-field :disabled="true" :key="index" maxlength="1" rows="1" type="textarea" v-for="index in 7" v-model="license[index].value" />
        </div>
      </div>
      <div class="create">
        <van-button :loading="btnLoading" @click="create" block loading-text="加载中..." type="info">创建</van-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //项目对象
      project: {},
      btnLoading: false,
      //车牌号
      license: {
        '1': {
          value: ''
        },
        '2': {
          value: ''
        },
        '3': {
          value: ''
        },
        '4': {
          value: ''
        },
        '5': {
          value: ''
        },
        '6': {
          value: ''
        },
        '7': {
          value: ''
        }
      },
      //路由参数
      metaForm: {
        license: '',
        projectId: '',
        accountId: ''
      }
    }
  },
  components: {},
  mounted() {
    this.metaForm.projectId = this.$store.state.user.project.projectId
    this.metaForm.accountId = this.$store.state.user.user.accountTypeDto.accountId
    this.getProject()
  },
  methods: {
    // 正则验证车牌,验证通过返回true,不通过返回false
    isLicensePlate(str) {
      return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
        str
      )
    },
    //输入车牌号触发事件
    licenseInput(value) {
      let arr = value.split('') //将车牌号字符串转为数组
      //将输入的车牌号赋值给车牌框
      for (let i = 0; i < 7; i++) {
        this.license[i + 1].value = arr[i]
      }
    },
    //得到项目信息
    getProject() {
      this.$http.get('/carp/business/a/q/project/' + this.$store.state.user.project.id).then(resp => {
        if (resp.code == 0) {
          this.project = resp.data
        }
      })
    },
    //点击创建
    create() {
      let that = this
      if (this.isLicensePlate(this.metaForm.license)) {
        this.btnLoading = true
        this.$http.post('/carp/business/a/q/start/form/electronic', this.$qs.stringify(this.metaForm)).then(resp => {
          that.btnLoading = false
          if (resp.code == 0) {
            this.$router.replace({
              name: 'formDetail',
              params: {
                formUrl: 'createForm',
                ...resp.data
              }
            })
          } else {
            this.$dialog.alert({
              message: '创建失败:' + resp.message,
              confirmButtonColor: 'red'
            })
          }
        })
      } else {
        this.$toast('车牌号不正确')
      }
    }
  }
}
</script>

<style lang="less">
.CreatForm {
  canvas {
    background-color: red !important;
    border: 1px solid black;
  }
  .van-cell__title {
    flex: 0.5;
  }
  .license {
    display: flex;
    padding: 0 10px;
    .van-cell {
      padding: 0;
    }
    .van-field--min-height .van-field__control {
      min-height: auto;
      height: 40px;
      flex-grow: 1;
      border: 1px solid #999;
      font-size: 25px;
      text-align: center;
      line-height: 40px;
      margin-right: 5px;
    }
  }

  .head {
    margin-top: 15px;
    font-size: 18px;
    margin-left: 21px;
    font-weight: 800;
    text-align: left;
  }
  .project-info {
    text-align: left;
  }
  .create {
    padding: 10px;
    margin-top: 10px;
  }
}
</style>
