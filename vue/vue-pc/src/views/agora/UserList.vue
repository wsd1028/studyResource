<template>
  <div class="users-wrap">
    <!-- 用户搜索框 -->
    <div class="search-wrap">
      <div class="search-input">
        <i class="el-icon-search"></i>
        <input type="text" placeholder="搜索用户" v-model="userSearch" @input="handleUserSearch" />
      </div>
      <!-- 添加联络人 -->
      <div class="bt-add">
        <i class="el-icon-plus"></i>
      </div>
    </div>

    <!-- 联络人列表 -->
    <div class="users-list-wrap">
      <el-scrollbar class="custom-scrollbar">
        <div v-for="item in userList" :key="item.id" class="user-item" @click="$emit('checked-user', item)">
          <!-- 头像 -->
          <div class="avatar">
            <el-avatar class="img" shape="circle" fit="cover" :src="$store.state.config.convertImgUrl(item.accountBaseDto.photo)">
              <i class="el-icon-user-solid"></i>
            </el-avatar>
          </div>
          <!-- 信息 -->
          <div class="info">
            <!-- 用户名 -->
            <div class="user-name">
              <span v-text="item.accountBaseDto.name"></span>
            </div>
            <div class="last-message">
              <span>{{ item.accountBaseDto.name }}和你成为好友了</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 联络人列表end -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户搜索值
      userSearch: '',
      // 用户列表
      userList: [],
      // 用户搜索防抖方法
      handleUserSearch: this.$debounce(() => {
        this.$http
          .get('/carp/auth/a/q/account', {
            params: {
              limit: 20,
              page: 1,
              username: this.userSearch
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.userList = data.records || data
            } else {
              this.$message.error('网络错误')
            }
          })
      }, 600)
    }
  },
  created() {
    // 初始化用户列表
    this.handleUserSearch()
  },
  computed: {}
}
</script>

<style lang="less" scoped>
@import './style/userList';
</style>
