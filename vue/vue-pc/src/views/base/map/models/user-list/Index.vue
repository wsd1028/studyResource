<template>
  <el-dialog :visible="true" :fullscreen="true" @close="close" style="padding:6% 31.6vh" class="dialog" custom-class="base-map-user-list-el-dialog-body">
    <!-- 用户列表 -->
    <div class="user-list-container" v-loading="loading">
      <div class="header">
        <div class="label-wrap">
          <span class="title">人员详情</span>
          <span class="online">在线</span>
          <span class="offline">离线</span>
        </div>
        <div v-if="!this.workStationInfo" class="filters-wrap">
          <el-cascader
            :options="
              (() => {
                let areaTree = []
                $getAreaTree(user.accountTypeDto.code, tree => (areaTree = [tree]))
                return areaTree
              })()
            "
            :props="{ checkStrictly: true, emitPath: false, value: 'code', label: 'name', children: 'nodes' }"
            v-model="areaCode"
            @change="getList(1)"
            placeholder="选择区域"
            size="mini"
            class="el-cascader"
          ></el-cascader>
          <el-input size="mini" placeholder="请输入用户名称" class="el-input" v-model="keyword" @keyup.enter.native="getList()"></el-input>
          <el-button size="mini" type="primary" @click="getList()">搜索</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="userList">
          <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
          <el-table-column prop="areaName" label="地区" width="180"> </el-table-column>
          <el-table-column prop="username" label="账号" width="180"> </el-table-column>
          <el-table-column prop="phone" label="手机号" width="180"> </el-table-column>
          <el-table-column prop="online" label="在线状态" :width="80">
            <template slot-scope="scope">
              <div
                :style="{
                  width: '0.12rem',
                  height: '0.12rem',
                  margin: 'auto',
                  borderRadius: '50%',
                  backgroundColor: scope.row.online ? '#20CE6E' : '#F44343'
                }"
              ></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200" align="right">
            <template slot-scope="scope">
              <!-- <el-button v-if="scope.row.online" size="mini" type="success" v-text="'呼叫'" @click="handleCall(scope.row.username)"></el-button> -->
              <el-button size="mini" type="success" v-text="'呼叫'" @click="handleCall(scope.row.username)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="footer">
        <el-pagination
          @size-change="getList()"
          @current-change="getList"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'userList',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 当前登录用户
      user,

      // 进度条
      loading: false,

      // 用户列表
      userList: [],

      // 关键字
      keyword: '',
      // 地区码
      areaCode: 5115,
      // 当前页
      currentPage: 1,
      // 页长度
      limit: 10,
      // 总长度
      total: 0
    }
  },
  props: {
    // 工作站信息,若为null则获取所有人员
    workStationInfo: Object,
    close: Function
  },
  computed: {
    ...mapState({
      RTM: state => state.agora.rtmClient
    })
  },
  methods: {
    // 获取列表
    getList(page = this.currentPage) {
      // 请求地址
      let url = null
      // 如果工作站信息为空,请求地址为所有用户
      if (this.workStationInfo == null) {
        url = '/carp/auth/a/q/account'
      }
      // 如果工作站类型为项目,请求地址为当前项目下所有用户
      else if (this.workStationInfo.renderType == 'project') {
        url = `/carp/auth/a/q/account/project/${this.workStationInfo.id}`
      }
      // 如果工作站类型为消纳站,请求地址为当前消纳站下所有用户
      else if (this.workStationInfo.renderType == 'garbageStation') {
        url = `/carp/auth/a/q/account/garbage/${this.workStationInfo.id}`
      }
      // 打开进度条
      this.loading = true
      this.$http
        .get(url, {
          params: {
            username: this.keyword,
            limit: this.limit,
            page,
            areaCode: this.areaCode
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            // 获取分页信息
            this.currentPage = parseInt(this.current) || 1
            this.limit = parseInt(data.size) || data.length || 0
            this.total = parseInt(data.total) || data.length || 0
            // 获取用户列表
            let userList = (data.records || data).map(user => ({
              name: user.accountBaseDto.name,
              username: user.username,
              phone: user.accountBaseDto.phone,
              areaName: (() => {
                let areaName = null
                this.$getAreaTree(user.accountTypeDto.code, tree => (areaName = tree.name))
                return areaName
              })()
            }))
            // 获取用户在线状态
            let uidList = userList.map(user => user.username)
            if (uidList.length) {
              this.RTM.inquire(uidList)
                .then(res => {
                  userList.forEach(user => (user.online = res[user.username]))
                  this.userList = userList
                  // 关闭进度条
                  this.loading = false
                })
                .catch(err => {
                  if (err) {
                    console.log('获取用户在线状态失败', err)
                    userList.forEach(user => (user.online = false))
                    this.userList = userList
                    // 关闭进度条
                    this.loading = false
                  }
                })
            } else {
              // 关闭进度条
              this.loading = false
            }
          } else {
            this.$message.error('用户列表请求失败')
            // 关闭进度条
            this.loading = false
          }
        })
    },

    // 呼叫
    handleCall(uid) {
      if (uid == this.user.username) {
        this.$message.error('呼叫用户为当前登录用户,已被中断')
        return
      }
      this.RTM.inquire([uid]).then(res => {
        // 如果对方在线则发送呼叫信令
        if (res[uid]) {
          this.$store.commit('makeCall', uid)
        } else {
          this.$message.error('呼叫方已离线,请等待对方上线')
        }
      })
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.user-list-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  @flex-column();
  .header {
    padding: 0.19rem;
    display: flex;
    justify-content: space-between;
    background-color: rgba(250, 250, 250, 1);
    border-bottom: rgba(241, 241, 241, 1) solid 1px;
    .label-wrap {
      & > * {
        margin-right: 0.16rem;
      }
      .title {
        font-size: 0.14rem;
        font-weight: bold;
        color: rgba(52, 52, 52, 1);
      }
      .online,
      .offline {
        &::before {
          content: '';
          display: inline-block;
          height: 0.08rem;
          width: 0.08rem;
          border-radius: 50%;
          margin-right: 7px;
        }
      }
      .online {
        &::before {
          background-color: #21cd6e;
        }
      }
      .offline {
        &::before {
          background-color: #f44343;
        }
      }
    }
    .filters-wrap {
      & > * {
        margin-left: 0.12rem;
      }
      .el-cascader {
        width: 1.6rem;
      }
      .el-input {
        width: 2rem;
      }
    }
  }
  .table {
    flex: auto;
    height: 0;
    padding: 0 0.19rem;
  }
  .footer {
    padding: 0.1rem 0;
    text-align: center;
  }
}
</style>

<style lang="less">
.base-map-user-list-el-dialog-body {
  position: relative;
}
</style>
