<template>
  <div class="government-todayCheckDetail">
    <myTitle class="mainBox2" titleName="每日巡检详情"></myTitle>
    <div class="boxItem mt50">
      <p class="text">基本信息</p>
      <div class="itemContent">
        <van-field :value="mainData.name" disabled label="巡检项目" type="text" />
        <van-field :value="mainData.address" disabled label="巡检地址" type="text" />
        <van-field :value="mainData.checkPeopleName" disabled label="巡检人" type="text" />
        <van-field :value="mainData.createDate" disabled label="巡检时间" type="text" />
      </div>
    </div>
    <div :key="index" class="boxItem" v-for="(item, index) in checkList">
      <p class="text">
        巡检{{ index + 1 }}:{{ item.name }}
        <span class="yes" v-if="item.state">合格</span>
        <span class="no" v-else>整改</span>
      </p>
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
    this.getMainData()
  },
  components: {},
  methods: {
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/todays/check/' + this.paramsData.id + '?departmentState=' + this.paramsData.departmentState)
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
.government-todayCheckDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  .boxItem {
    margin-top: 30px;
    .text {
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
      }
      .no {
        background-color: #f34341;
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
