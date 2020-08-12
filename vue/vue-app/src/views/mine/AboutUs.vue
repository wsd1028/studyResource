<template>
  <div class="Password">
    <van-dialog @confirm="updateYes" confirmButtonText="下载" show-cancel-button title="检查更新" v-model="showUpdate">
      <div class="top" style="paddingTop:10px">
        <div>
          <img alt src="../../assets/image/yibin_logo.png" style="width:80px;height:80px" />
          <p style="margin:10px 0;fontWeight:800;color:#343434">惠工云</p>
          <span style="color:#2b74ed;fontSize:10px">v2.0.0</span>
        </div>
      </div>
    </van-dialog>
    <myTitle class="mainBox2" titleName="关于我们"></myTitle>
    <div class="top mt50">
      <div>
        <img alt src="../../assets/image/yibin_logo.png" style="width:100px;height:100px" />
        <p style="margin:10px 0;fontWeight:800;color:#343434">惠工云</p>
        <span style="color:#2b74ed;fontSize:10px">v1.0.0_1234</span>
      </div>
    </div>
    <div class="update" style="marginTop:20px">
      <van-cell @click="checkUpdate" class="item" is-link>
        <template #title>
          <div>
            <span class="text">检查更新</span>
          </div>
        </template>
      </van-cell>
      <van-cell class="item" is-link to="/mine/versionHistory">
        <template #title>
          <div>
            <span class="text">版本更新记录</span>
          </div>
        </template>
      </van-cell>
      <van-cell class="item" is-link to="/mine/protocol">
        <template #title>
          <div>
            <span class="text">惠工云协议与说明</span>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //检查更新弹窗
      showUpdate: false
    }
  },
  components: {},
  methods: {
    //检查更新
    checkUpdate() {
      let bool = true
      if (bool) {
        this.showUpdate = true
      } else {
        this.$toast('已是最新版本,暂无更新。')
      }
    },
    //确认下载
    updateYes() {
      this.$toast('下载成功')
      this.showUpdate = false
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.Password {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .top {
    display: flex;
    justify-content: center;
    text-align: center;
    padding-top: 30px;
  }
  .update {
    p {
      color: #999;
      margin-bottom: 10px;
      margin-left: 16px;
    }
  }
}
</style>
