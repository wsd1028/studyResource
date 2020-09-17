<template>
  <div class="caller-info-wrap">
    <div class="avatar-wrap">
      <!-- 缩放圆 -->
      <div class="circle-wrap">
        <div v-for="key in 3" :key="key"></div>
      </div>
      <!-- 头像 -->
      <el-image :src="$store.state.config.convertImgUrl(caller.accountBaseDto.photo)" class="avatar">
        <div slot="error" class="image-slot">
          <i class="el-icon-user-solid"></i>
        </div>
      </el-image>
    </div>
    <!-- 姓名 -->
    <div class="name">
      <span v-text="caller.accountBaseDto.name"></span>
    </div>
    <!-- 附属信息 -->
    <div class="ancillary">
      <span v-text="ancillary"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'callerInfo',
  data() {
    return {
      // 用户所属组织机构/项目/消纳站
      ancillary: ' '
    }
  },
  props: {
    caller: Object
  },
  watch: {
    caller(caller) {
      // 组织机构
      if (caller.organizationDto) {
        this.ancillary = caller.organizationDto.name
      }
      // 项目或消纳站
      else {
        // 附属id
        let ancillaryId = caller.accountTypeDto.ancillaryId
        // 请求地址
        let url = null
        switch (caller.accountTypeDto.type) {
          // 项目
          case 30:
            url = '/carp/business/a/q/project'
            break
          // 消纳站
          case 60:
            url = '/carp/business/a/q/garbage/station'
            break
        }
        // 获取详情
        this.$http.get(`${url}/${ancillaryId}`).then(({ code, data }) => {
          if (code === 0) {
            this.ancillary = data.name
          } else {
            this.ancillary = ' '
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-wrap {
  position: relative;
  .avatar {
    overflow: hidden;
    display: block;
    margin: auto;
    height: 0.86rem;
    width: 0.86rem;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    line-height: 0.86rem;
    font-size: 0.34rem;
  }

  .circle-wrap {
    position: absolute;
    height: 1.1rem;
    width: 1.1rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    @keyframes scale {
      from {
        transform: scale(1);
        opacity: 1;
      }
      to {
        transform: scale(1.6);
        opacity: 0;
      }
    }
    & > div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid #aaa;
      opacity: 0;
      border-radius: 50%;
      animation: scale 3s infinite;
      &:nth-of-type(2) {
        animation-delay: 1s;
      }
      &:nth-of-type(3) {
        animation-delay: 2s;
      }
    }
  }
}

.name,
.ancillary {
  text-align: center;
}

.name {
  color: #fff;
  margin-top: 0.46rem;
  font-size: 0.2rem;
}
.ancillary {
  color: #bbb;
  margin-top: 0.02rem;
  font-size: 0.16rem;
}
</style>
