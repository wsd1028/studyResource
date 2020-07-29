<template>
  <div class="company-todayCheckDetail">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="每日巡检详情">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text">基本信息</p>
      <div class="itemContent">
        <van-field :value="mainData.name" disabled label="巡检项目" type="text" />
        <van-field :value="mainData.address" disabled label="巡检地址" type="text" />
        <van-field :value="mainData.checkPeopleName" disabled label="巡检人" type="text" />
        <van-field :value="mainData.createDate" disabled label="巡检时间" type="text" />
      </div>
    </div>
    <div :key="index" class="boxItem" v-for="(item, index) in checkList">
      <div class="text">
        <p class="textFlowP">
          <span class="textFlow">巡检{{ index + 1 }}:{{ item.name }}</span>
        </p>
        <span class="yes" v-if="item.state">合格</span>
        <span class="no" v-else>整改</span>
      </div>
      <div class="itemContent" style="padding:10px 0">
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in item.photo">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item" height="80" width="80" />
          </van-grid-item>
        </van-grid>
        <div class="remark">
          <p>
            备注:
            <span v-text="item.remark"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsData: {},
      checkList: [],
      departmentState: this.$dictionaries.machineType.company,
      mainData: {
        roadState: true,
        siteClean: true,
        rinseDevice: true,
        sprayDevice: true,
        fogGun: true,
        soilCheck: true
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.departmentState = this.$dictionaries.machineType.garbage
    }
    this.getMainData()
  },
  components: {},
  methods: {
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/todays/check/' + this.paramsData.id + '?departmentState=' + this.departmentState)
      if (resp.code == 0) {
        this.mainData = resp.data
        let checkList = []
        for (let i = 0; i < resp.data.contentList.length; i++) {
          let photo = []
          for (let j = 0; j < resp.data.imgList.length; j++) {
            if (resp.data.contentList[i].dictId == resp.data.imgList[j].typeCode) {
              photo.push(resp.data.imgList[j].imageUrl)
              resp.data.contentList[i].name = resp.data.imgList[j].name
            }
          }
          checkList.push({
            name: resp.data.contentList[i].name,
            state: resp.data.contentList[i].checkState,
            remark: resp.data.contentList[i].checkRemark,
            photo
          })
        }
        this.checkList = checkList
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.company-todayCheckDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
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
    .text {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-right: 10px;
      .textFlowP {
        margin: 0;
      }
      .textFlow {
        color: #333;
        margin: 0;
        text-align: left;
      }
      span {
        line-height: 24px;
        text-align: center;
        padding: 2px 15px;
        color: #fff;
        border-radius: 24px;
        margin-left: 10px;
      }
      .yes {
        background-color: #1b7bfe;
        flex-shrink: 0;
      }
      .no {
        background-color: #f34341;
        flex-shrink: 0;
      }
    }
    p {
      color: #979797;
      font-weight: 700;
      margin-bottom: 10px;
      margin-left: 16px;
    }
    .itemContent {
      background-color: #fff;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
      .remark {
        padding: 10px;
        p {
          color: #676767;
          margin-left: 6px;
        }
        span {
          color: #adadad;
        }
        .van-cell {
          padding: 0;
          padding-top: 10px;
        }
        .van-field__control {
          border: 1px dashed #c3c3c3;
        }
      }
    }
  }
}
</style>
