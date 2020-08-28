<template>
  <!-- 详情窗口 -->
  <div class="details-window-container">
    <div v-show="info.id" class="detials-window" v-loading="loading">
      <!-- 标题 -->
      <h3>{{ info.name }}</h3>

      <!-- 基本信息表格 -->
      <table border="1px" cellspacing="0" bordercolor="#ededed">
        <tr v-if="info.areaName">
          <td class="title">行政区域</td>
          <td v-text="info.areaName"></td>
        </tr>
        <tr v-if="info.address">
          <td class="title">地址</td>
          <td v-text="info.address"></td>
        </tr>
        <tr v-if="info.dictName">
          <td class="title">项目类型</td>
          <td v-text="info.dictName"></td>
        </tr>
        <tr v-if="info.architecturalNatureName || info.stateName">
          <td class="title">相关信息</td>
          <td>
            <el-tag size="mini" type="primary" v-text="info.architecturalNatureName"></el-tag>
            <el-tag size="mini" type="success" v-text="info.stateName" class="offset"></el-tag>
          </td>
        </tr>
        <tr v-if="info.manager || info.managerPhone">
          <td class="title">联系人</td>
          <td>
            <span v-text="info.managerPhone"></span>
            <el-tag size="mini" type="primary" v-text="info.manager" class="offset"></el-tag>
          </td>
        </tr>
        <tr v-for="item in companys || []" :key="item.id">
          <td class="title" v-text="item.typeName"></td>
          <td v-text="item.companyName"></td>
        </tr>
      </table>

      <!-- 图片 -->
      <div class="img-wrap" v-if="info.image || info.backgroundPhoto">
        <el-image
          :src="$store.state.config.convertImgUrl(info.backgroundPhoto || info.image)"
          fit="contain"
          @error="info.image = info.backgroundPhoto = null"
        ></el-image>
      </div>

      <!-- 查看详情按钮 -->
      <el-button v-if="info.hasOwnProperty('architecturalNature')" type="primary" size="mini" @click="dialogShow = true" style="margin-top:8px;width:100%"
        >查看更多</el-button
      >
    </div>

    <!-- 详细信息弹窗 -->
    <el-dialog v-if="dialogShow" width="90%" :visible="true" @close="dialogShow = false">
      <project-details :project-id="info.id"></project-details>
    </el-dialog>
  </div>
</template>

<script>
import projectDetails from './ProjectDetails'
export default {
  name: 'detailsWindow',
  data: function() {
    return {
      // 加载动画开关
      loading: false,
      // 弹窗内容详情对象
      info: {},
      // 项目参建单位
      companys: [],
      // 请求拦截器
      requestTackled: false,

      // 项目详情弹窗显示控制器
      dialogShow: false,

      // 初始化方法(防抖)
      init: this.$debounceBefore(info => {
        // 请求拦截,如果上一个请求未结束则该条请求无效
        if (this.requestTackled) return
        this.requestTackled = true
        // 清除参建单位
        this.companys = []
        // 获取弹窗内容信息
        this.info = info || {}
        // 判断弹窗信息是否获取成功,不成功则不再继续执行当前方法并关闭拦截器
        if (!this.info.id) {
          this.requestTackled = false
          return
        }
        // 关闭今日宜宾窗口
        this.$emit('colseStatisticsWindow')
        // 开启加载动画
        this.loading = true
        // 判断当前信息是项目还是消纳站,并给予不同的详情请求链接
        let isProject = this.info.hasOwnProperty('architecturalNature')
        let url = isProject ? '/carp/business/a/q/project' : '/carp/business/a/q/garbage/station'
        // 任务列表
        let missions = [
          // 请求项目/消纳站详情
          new Promise(resolve => {
            this.$http
              .get(`${url}/${info.id}`)
              .then(({ code, data }) => {
                if (code === 0) {
                  this.info = data
                  resolve(data)
                } else {
                  resolve(false)
                }
              })
              .catch(err => {
                if (err) {
                  resolve(false)
                }
              })
          })
        ]
        // 如果为项目类型则再额外请求参建单位
        missions.push(
          new Promise(resolve => {
            this.$http
              .get('/carp/business/a/q/project/corp/project', {
                params: {
                  projectId: this.info.id,
                  page: 1,
                  limit: 20
                }
              })
              .then(({ code, data }) => {
                if (code === 0) {
                  this.companys = data.records
                  resolve()
                } else {
                  resolve(false)
                }
              })
              .catch(err => {
                if (err) resolve(false)
              })
          })
        )
        Promise.all(missions).then(() => {
          // 关闭加载动画
          this.loading = false
          // 关闭请求拦截
          this.requestTackled = false
        })
      }, 600)
    }
  },
  components: {
    projectDetails
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color';
@import '../../style/size';
.detials-window {
  position: absolute;
  top: 50%;
  right: 0.46rem;
  padding: 0.14rem 0.18rem;
  transform: translateY(-50%);
  width: 2.8rem;
  background-color: @white;
  box-shadow: rgba(48, 49, 51, 0.2) 0 0 0.04rem;
  border-radius: @radius-size;
  font-size: 0.14rem;

  table {
    width: 100%;
    td {
      padding: 0.04rem 0.06rem;
    }
    td.title {
      width: 0.7rem;
      color: #707070;
      background-color: #f8f8f8;
    }
  }

  .offset {
    margin-left: 0.04rem;
  }
}
</style>
