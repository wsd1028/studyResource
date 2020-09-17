<template>
  <div class="government-exposure mainBox">
    <myTitle titleName="曝光台" class="mainTop"></myTitle>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-row :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
            <van-col span="6" style="height:85px">
              <MyImage :imgUrl="$dictionaries.imgBaseUrl + item.photo" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
            </van-col>
            <van-col span="1"></van-col>
            <van-col class="itemRight" span="17">
              <p class="name" v-text="item.title"></p>
              <div class="date">
                <p v-text="item.createDate"></p>
              </div>
            </van-col>
          </van-row>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      mainData: {},
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        showType: '1' //1展示的0不展示的
      }
    }
  },
  mounted() {},
  components: {},
  methods: {
    //跳转到曝光台详情
    handelItem(item) {
      this.$router.push({
        name: 'government-exposureDetail',
        params: item
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/exposure/table/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '曝光台', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
    }
  }
}
</script>

<style lang="less" scoped>
.government-exposure {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  section {
    .item {
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      .itemRight {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 85px;
        .name {
          font-weight: 800;
          color: #333;
          font-size: 18px;
        }
        .date {
          justify-content: space-between;
          display: flex;
          color: #989898;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
