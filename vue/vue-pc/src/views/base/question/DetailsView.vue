<template>
  <el-row :gutter="10" class="details-container" align="stretch">
    <el-col :md="24" :lg="24">
      <!-- 上报标题 -->
      <el-card class="box-card" shadow="hover" style="overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">基本信息</span>
        </div>
        <div class="content" style="font-size: 14px">
          <div class="content-item">
            <span>上报标题：&nbsp;</span>
            <span class="value" v-text="info.reportTitle"></span>
          </div>
          <div class="content-item">
            <span>上报类型：&nbsp;</span>
            <span class="value" v-text="info.reportTypeName"></span>
          </div>
        </div>
      </el-card>
      <!-- 用户信息 -->
      <el-card class="box-card" shadow="hover" style="overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">用户信息</span>
        </div>
        <div class="content" style="font-size: 14px">
          <div class="content-item">
            <i class="icon iconfont iconfont-form-id" style="font-size: 14px"></i>
            <span class="value" v-text="info.peopleId"></span>
          </div>
          <div class="content-item">
            <i class="icon iconfont iconfont-form-user" style="font-size: 14px"></i>
            <span class="value" v-text="info.peopleName"></span>
          </div>
        </div>
      </el-card>
      <!-- 联系方式 -->
      <el-card class="box-card" shadow="hover" style="overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">联系方式</span>
        </div>
        <div class="content">
          <div class="content-item">
            <i class="icon el-icon-mobile-phone" style="font-size: 14px"></i>
            <span class="value" v-text="info.phone || '未填写联系方式'" style="font-size: 14px"></span>
          </div>
          <div class="content-item">
            <i class="icon el-icon-location-outline" style="font-size: 14px"></i>
            <span class="value" v-text="info.reportAddress || '未填写联系地址'" style="font-size: 14px"></span>
          </div>
        </div>
      </el-card>
      <!-- 进度 -->
      <el-card class="box-card" shadow="hover" style="margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">上报进度</span>
        </div>
        <div class="content" style="font-size: 14px">
          <el-steps :active="[3, 3, 1, 2][active]" style="flex:1;">
            <el-step title="已上报" icon="iconfont iconfont-form-receive"></el-step>
            <el-step title="处理中" icon="iconfont iconfont-form-review"></el-step>
            <el-step :title="active == 1 ? '已作废' : '已结案'" :icon="active == 1 ? 'el-icon-close' : 'el-icon-check'"></el-step>
          </el-steps>
        </div>
      </el-card>
    </el-col>
    <el-col :md="24" :lg="24">
      <!-- 上报内容 -->
      <el-card class="box-card" shadow="hover" style="height:100%;margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">上报图片</span>
        </div>
        <div class="content" style="font-size: 14px">
          <el-image
            v-for="(item, key) in info.photo"
            :key="key"
            :src="$store.state.config.convertImgUrl(item)"
            :preview-src-list="info.photo.map(item => $store.state.config.convertImgUrl(item))"
            style="height:140px;width:140px;background-color:black;margin:2px"
            fit="contain"
          >
            <div slot="error" class="image-slot" style="height:140px;width:140px;text-align:center;line-height:140px">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </div>
      </el-card>
    </el-col>
    <el-col :md="24" :lg="24">
      <!-- 上报内容 -->
      <el-card class="box-card" shadow="hover" style="height:100%;margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">问题描述</span>
        </div>
        <div class="content" style="font-size: 14px">
          <span v-text="info.reportMessage"></span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    info: Object,
    reportState: Array
  },
  computed: {
    /* *
     * 获取为题上报进度索引号
     * 0:已结案 1:已作废 3:已上报 3:处理中
     * * */
    active() {
      let index = 3
      this.reportState.forEach((item, i) => {
        if (item.code == this.info.reportState) {
          index = i
        }
      })
      return index
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
</style>
