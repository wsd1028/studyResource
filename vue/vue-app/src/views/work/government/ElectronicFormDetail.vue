<template>
  <div class="workGov-electronicFormDetail">
    <myTitle class="mainBox2" titleName="联单详情"></myTitle>
    <div class="section mt50">
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title" style="marginLeft:20px">排放企业</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem">
            <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
            <span class="text" v-text="formDetail.projectCompany"></span>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="dizhi" />
            <span class="text" v-text="formDetail.address"></span>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="ren" />
            <span class="text">排放员：{{ formDetail.accountStr }}</span>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">联单状态</p>
        </div>
        <van-divider />
        <van-steps :active="getActive(formDetail.state)" class="mySteps">
          <van-step>待检查</van-step>
          <van-step>运输中</van-step>
          <van-step>已消纳</van-step>
        </van-steps>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">车牌识别照片</p>
        </div>
        <div class="msgItem jcb" style="display:block;textAlign:left">
          <div style="display:flex;flexWrap:wrap;width:100%">
            <MyImage
              :imgUrl="$dictionaries.imgBaseUrl2 + item"
              :key="index"
              height="80"
              style="margin:5px;flexShrink:0"
              v-for="(item, index) in formDetail.carPhoto"
              width="80"
            />
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">运输企业</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem">
            <van-image :src="require('@/assets/image/index_icon7.png')" height="18" width="22" />
            <span class="label">车牌号:</span>
            <span class="value" style="marginRight:10px" v-text="formDetail.licenseNumber"></span>
            <van-tag plain type="success" v-if="formDetail.carState">名录车</van-tag>
            <van-tag plain type="danger" v-else>非名录车</van-tag>
          </div>
          <div class="msgItem dfsb">
            <p class="dfsb">
              <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
              <span class="label">所属企业:</span>
            </p>
            <p class="textFlowP">
              <span class="value textFlow" v-text="formDetail.companyName"></span>
            </p>
          </div>
          <div class="msgItem">
            <van-icon class-prefix="iconfont" name="ren" />
            <span class="label">司机:</span>
            <span class="value" v-text="formDetail.driverName"></span>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">固定源检查信息</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="checkMsg msgItem">
            <div class="checkItem">
              <span class="label">建渣类型:</span>
              <span class="value" v-text="formDetail.garbageTypeStr"></span>
            </div>
            <div class="checkItem">
              <span class="label">建渣重量:</span>
              <span class="value">{{ formDetail.weight }}Kg</span>
            </div>
            <div class="checkItem">
              <span class="label">建渣立方:</span>
              <span class="value">{{ formDetail.cube }}方</span>
            </div>
            <div class="checkItem">
              <span class="label2">是否冲洗干净:</span>
              <span class="value">{{ formDetail.clean ? '干净' : '不干净' }}</span>
            </div>
            <div class="checkItem">
              <span class="label2">篷布是否覆盖:</span>
              <span class="value">{{ formDetail.cover ? '覆盖' : '未覆盖' }}</span>
            </div>
            <div class="checkItem">
              <span class="label">是否超重:</span>
              <span class="value">{{ formDetail.overload ? '超重' : '未超重' }}</span>
            </div>
            <div class="checkItem">
              <span class="label">是否超高:</span>
              <span class="value">{{ formDetail.height ? '超高' : '未超高' }}</span>
            </div>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">车辆固定源照片:</span>
            <div style="display:flex;flexWrap:wrap;width:100%">
              <MyImage
                :imgUrl="$dictionaries.imgBaseUrl2 + item"
                :key="index"
                height="80"
                style="margin:5px;flexShrink:0"
                v-for="(item, index) in formDetail.adminPhoto"
                width="80"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">司机签名</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem" style="alignItems:center">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + formDetail.driverSignImage" v-if="formDetail.driverSignImage" />
          </div>
        </div>
      </div>
      <div class="sectionItem">
        <div class="top">
          <div class="box"></div>
          <p class="title">消纳企业</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="msgItem" style="alignItems:center">
            <div class="dfsb">
              <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
              <span class="text" style="width:100px">企业名称:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ formDetail.name }}</span>
            </p>
          </div>
          <div class="msgItem" style="alignItems:center">
            <div class="dfsb">
              <van-icon class-prefix="iconfont" name="dizhi" />
              <span class="text textFlow" style="width:100px">消纳地址:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ formDetail.garbageStationAddress }}</span>
            </p>
          </div>
          <div class="msgItem" style="alignItems:center" v-if="formDetail.endAccountId">
            <div class="dfsb">
              <van-icon class-prefix="iconfont" name="ren" />
              <span class="text" style="width:100px">消纳员:</span>
            </div>
            <p class="textFlowP">
              <span class="text textFlow">{{ formDetail.endAccountStr }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="sectionItem" v-if="formDetail.state == $dictionaries.electronic.xiaona">
        <div class="top">
          <div class="box"></div>
          <p class="title">消纳场检查信息</p>
        </div>
        <van-divider />
        <div class="msg">
          <div class="checkMsg msgItem">
            <div class="checkItem">
              <span class="label">建渣类型:</span>
              <span class="value" v-text="formDetail.endGarbageTypeStr"></span>
            </div>
            <div class="checkItem">
              <span class="label">建渣重量:</span>
              <span class="value">{{ formDetail.endWeight }}Kg</span>
            </div>
            <div class="checkItem">
              <span class="label">建渣立方:</span>
              <span class="value">{{ formDetail.endCube }}方</span>
            </div>
            <div class="checkItem">
              <span class="label2">是否冲洗干净:</span>
              <span class="value">{{ formDetail.endClean ? '干净' : '不干净' }}</span>
            </div>
            <div class="checkItem">
              <span class="label2">篷布是否覆盖:</span>
              <span class="value">{{ formDetail.endCover ? '覆盖' : '未覆盖' }}</span>
            </div>
            <div class="checkItem">
              <span class="label">是否超重:</span>
              <span class="value">{{ formDetail.endOverload ? '超重' : '未超重' }}</span>
            </div>
            <div class="checkItem">
              <span class="label">是否超高:</span>
              <span class="value">{{ formDetail.endHeight ? '超高' : '未超高' }}</span>
            </div>
          </div>
          <div class="msgItem jcb" style="display:block;textAlign:left">
            <span class="label2" style="display:block;marginBottom:10px;textAlign:left">车辆消纳场照片:</span>
            <div style="display:flex;flexWrap:wrap;width:100%">
              <MyImage
                :imgUrl="$dictionaries.imgBaseUrl2 + item"
                :key="index"
                height="80"
                style="margin:5px;flexShrink:0"
                v-for="(item, index) in formDetail.endAdminPhoto"
                width="80"
              />
            </div>
          </div>
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
      //页面详细
      formDetail: {}
    }
  },
  async mounted() {
    //获取路由参数
    this.paramsData = this.$route.params
    await this.getMainData()
  },
  components: {},
  methods: {
    //联单状态
    getActive(state) {
      if (state < this.$dictionaries.electronic.yunshu) {
        return 0
      } else if (state < this.$dictionaries.electronic.xiaona) {
        return 1
      } else {
        return 2
      }
    },
    //得到页面详细数据
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/electronic/workflow/' + this.paramsData.id)
      if (resp.code == 0) {
        this.formDetail = resp.data
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
<style lang="less" scoped>
.workGov-electronicFormDetail {
  background-color: #f9f9f9;
  padding-bottom: 30px;
  text-align: left;
  .section {
    .sectionItem {
      margin-top: 10px;
      padding: 16px;
      background-color: #fff;
      margin-bottom: 10px;
      .checkMsg {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        text-align: left;
        .checkItem {
          width: 50%;
          flex-shrink: 0;
          margin: 5px 0;
          text-align: left !important;
          .label2 {
            width: 115px !important;
            display: inline-block;
            text-align: center;
            flex-shrink: 0;
          }
        }
      }
      .myBtn {
        width: 45%;
        border-radius: 4px;
      }
      .van-divider {
        margin: 0;
      }
      .mySteps {
        text-align: left;
      }
      .top {
        height: 40px;
        line-height: 40px;
        display: flex;
        align-items: center;
        .box {
          background-color: #4186f4;
          width: 6px;
          height: 20px;
          margin-right: 10px;
        }
        .title {
          color: #000;
          font-weight: 800;
          font-size: 18px;
          margin: 0;
        }
      }
      .jcb {
        display: flex;
        justify-content: space-between;
      }
      .msg {
        .msgItem {
          font-size: 18px;
          color: #666;
          display: flex;
          margin-top: 16px;
          align-items: center;
          .van-cell {
            padding: 0;
          }
          .van-dropdown-menu__title::after {
            border-color: transparent transparent #4484ee #4484ee;
          }
          .van-cell {
            width: 150px;
          }
          .myTag {
            padding: 4px 10px;
            font-size: 18px;
            margin: 4px 10px;
            border-radius: 16px;
            display: inline-block;
            color: #fff;
          }
          .iconfont {
            font-size: 18px;
          }
          .text {
            margin-left: 20px;
            flex-shrink: 0;
            flex-shrink: 0;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            text-align: left;
          }
          .label {
            width: 90px;
            display: inline-block;
            text-align: center;
            flex-shrink: 0;
          }
          .label2 {
            width: auto;
            display: inline-block;
            text-align: center;
            flex-shrink: 0;
          }
          .value {
            color: #333;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}
</style>
