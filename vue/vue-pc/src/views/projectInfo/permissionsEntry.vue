<template>
  <el-card shadow="never" class="el-card">
    <div slot="header" class="header">
      <span>数据统计</span>
      <div class="item-wrap"></div>
    </div>
    <div class="content">
      <div v-for="(item, key) in data" :key="key" class="item">
        <el-button :type="item.type" v-text="item.label" @click="link(item.routeName)" class="button"></el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'permissionsEntry',
  data() {
    return {
      data: {
        todayCheck: {
          label: '今日巡检',
          routeName: 'todayCheck',
          type: 'primary'
        },
        commandCheck: {
          label: '指派点检',
          routeName: 'commandCheck',
          type: 'warning'
        },
        videoCheck: {
          label: '视频巡检',
          routeName: 'videoCheck',
          type: 'success'
        },
        emergency: {
          label: '应急预案',
          routeName: 'emergency',
          type: 'danger'
        }
      }
    }
  },
  props: {
    projectId: String
  },
  methods: {
    link(routeName) {
      this.$router.push({ name: routeName, query: { uid: encodeURIComponent(this.$aesEncrypt(this.projectId)) } })
      this.$store.commit('selectMenu', routeName)
    }
  }
}
</script>

<style lang="less" scoped>
@import './less/Index';
.content {
  margin: -20px;
  padding: 7px;
  display: flex;
  align-items: stretch;
  .item {
    padding: 7px;
    flex: auto;
    width: 0;
    .button {
      width: 100%;
      padding: 24px 20px;
      overflow: hidden;
    }
  }
}
</style>
