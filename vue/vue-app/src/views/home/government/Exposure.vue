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
      let resp = await this.$http.get('/carp/business/a/q/exposure/table/page', {
        params: this.searchData
      })
      if (resp.code == 0) {
        if (page) {
          this.list = []
        }
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.searchData.page = this.searchData.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        } else {
          this.finished = false
        }
      } else {
        this.$dialog.alert({
          message: '获取曝光台:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
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
