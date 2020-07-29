<template>
  <div class="dispatchDetail">
    <van-dialog :showConfirmButton="false" class="tips" title v-model="dialog.state">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon :color="dialog.color" :name="dialog.myIcon" class-prefix="iconfont" size="20" v-if="dialog.myIcon" />
          <van-icon :color="dialog.color" :name="dialog.icon" size="20" v-else />
          <span class="tipsMsg" v-text="dialog.title"></span>
        </p>
        <p class="tipsMsg" v-text="dialog.text"></p>
        <div class="tipsbtns">
          <van-button @click="dialog.state = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button @click="handelPowerYes(dialog.type)" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <van-dialog :showConfirmButton="false" class="tips" overlay-class="myOverlay" title v-model="finishDia">
      <van-icon @click="finishDia = false" class="close-icon" name="clear" size="20" />
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon color="#4186f6" name="checked" size="20" />
          <span class="tipsMsg">确认结案?</span>
        </p>
        <p class="tipsMsg">结案后案件将无法操作和修改!</p>
        <van-button @click="handelFinish(true)" block round size="large" style="margin-top:10px" type="info">完成任务结案</van-button>
        <van-button @click="handelFinish(false)" block round size="large" style="margin-top:10px" type="danger">未完成任务结案</van-button>
      </div>
    </van-dialog>
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="督办派单详情">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="top">
      <div class="project">
        <span class="projectName textFlow">督办案件:{{ mainData.id }}</span>
        <p class="carCreat">
          <span class="state-span updateState" v-if="mainData.state == $dictionaries.dispatch.wait">待处理</span>
          <span class="state-span updateState" v-if="mainData.state == $dictionaries.dispatch.handleing">处理中</span>
          <span class="state-span waitState" v-if="mainData.state == $dictionaries.dispatch.waitCheck">待审核</span>
          <span class="state-span delState" v-if="mainData.state == $dictionaries.dispatch.reject">已驳回</span>
          <span class="state-span finishState" v-if="mainData.state == $dictionaries.dispatch.finish">已结案</span>
          <span class="state-span cancelState" v-if="mainData.state == $dictionaries.dispatch.cancel">已作废</span>
        </p>
      </div>
      <p class="address">
        地址:
        <span v-text="mainData.address"></span>
      </p>
    </div>
    <div class="powers">
      <div @click="handelPowerBtn('接单', mainData.taskButtonStateVO.receiveButton)" class="powerBtn" v-if="mainData.sponsorId != userMsg.id">
        <van-image :src="getBtnImg('案件接单', mainData.taskButtonStateVO.receiveButton)" height="20" width="15" />
        <p :style="{ color: mainData.taskButtonStateVO.receiveButton ? '' : '#969799' }">案件接单</p>
      </div>
      <div @click="handelPowerBtn('拒绝', mainData.taskButtonStateVO.refuseButton)" class="powerBtn" v-if="mainData.sponsorId != userMsg.id">
        <van-image :src="getBtnImg('案件拒绝', mainData.taskButtonStateVO.refuseButton)" height="20" width="15" />
        <p :style="{ color: mainData.taskButtonStateVO.refuseButton ? '' : '#969799' }">案件拒绝</p>
      </div>
      <div @click="handelPowerBtn('转发', mainData.taskButtonStateVO.transmitButton)" class="powerBtn">
        <van-image :src="getBtnImg('案件转发', mainData.taskButtonStateVO.transmitButton)" height="20" width="15" />
        <p :style="{ color: mainData.taskButtonStateVO.transmitButton ? '' : '#969799' }">案件转发</p>
      </div>
      <div @click="handelPowerBtn('撤回', mainData.taskButtonStateVO.withdrawButton)" class="powerBtn">
        <van-image :src="getBtnImg('案件撤回', mainData.taskButtonStateVO.withdrawButton)" height="20" width="15" />
        <p :style="{ color: mainData.taskButtonStateVO.withdrawButton ? '' : '#969799' }">案件撤回</p>
      </div>
      <div @click="handelPowerBtn('作废', mainData.taskButtonStateVO.invalidButton)" class="powerBtn" v-if="mainData.sponsorId == userMsg.id">
        <van-image :src="getBtnImg('案件作废', mainData.taskButtonStateVO.invalidButton)" height="20" width="15" />
        <p :style="{ color: mainData.taskButtonStateVO.invalidButton ? '' : '#969799' }">案件作废</p>
      </div>
    </div>
    <section>
      <van-tabs color="#4683f1" swipeable>
        <van-tab title="督办是由">
          <div class="item">
            <van-field disabled label="创建时间" v-model="mainData.createDate" />
            <van-field disabled label="市区县" v-model="mainData.areaName" />
            <van-field disabled label="部门" v-model="mainData.dept" />
            <van-field disabled label="发起人" v-model="mainData.sponsorName" />
            <van-field disabled label="电话" v-model="mainData.phone" />
          </div>
          <div class="item">
            <div>
              <p class="title">图片</p>
              <div class="imgList">
                <MyImage
                  :imgUrl="$dictionaries.imgBaseUrl + item"
                  :key="index"
                  style="margin:5px;flexShrink:0"
                  v-for="(item, index) in mainData.startImageList"
                />
              </div>
            </div>
            <div style="marginTop:20px">
              <p class="title">描述</p>
              <p class="msg" v-text="mainData.startDescription"></p>
            </div>
          </div>
        </van-tab>
        <van-tab title="督办经过">
          <div class="pass">
            <van-steps :active="processList.length - 1" direction="vertical">
              <van-step :key="index" v-for="(item, index) in processList">
                <h3>
                  <span v-text="item.sort"></span>.
                  <span v-text="$dictionaries.dispatch.process[item.nowState]"></span>
                </h3>
                <p class="passMsg">
                  创建时间:
                  <span v-text="item.createDate"></span>
                </p>
                <p class="passMsg">
                  市区县:
                  <span v-text="item.areaName"></span>
                </p>
                <p class="passMsg">
                  部门:
                  <span v-text="item.dept"></span>
                </p>
                <p class="passMsg">
                  处理人:
                  <span v-text="item.procesor"></span>
                </p>
                <p class="passMsg">
                  电话:
                  <span v-text="item.phone"></span>
                </p>
              </van-step>
            </van-steps>
          </div>
        </van-tab>
        <van-tab title="督办结果" v-if="mainData.state != $dictionaries.dispatch.wait">
          <div class="item" v-if="mainData.resultImageList.length > 0">
            <div>
              <p class="title">图片</p>
              <div class="imgList">
                <MyImage
                  :imgUrl="$dictionaries.imgBaseUrl + item"
                  :key="index"
                  style="margin:5px;flexShrink:0"
                  v-for="(item, index) in mainData.resultImageList"
                />
              </div>
            </div>
            <div style="marginTop:20px">
              <p class="title">描述</p>
              <p class="msg" v-text="mainData.resDescription"></p>
            </div>
          </div>
          <div style="text-align:center;padding:30px 0" v-else>
            <van-icon class-prefix="iconfont" color="rgb(150, 151, 153)" name="zanwujieguo" size="80" />
            <p style="color:rgb(150, 151, 153)">暂无结果</p>
          </div>
          <div class="btns">
            <van-button
              @click="finishDia = true"
              block
              class="mybtn"
              type="info"
              v-if="mainData.state == $dictionaries.dispatch.waitCheck && mainData.sponsorId == $store.state.user.user.id"
            >
              <!-- eslint -->
              结案
            </van-button>
            <van-button
              @click="handelPowerBtn('驳回')"
              block
              class="mybtn2"
              type="default"
              v-if="mainData.state == $dictionaries.dispatch.waitCheck && mainData.sponsorId == $store.state.user.user.id"
            >
              <!-- eslint -->
              驳回
            </van-button>
            <van-button
              @click="handelFix(mainData)"
              block
              class="mybtn"
              type="info"
              v-if="
                (mainData.state == $dictionaries.dispatch.handleing || mainData.state == $dictionaries.dispatch.reject) &&
                  mainData.receiverId == $store.state.user.user.id
              "
            >
              <!-- eslint -->
              立即处理
            </van-button>
          </div>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainData: {
        resultImageList: [],
        startImageList: [],
        taskButtonStateVO: {}
      },
      paramsData: {},
      processList: [],
      userMsg: {},
      finishDia: false,
      dialog: {
        state: false,
        text: '',
        icon: '',
        myIcon: '',
        title: ''
      }
    }
  },
  async mounted() {
    this.userMsg = this.$store.state.user.user
    if (JSON.stringify(this.$route.params) == '{}') {
      this.paramsData = this.$store.state.user.paramsData
    } else {
      this.paramsData = this.$route.params
      this.$store.commit('setParamsData', this.paramsData)
    }
    this.getMainData()
    this.getProcess()
  },
  components: {},
  methods: {
    async handelFinish(bool) {
      let finishType = this.$dictionaries.dispatch.finishNo
      if (bool) finishType = this.$dictionaries.dispatch.finishYes
      let url = `/carp/business/a/q/task/checkTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}&finishType=${finishType}`
      let resp = await this.$http.post(url)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '结案' + '成功',
          confirmButtonColor: 'green'
        })
        this.finishDia = false
        this.getMainData()
        this.getProcess()
      } else {
        this.$dialog.alert({
          message: '结案' + '失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    async handelPowerYes(type) {
      let url = ''
      let resp = {}
      if (type == '撤回') {
        url = `/carp/business/a/q/task/withdrawTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}`
      }
      if (type == '作废') {
        url = `/carp/business/a/q/task/invaildTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}`
      }
      if (type == '驳回') {
        url = `/carp/business/a/q/task/rejectTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}`
      }
      if (type == '拒绝') {
        url = `/carp/business/a/q/task/refuseTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}`
      }
      if (type == '接单') {
        url = `/carp/business/a/q/task/receiveTask?accountId=${this.userMsg.id}&taskId=${this.paramsData.id}`
      }
      resp = await this.$http.post(url)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: type + '成功',
          confirmButtonColor: 'green'
        })
        if (type == '拒绝') {
          this.$router.go(-1)
          return
        }
        this.dialog.state = false
        this.getMainData()
        this.getProcess()
      } else {
        this.$dialog.alert({
          message: type + '失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //点击功能按钮
    handelPowerBtn(title, bool = true) {
      if (!bool) return
      if (title == '转发') {
        this.$router.push({
          name: 'dispatchForward',
          params: this.mainData
        })
      }
      if (title == '撤回') {
        this.dialog = {
          type: title,
          state: true,
          text: '撤回案件后将可以重新转发!',
          myIcon: 'chehui',
          color: '#f6404f',
          title: '确认' + title + '此案件'
        }
      }
      if (title == '作废') {
        this.dialog = {
          type: title,
          state: true,
          text: '',
          myIcon: '',
          icon: 'clear',
          color: '#f6404f',
          title: '确认' + title + '此案件'
        }
      }
      if (title == '驳回') {
        this.dialog = {
          type: title,
          state: true,
          text: '',
          myIcon: '',
          icon: 'clear',
          color: '#f6404f',
          title: '确认' + title + '此案件'
        }
      }
      if (title == '拒绝') {
        this.dialog = {
          type: title,
          state: true,
          text: '拒绝后案件将回退给上一级',
          myIcon: '',
          icon: 'clear',
          color: '#f6404f',
          title: '确认' + title + '此案件'
        }
      }
      if (title == '接单') {
        this.dialog = {
          type: title,
          state: true,
          text: '接受此案件后只能自行处理完成',
          myIcon: '',
          icon: 'checked',
          color: '#67c23a',
          title: '确认' + '接收' + '此案件'
        }
      }
    },
    //得到功能按钮图标
    getBtnImg(name, status) {
      return require('@/assets/image/' + name + '-' + (status ? '1' : '2') + '.png')
    },
    //审核完成
    async checkYes() {
      let resp = await this.$http.post('/carp/business/a/q/task/taskId?taskId=' + this.mainData.id)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '审核成功',
          confirmButtonColor: 'green'
        })
        this.getMainData()
        this.getProcess()
      } else {
        this.$dialog.alert({
          message: '审核失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //立即处理
    handelFix(params) {
      this.$router.push({
        name: 'dispatchFix',
        params
      })
    },
    //获取详细信息
    async getMainData() {
      let resp = await this.$http.get(`/carp/business/a/q/task/pass?accountId=${this.$store.state.user.user.id}&taskId=${this.paramsData.id}`)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //获取经过
    async getProcess() {
      let resp = await this.$http.get('/carp/business/a/q/task/process/' + this.paramsData.id)
      if (resp.code == 0) {
        this.processList = resp.data.taskVOList
      } else {
        this.$dialog.alert({
          message: '获取督办经过失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dispatchDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .close-icon {
    position: absolute;
    right: 0px;
    top: 0px;
  }
  .title {
    font-weight: 800;
    color: #333;
    margin-bottom: 10px;
  }
  .title2 {
    font-weight: 800;
    color: #333;
    margin: 10px;
  }
  .powers {
    display: flex;
    padding: 10px 0;
    flex-wrap: wrap;
    background-color: #fff;
    .powerBtn {
      flex-shrink: 0;
      text-align: center;
      font-weight: 800;
      padding: 0 10px;
    }
  }
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
  .item {
    margin-top: 10px;
    background-color: #fff;
    padding: 10px;
    .imgList {
      display: flex;
      flex-wrap: wrap;
    }
    .msg {
      color: #949494;
      font-size: 14px;
      line-height: 23px;
      text-indent: 40px;
    }
  }
  .btns {
    display: flex;
    margin-top: 30px;
    .mybtn {
      flex-grow: 1;
      font-weight: 800;
    }
    .mybtn2 {
      flex-grow: 1;
      color: #3e89f1 !important;
      font-weight: 800;
    }
  }
  .pass {
    padding: 10px 20px;
    background-color: #fff;
    .passMsg {
      color: #949494;
      font-size: 14px;
      line-height: 23px;
      margin-top: 5px;
    }
  }
}
</style>
