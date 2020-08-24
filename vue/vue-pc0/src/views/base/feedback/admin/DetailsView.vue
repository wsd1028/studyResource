<template>
  <el-row :gutter="10" class="details-container" align="stretch">
    <el-col :md="24" :lg="24">
      <!-- 用户信息 -->
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">用户信息</span>
        </div>
        <div class="content" style="font-size: 16px;line-height: 20px">
          <div class="content-item" style="margin-bottom: 0">
            <i class="icon iconfont iconfont-form-id" style="font-size: 16px"></i>
            <span class="value" v-text="info.userId"></span>
          </div>
          <div class="content-item" style="margin-bottom: 0">
            <i class="icon iconfont iconfont-form-user" style="font-size: 16px"></i>
            <span class="value" v-text="info.userName"></span>
          </div>
        </div>
      </el-card>
      <!-- 联系方式 -->
      <el-card class="box-card" shadow="never" style="overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">联系方式</span>
        </div>
        <div class="content" style="font-size: 16px;line-height: 20px">
          <div class="content-item" style="margin-bottom: 0">
            <i class="icon el-icon-mobile-phone" style="font-size: 16px"></i>
            <span class="value" v-text="info.phone"></span>
          </div>
          <div class="content-item" style="margin-bottom: 0">
            <i class="icon iconfont iconfont-form-emai-copy" style="font-size: 16px"></i>
            <span class="value" v-text="info.mailbox"></span>
          </div>
        </div>
      </el-card>
      <!-- 进度 -->
      <el-card class="box-card" shadow="never" style="margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">解决进度</span>
        </div>
        <div class="content">
          <el-steps :active="info.useState ? 3 : 2" style="flex:1">
            <el-step title="已接收" icon="iconfont iconfont-form-receive"></el-step>
            <el-step title="审核中" icon="iconfont iconfont-form-review"></el-step>
            <el-step title="已解决" icon="iconfont iconfont-form-success"></el-step>
          </el-steps>
        </div>
      </el-card>
    </el-col>
    <el-col :md="24" :lg="24">
      <!-- 反馈内容 -->
      <el-card class="box-card" shadow="never" style="height:100%;margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">反馈图片</span>
        </div>
        <div class="content">
          <el-image
            v-for="(item, key) in info.photoList"
            :key="key"
            :src="$store.state.config.convertImgUrl(item)"
            :preview-src-list="info.photoList.map(item => $store.state.config.convertImgUrl(item))"
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
      <!-- 反馈内容 -->
      <el-card class="box-card" shadow="never" style="height:100%;margin-bottom:0;overflow:visible">
        <div slot="header" class="clearfix title">
          <span style="font-weight: bold;line-height: 18px">反馈内容</span>
        </div>
        <div class="content">
          <span v-text="info.info"></span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    info: Object
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
</style>
