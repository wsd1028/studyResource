<template>
  <div class="licensePlate mainBox">
    <div class="mainTop">
      <div class="head">
        <Title titleName="车牌识别"></Title>
        <van-icon @click="goCreatForm" class="plusIcon" name="plus" v-if="!isGarbage" />
      </div>
      <van-search @search="select(1)" input-align="center" placeholder="请输入搜索关键词" show-action v-model="searchData.license">
        <template #action>
          <div @click="select(1)">搜索</div>
        </template>
      </van-search>
    </div>
    <section class="mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-cell-group :key="index" v-for="(item, index) in list">
            <van-row class="lincense-box">
              <van-col span="17">
                <van-row>
                  <van-col class="l1" span="24">
                    <span class="plateNumber" v-text="item.license"></span>
                    <span class="carTag0" v-if="item.carState">名录车</span>
                    <span class="carTag1" v-if="!item.carState">非名录车</span>
                  </van-col>
                </van-row>
                <van-row>
                  <van-col class="l3" span="21" v-text="item.createDate"></van-col>
                </van-row>
                <van-row v-if="item.direction == $dictionaries.direction.chu">
                  <van-col class="l4" offset="2" span="18" v-if="!isGarbage">
                    <van-button @click="create(item)" block round size="mini" type="info" v-if="!item.occupancy">
                      <!-- 解决eslint -->
                      新建联单
                    </van-button>
                    <van-button @click="create(item)" block disabled round size="mini" type="info" v-if="item.occupancy">
                      <!-- 解决eslint -->
                      新建联单
                    </van-button>
                  </van-col>
                </van-row>
              </van-col>
              <van-col span="6" style="height:85px;position:relative">
                <div class="jin" v-if="item.direction == $dictionaries.direction.jin">进</div>
                <div class="chu" v-if="item.direction == $dictionaries.direction.chu">出</div>
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.carPhoto" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
            </van-row>
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </section>
  </div>
</template>

<script>
import Title from '@/components/Title'
import { Dialog } from 'vant'
export default {
  components: {
    Title
  },
  data() {
    return {
      isGarbage: false, //是否为消纳员
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        license: '',
        limit: 10,
        page: 1,
        workplaceId: '',
        workplaceType: this.$dictionaries.machineType.company
      }
    }
  },
  mounted() {
    this.searchData.workplaceId = this.$store.state.user.user.accountTypeDto.ancillaryId
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.searchData.type = this.$dictionaries.machineType.garbage
      this.isGarbage = true
    } else {
      this.isGarbage = fasle
    }
  },
  methods: {
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
        this.list = []
      }
      let resp = await this.$http.get('/carp/business/a/q/license/record/current/page', {
        params: this.searchData
      })
      if (resp.code == 0) {
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
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //跳转联单点检界面
    create(item) {
      this.$router.push({
        name: 'formDetail',
        params: {
          createDate: item.createDate,
          id: item.id,
          projectId: this.searchData.workplaceId
        }
      })
    },
    //跳转创建联单界面
    goCreatForm() {
      this.$router.push({
        name: 'createForm',
        params: {
          license: ''
        }
      })
    }
  },
  filters: {
    // 是否可用
    tagFilter(flag) {
      if (flag) {
        return '不可用'
      } else {
        return '可用'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.licensePlate {
  background-color: #f9f9f9;
  min-height: 100%;
  .carTag0 {
    border-radius: 4px;
    line-height: 24px;
    padding: 0 4px;
    border: 1px solid #00ce5e;
    color: #00ce5e;
    margin-left: 5px;
  }
  .carTag1 {
    border-radius: 4px;
    line-height: 24px;
    padding: 0 4px;
    margin-left: 5px;
    border: 1px solid #ff2c37;
    color: #ff2c37;
  }
  .head {
    position: relative;
    .plusIcon {
      position: absolute;
      right: 20px;
      z-index: 999;
      top: 6px;
      font-size: 29px;
      color: #fff;
    }
  }
  .van-row {
    margin-top: 10px;
  }
  .lincense-box {
    background-color: #fff;
    padding: 10px 0;
    .van-col {
      height: 100%;
      padding-left: 5px;
    }
    text-align: left;
    .van-tag {
      text-align: center;
      text-indent: 0px;
    }
    .l1 {
      font-weight: 800;
    }
    .l3 {
      color: #9a9898;
    }
  }
}
</style>
