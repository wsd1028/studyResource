<!--导入excel表组件-->
<template>
  <div>
    <el-select v-model="type" size="mini" placeholder="请选择" @change="change" style="width:100%;margin-bottom:10px">
      <el-option label="天数据" :value="1"> </el-option>
      <el-option label="月数据" :value="0"> </el-option>
    </el-select>
    <el-upload
      ref="uploadFile"
      drag
      :action="upload"
      :before-upload="beforeUpload"
      name="files"
      multiple
      :headers="{ token: $store.state.user.token }"
      :http-request="uploadFiles"
    >
      <i class="el-icon-upload"></i>
      <div>将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" style="text-align:center">
        <span>点击<a :href="download">此处</a>下载模板</span>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'importExcel',
  data: function() {
    return {
      // 模板类型 1:天模板 0:月模板
      type: 1,

      download: '/carp/device/a/q/air/quality/download/day',
      upload: '/carp/device/a/q/air/quality/import/day'
    }
  },
  methods: {
    beforeUpload(file) {
      const isExcel = /xlsx|xls/i.test(file.name.replace(/^.*\./, ''))
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcel) {
        this.$message.error('上传文件只能是 excel 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isExcel && isLt2M
    },
    uploadFiles(e) {
      const formData = new FormData()
      formData.append('file', e.file)
      this.$http
        .post(e.action, formData, {
          headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' }
        })
        .then(() => {
          this.$message.success('上传成功')
        })
        .catch(err => {
          console.log(err)
          if (err) this.$refs.uploadFile.clearFiles()
        })
    },
    change(type) {
      this.download = type ? '/carp/device/a/q/air/quality/download/day' : '/carp/device/a/q/air/quality/download/month'
      this.upload = type ? '/carp/device/a/q/air/quality/import/day' : '/carp/device/a/q/air/quality/import/month'
    }
  }
}
</script>

<style></style>
