<template>
  <div style="display:flex">
    <table-control
      ref="tableControl"
      :form-config="form"
      :search-url="searchUrl"
      :allow-add="false"
      :allow-del="false"
      :allow-edit="false"
      :show-control="false"
      :filters="filters"
    >
      <div v-if="[0, 50].includes($userType)" slot="control" style="display:inline-block;margin-left:10px">
        <el-button size="mini" type="warning" class="iconfont iconfont-excel" @click="importExcelShow = true">导入Excel</el-button>
      </div>
    </table-control>
    <!-- 导入excel弹窗 -->
    <el-dialog title="导入excel" v-if="importExcelShow" :visible="true" width="398px" @close="importExcelShow = false">
      <import-excel @closed="importExcelShow = false"></import-excel>
    </el-dialog>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import importExcel from './ImportExcel'
export default {
  name: 'airQualityHistory',
  data() {
    // 天数据表格配置
    let dayConfig = {
      dataLevel: { label: '质量等级' },

      createDate: { label: '日期', data: data => this.$moment(data).format('YYYY-MM-DD') },

      aqi: { label: 'AQI' },

      co: { label: 'CO' },

      no2: { label: 'NO2' },

      o38h: { label: 'O3_8h' },

      pm10: { label: 'pm10' },

      pm25: { label: 'pm2.5' },

      so2: { label: 'So2' }
    }

    // 月数据表格配置
    let monthConfig = {
      dataYear: {
        label: '日期',
        data: (data, row) => `${data}-${(row.dataMonth.length === 1 && 0 + '' + row.dataMonth) || row.dataMonth}`
      },

      dataLevel: {
        label: '质量等级'
      },

      dataRange: {
        label: '范围'
      },

      aqi: {
        label: 'AQI'
      },

      co: {
        label: 'CO'
      },

      no2: {
        label: 'NO2'
      },

      o3: {
        label: 'O3'
      },

      pm10: {
        label: 'pm10'
      },

      pm25: {
        label: 'pm2.5'
      },

      so2: { label: 'So2' }
    }

    return {
      // 导入excel弹窗
      importExcelShow: false,

      searchUrl: '/carp/device/a/q/air/quality/page/day',

      form: {
        label: dayConfig
      },

      filters: {
        searchUrl: {
          label: '类型',
          type: 'select',
          item: [
            { label: '天数据', code: 1 },
            { label: '月数据', code: 0 }
          ],
          real: false,
          change: url => {
            this.searchUrl = url ? '/carp/device/a/q/air/quality/page/day' : '/carp/device/a/q/air/quality/page/month'
            this.$set(this.form, 'label', url ? dayConfig : monthConfig)
            this.$refs.tableControl.tableInit()
          },
          value: 1
        },
        level: {
          label: '质量等级',
          type: 'select',
          item: [
            { label: '全部', code: null },
            { label: '优', code: '优' },
            { label: '良', code: '良' },
            { label: '轻度污染', code: '轻度污染' },
            { label: '中度污染', code: '中度污染' },
            { label: '重度污染', code: '重度污染' }
          ]
        },
        startTime: {
          label: '开始时间',
          type: 'date'
        },
        endTime: {
          label: '结束时间',
          name: '-',
          type: 'date',
          value: this.$moment(Date.now()).format('YYY-MM-DD HH:mm:ss')
        }
      }
    }
  },
  components: {
    tableControl,
    importExcel
  }
}
</script>

<style></style>
