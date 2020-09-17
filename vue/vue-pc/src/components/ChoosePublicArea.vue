<template>
  <div class="container">
    <el-dialog :visible.sync="visible" :modal="false" :show-close="false" class="dialog" width="926px">
      <div slot="title" style="display:flex;justify-content:space-between">
        <el-cascader
          :options="areaTree"
          :props="{ label: 'name', children: 'nodes', value: 'code', emitPath: false, checkStrictly: true }"
          placeholder="地区选择"
          v-model="areaCode"
          @change="
            currentPage = 1
            getList()
          "
        />
        <el-input v-model="keyword" placeholder="搜索公共区域" style="margin-left:10px" @input="getList"></el-input>
      </div>
      <div class="dialog-body">
        <!-- 公共区域列表 -->
        <div class="list-wrap" v-loading="loading">
          <el-scrollbar class="custom-scrollbar">
            <div v-for="item in list" :key="item.id" class="list-item" @click="getItem(item)">
              <div class="img-wrap">
                <el-image class="img" :src="$store.state.config.convertImgUrl(item.backgroundPhoto)" fit="contain" />
              </div>
              <div class="content">
                <div class="title" v-text="item.name"></div>
                <div class="area">
                  <span>地址:</span>
                  <el-tag type="success" size="mini" v-text="item.address" style="margin-left:4px"></el-tag>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <!-- 分页器 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :current-page.sync="currentPage"
          :page-size.sync="limit"
          @size-change="getList"
          @current-change="getList"
          style="text-align:center;padding-top:30px"
        >
        </el-pagination>
      </div>
    </el-dialog>
    <el-link v-text="name" type="primary" style="margin-right:4px" @click="handleShow"></el-link>
    <el-button v-show="!name.length" type="primary" @click="handleShow">选择公共区域</el-button>
  </div>
</template>

<script>
export default {
  name: 'ChoosePublicArea',
  data() {
    // 登录用户信息
    const user = this.$store.state.user.userInfo
    // 地区树
    let areaTree = []
    let areaCode = this.area || '5115'
    this.$getAreaTree(areaCode, tree => {
      areaTree = [tree]
    })
    return {
      user,

      // 加载
      loading: false,
      // 是否显示弹窗
      visible: false,
      // 公共区域名称
      name: '',
      // 公共区域列表
      list: '',

      // 地区树
      areaTree,
      // 搜索关键字
      keyword: '',
      // 选择地区码
      areaCode,
      // 总条目
      total: 0,
      // 每页条目
      limit: 20,
      // 当前页
      currentPage: 1,
      // 搜索公共区域方法(防抖)
      getList: this.$debounce(() => {
        this.loading = true
        this.$http
          .get('/carp/business/a/q/public/area/page', {
            params: {
              name: this.keyword,
              areaCode: this.areaCode,
              limit: this.limit,
              page: this.currentPage
            }
          })
          .then(({ code, data, message }) => {
            if (code === 0) {
              this.list = data.records
              this.total = parseInt(data.total)
            } else {
              this.$message.error('请求失败: ' + message)
            }
            this.loading = false
          })
      }, 600)
    }
  },
  model: {
    prop: 'id',
    event: 'sendId'
  },
  props: {
    // 公共区域id
    id: {
      type: (() => String | Number)()
    },
    // 字段配置
    props: Object,
    // 当前权限地区码或地区id
    area: {
      type: (() => String | Number)()
    },
    // 当前组件是否可操作
    disabled: {
      type: Boolean,
      default: false
    },
    clearValidate: Function
  },
  watch: {
    // 监听当前选择的公共区域id,如果有效则获取该公共区域的相关信息
    id(id) {
      this.getDetails(id)
    }
  },
  methods: {
    // 显示弹窗
    handleShow() {
      if (!this.disabled) {
        this.visible = true
      }
    },
    // 获取信息项
    getItem(info) {
      this.$emit('sendId', info.id)
      this.name = info.name
      this.visible = false
      this.clearValidate()
      this.$emit('change', {
        id: info.id,
        node: info
      })
    },
    // 根据id获取详情
    getDetails(id) {
      if (!id || this.name.length) return
      this.clearValidate()
      this.$http.get(`/carp/business/a/q/public/area/${id}`).then(({ code, data, message }) => {
        if (code === 0) {
          this.name = data.name
          this.$emit('change', {
            id,
            node: data
          })
        } else {
          this.$message.error('获取公共区域信息失败: ' + message)
        }
      })
    },
    // 清除当前组件
    clear(id) {
      this.name = ''
      this.$emit('sendId', id)
      this.getDetails(id)
    }
  },
  mounted() {
    this.getDetails(this.id)
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.dialog {
  height: 100%;
  background-color: rgba(34, 34, 34, 0.8);
  .dialog-body {
    height: 600px;
    display: flex;
    @flex-column();
    .list-wrap {
      flex: 1;
      height: 0;
      .list-item {
        padding: 10px 0;
        display: flex;
        border-bottom: #e9e9e9 solid 1px;
        align-items: stretch;
        cursor: pointer;
        &:hover {
          background-color: #e9e9e9;
        }
        .img-wrap {
          width: 120px;
          height: 80px;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .content {
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
