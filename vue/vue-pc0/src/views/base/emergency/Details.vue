<template>
  <div class="emergency-wrap">
    <!-- 附件列表 -->
    <div class="attachment-wrap">
      <a
        v-for="item in details.textEntityList"
        @click="download($store.state.config.convertFileUrl(item.textPath), item.textName)"
        :key="item.id"
        class="attachment"
      >
        <!-- 通过后缀名判断图标 -->
        <div class="icon">
          <svg class="iconfont-fullcolor" aria-hidden="true">
            <use
              :xlink:href="
                `#iconfont-${(() => {
                  let icon = {
                    xls: 'excel1',
                    xlsx: 'excel1',
                    doc: 'word',
                    docx: 'word',
                    pdf: 'pdf',
                    txt: 'txtwenjian'
                  }[item.textName.replace(/^.*\./, '')]
                  if (!icon) icon = 'File'
                  return icon
                })()}`
              "
            ></use>
          </svg>
        </div>
        <div class="filename" v-text="item.textName"></div>

        <div class="hover">
          <span class="el-icon-download"></span>
        </div>
      </a>
    </div>
    <!-- 文件下载 -->
    <div class="content-wrap">
      <div class="content" v-html="details.text"></div>
      <div class="bt-back">
        <el-button v-if="false" type="primary" @click="saveDetails">保存</el-button>
        <el-button @click="close">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'emergencyDetails',
  data() {
    return {
      details: {
        textEntityList: []
      }
    }
  },
  props: {
    emergency: Object,
    close: Function
  },
  methods: {
    // 文件下载
    download(url, fileName) {
      this.$http
        .get(url, {
          responseType: 'blob'
        })
        .then(res => {
          let base64Url = URL.createObjectURL(res)
          let link = document.createElement('a')
          link.href = base64Url
          link.download = fileName
          link.click()
          URL.revokeObjectURL(base64Url)
        })
    },

    // 保存详情内容为附加
    saveDetails() {
      let base64Url = URL.createObjectURL(new Blob([this.details.text]))
      let link = document.createElement('a')
      link.href = base64Url
      link.download = this.details.title + '.docx'
      link.click()
      URL.revokeObjectURL(base64Url)
    }
  },
  created() {
    // 获取应急预案详情
    this.$http
      .get(`/carp/business/a/q/emergency/plan/${this.emergency.id}`)
      .then(({ code, data }) => {
        if (code === 0) {
          this.details = data
        } else {
          this.$message.error('获取详情失败')
          close()
        }
      })
      .catch(err => {
        if (err) {
          this.$message.error('获取详情失败')
          close()
        }
      })
  }
}
</script>

<style lang="less" scoped>
.emergency-wrap {
  margin: -30px -20px;
  padding: 20px 40px;
  .attachment-wrap {
    display: inline-flex;
    flex-wrap: wrap;
    .attachment {
      position: relative;
      overflow: hidden;
      margin-left: 4px;
      padding: 4px;
      border-radius: 4px;
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      text-decoration: none;
      color: #222;
      cursor: pointer;
      .icon {
        padding: 6px 22px;
        font-size: 44px;
      }
      .filename {
        height: 18px;
        line-height: 18px;
      }

      .hover {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: none;
        justify-content: center;
        align-items: center;
        background-color: rgba(34, 34, 34, 0.84);
        font-size: 24px;
        color: #ffffff;
      }
      &:hover .hover {
        display: flex;
      }
    }
  }
  .content-wrap {
    .bt-back {
      text-align: center;
    }
  }
}
</style>
