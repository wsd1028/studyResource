<template>
  <el-card shadow="never" v-loading="loading" class="el-card">
    <div slot="header" class="header">
      <span>数据统计</span>
      <div class="item-wrap"></div>
    </div>
    <div class="content">
      <div v-for="(item, key) in data" :key="key" class="item">
        <div>
          <div class="label">
            <span v-text="item.label"></span>
          </div>
          <div class="value-wrap">
            <span v-text="item.value" class="value" :style="{ color: item.color }"></span>
            <span v-text="item.unit" class="unit"></span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'statistics',
  data() {
    return {
      loading: true,
      data: {
        garbageStationNum: {
          label: '消纳场',
          url: '',
          value: 0,
          color: '#4285F4',
          unit: '个'
        },
        carNum: {
          label: '名录车',
          url: '',
          value: 0,
          color: '#A96CE1',
          unit: '辆'
        },
        noCarNum: {
          label: '非名录车',
          url: '',
          value: 0,
          color: '#F66F4A',
          unit: '辆'
        },
        electronicFormNum: {
          label: '电子联单',
          url: '',
          value: 0,
          color: '#08C2AA',
          unit: '单'
        }
      }
    }
  },
  props: {
    projectId: String
  },
  created() {
    this.loading = false
    // 获取数据
    this.$http
      .get('/carp/business/a/q/statistics/show/statistics/projectId', {
        params: {
          projectId: this.projectId,
          year: new Date().getFullYear()
        }
      })
      .then(({ code, data }) => {
        if (code === 0) {
          Object.keys(data).forEach(key => {
            this.data[key].value = data[key]
          })
        }
      })
  }
}
</script>

<style lang="less" scoped>
@import './less/Index';
.el-card {
  min-height: 144px;
}
.content {
  margin: -20px;
  padding: 7px;
  display: flex;
  align-items: stretch;
  .item {
    padding: 7px;
    flex: auto;
    width: 0;
    & > div {
      padding: 0 20px;
      overflow: hidden;
      background-color: #f5f6fb;
      .label,
      .value-wrap {
        margin: 6px 0;
      }
      .value-wrap {
        .value {
          font-size: 26px;
          font-weight: bolder;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
