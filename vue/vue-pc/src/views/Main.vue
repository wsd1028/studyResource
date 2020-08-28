<template>
  <el-container class="root-container">
    <el-header class="el-header">
      <common-header></common-header>
    </el-header>
    <el-container class="el-container">
      <el-aside width="auto" class="aside">
        <el-scrollbar class="custom-scrollbar">
          <common-aside></common-aside>
        </el-scrollbar>
      </el-aside>
      <el-main class="page-router">
        <common-tab class="tab"></common-tab>
        <router-view class="page-container" :key="$route.query.key" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import CommonHeader from '@/components/CommonHeader.vue'
import CommonAside from '@/components/CommonAside'
import CommonTab from '@/components/CommonTab'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      user: state => state.user.userInfo
    })
  },
  created() {
    // 创建消息监听器
    this.createMessageListener()
  },
  methods: {
    /* *
     * 创建消息监听器
     * * */
    createMessageListener() {
      // 创建接收消息监听事件
      this.$store.state.agora.rtmClient.on('MessageFromPeer', (content, userId) => {
        // 是否是有效内容
        if (content.text && content.text.length) {
          // 保存消息到本地
          this.$store.commit('saveMessage', {
            content,
            sendId: userId,
            receiveId: this.user.username,
            callback: () => {
              // 如果不在聊天页面路由下,则弹出提示消息
              console.log(this.$route.name)

              if (this.$route.name == 'agora') {
                return
              }

              this.$http
                .get(`/carp/auth/a/q/account`, {
                  params: {
                    username: userId,
                    page: 1,
                    limit: 1
                  }
                })
                .then(({ code, data }) => {
                  let name = ''
                  if (code === 0) {
                    name = data.records[0].accountBaseDto.name
                  } else {
                    name = userId
                  }
                  this.$notify({
                    message: `<h3 style="margin:0">${name}</h3><p style="margin:10px 0 0 0">${content.text}</p>`,
                    dangerouslyUseHTMLString: true,
                    duration: 2000
                  })
                })
            }
          })
        }
      })
    }
  },
  components: {
    CommonHeader,
    CommonAside,
    CommonTab
  }
}
</script>

<style lang="less" scoped>
.root-container,
.main {
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  .el-header {
    flex: none;
    height: auto !important;
    background-color: #4285f4;
  }
  .el-container {
    flex: auto;
    height: 0;
    .aside {
      background-color: #001529;
    }
    .page-router {
      display: flex;
      flex-flow: column nowrap;
      padding: 0;
      .tab {
        flex: none;
      }
      .page-container {
        flex: auto;
        height: 0;
      }
    }
  }
}
</style>
