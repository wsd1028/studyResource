<template>
  <div>
    <van-nav-bar :title="titleName" @click-left="show = !show" class="title">
      <!-- <van-icon info="99+" name="chat" size="20px" slot="right" /> -->
      <van-icon name="search" size="20px" slot="left" v-if="$store.state.user.user.accountTypeDto.type != $dictionaries.userType.government" />
    </van-nav-bar>
    <van-popup class="pop" position="top" v-model="show">
      <van-search @cancel="show = !show" @search="search" class="searchBox" placeholder="请输入搜索关键词" show-action v-model="value"></van-search>
    </van-popup>
  </div>
</template>
<script>
import { Bus } from '../bus'
export default {
  name: 'homeTitle',
  data() {
    return {
      show: false,
      value: ''
    }
  },
  props: {
    titleName: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    search() {
      Bus.$emit('searchValue', this.value)
      this.show = !this.show
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background: #4285f4;
}
.van-nav-bar__title {
  color: #fff;
}
.van-nav-bar__text {
  color: #ffffff;
}

.van-nav-bar .van-icon {
  color: #ffffff;
}
.pop {
  height: 100%;
}
.searchBox {
  margin-top: 10px;
}
[class*='van-hairline']::after {
  border: none;
}
</style>
