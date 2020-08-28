<!--导入excel表组件-->
<template>
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
</template>

<script>
export default {
  name: 'importExcel',
  props: {
    download: String,
    upload: String
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
      formData.append('files', e.file)
      this.$http
        .post(e.action, formData, {
          headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' },
          responseType: 'blob'
        })
        .then(res => {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          console.log(blob)
          let url = URL.createObjectURL(blob)
          let a = document.createElement('a')
          a.href = url
          a.download = e.file.name
          a.click()
        })
        .catch(err => {
          console.log(err)
          if (err) this.$refs.uploadFile.clearFiles()
        })
    }
  }
}
</script>

<style></style>
