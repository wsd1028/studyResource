<template>
  <div class="Work">
    <header>
      <p class="title">工作台</p>
    </header>
    <div class="box">
      <div style="padding:0 50px">
        <van-divider>
          <span class="title2">宜宾市扬尘治理平台</span>
        </van-divider>
      </div>
      <div class="allIconBox">
        <div class="tac">
          <div @click="goSkip('work-workBusiness', { active: 'wait' })" class="iconBox">
            <van-icon class-prefix="iconfont" class="blue" name="daiban" />
          </div>
          <span class="text">待办</span>
        </div>
        <div class="tac">
          <div @click="goSkip('work-workBusiness', { active: 'mine' })" class="iconBox">
            <van-icon class-prefix="iconfont" class="orange" name="faqi" />
          </div>
          <span class="text">发起</span>
        </div>
        <div class="tac">
          <div @click="goSkip('work-workBusiness', { active: 'finish' })" class="iconBox">
            <van-icon class-prefix="iconfont" class="green" name="chuli" />
          </div>
          <span class="text">已处理</span>
        </div>
      </div>
    </div>
    <div class="box">
      <div style="padding:0 50px">
        <van-divider>
          <span class="title2">智慧工地管理</span>
        </van-divider>
      </div>
      <div class="allIconBox">
        <div class="tac">
          <div @click="goSkip('work-carIdentify', {})" class="iconBox">
            <van-image :src="require('@/assets/image/work_icon3.png')" height="50" width="50" />
          </div>
          <span class="text">车辆识别</span>
        </div>
        <div class="tac">
          <div @click="goSkip('company-problemReport', {})" class="iconBox">
            <van-image :src="require('@/assets/image/work_icon4.png')" height="50" width="50" />
          </div>
          <span class="text">问题上报</span>
        </div>
        <div class="tac">
          <div @click="goSkip('work-electronicForm', {})" class="iconBox">
            <van-image :src="require('@/assets/image/work_icon5.png')" height="50" width="50" />
          </div>
          <span class="text">电子联单</span>
        </div>
        <div class="tac" v-if="$store.state.user.user.accountTypeDto.type === $dictionaries.userType.project">
          <div @click="goSkip('work-duration', {})" class="iconBox">
            <van-image :src="require('@/assets/image/work_icon6.png')" height="50" width="50" />
          </div>
          <span class="text">工期管理</span>
        </div>
        <div class="tac" v-if="$store.state.user.user.accountTypeDto.type === $dictionaries.userType.project">
          <div @click="handelVideo" class="iconBox">
            <van-image :src="require('@/assets/image/work_government_icon8.png')" height="50" width="50" />
          </div>
          <span class="text">音视频巡检</span>
        </div>
        <div class="tac">
          <div @click="handelFlowVideo" class="iconBox">
            <van-image :src="require('@/assets/image/流媒体视频.png')" height="50" width="50" />
          </div>
          <span class="text">流媒体视频</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  components: {},
  methods: {
    handelVideo() {
      let userMsg = this.$store.state.user.user
      let projectMsg = this.$store.state.user.project
      let data = {
        type: userMsg.accountTypeDto.type,
        token: this.$store.state.user.token,
        projectId: projectMsg.id,
        projectName: projectMsg.name,
        projectStartDate: projectMsg.createDate,
        projectEndDate: projectMsg.completeDate,
        username: userMsg.username,
        areaCode: userMsg.accountTypeDto.code,
        mobile: userMsg.accountBaseDto.phone,
        name: userMsg.accountBaseDto.name
      }
      if (window.jsCall) {
        window.jsCall.videoInspectionList(JSON.stringify(data))
      } else {
        this.$router.push({
          name: 'work-videoCheck'
        })
      }
    },
    //跳转页面
    goSkip(name, params) {
      this.$router.push({
        name: name,
        params: params
      })
    },
    handelFlowVideo() {
      this.$store.commit('setWorkId', this.$store.state.user.project.id)
      this.$router.push({
        path: '/work/company/streamingMedia'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.Work {
  background-color: #f9f9f9;
  height: auto;
  padding-bottom: 50px;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
}
.title {
  font-weight: 800;
  color: #333;
  font-size: 20px;
}
.title2 {
  font-weight: 800;
  color: #333;
  font-size: 16px;
}
.van-divider {
  border-color: #e1e9ee;
}
.van-divider::after,
.van-divider::before {
  border-width: 4px 0 0;
  width: 50px;
}
.box {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  .allIconBox {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .tac {
      width: 33%;
      flex-shrink: 0;
      margin-top: 30px;
    }
    .iconBox {
      height: 50px;
      i {
        color: #fff;
        font-weight: 800;
        font-size: 24px;
        width: 50px;
        height: 50px;
        border-radius: 100%;
        line-height: 50px;
        text-align: center;
        display: inline-block;
      }
    }
    .text {
      color: #343434;
      font-size: 18px;
      margin-top: 20px;
      display: inline-block;
      width: 100%;
    }
  }
}

.blue {
  background-color: #349cfa;
}
.orange {
  background-color: #ff7201;
}
.green {
  background-color: #19c363;
}
.yellow {
  background-color: #fc9900;
}
.yellow2 {
  background-color: #ff9700;
}
.red {
  background-color: #fe0100;
}
.violet {
  background-color: #b801fc;
}
.skyblue {
  background-color: #329df4;
}
</style>
