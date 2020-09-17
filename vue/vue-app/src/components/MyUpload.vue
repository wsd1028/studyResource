<template>
  <div class="MyUpload">
    <van-uploader
      :accept="accept"
      :after-read="afterRead"
      :max-count="limit"
      :max-size="maxSize"
      :preview-image="previewImage"
      @delete="deleteImg"
      @oversize="onOversize"
      capture="camera"
      multiple
      v-model="fileList"
    >
      <van-button :loading="loading" icon="photo" loading-text="上传中..." loading-type="spinner" type="primary" v-if="content">上传图片</van-button>
    </van-uploader>
  </div>
</template>
<script>
export default {
  name: 'myUpload',
  data() {
    return {
      loading: false,
      fileList: [],
      uploadImg: []
    }
  },
  props: {
    defaultFileList: {
      type: Array,
      default: function() {
        return []
      }
    },
    previewImage: {
      type: Boolean,
      default: true
    },
    content: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 3
    },
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 1024 //1G
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    module: {
      type: String,
      default: 'base_image'
    },
    useType: {
      type: String,
      default: 'app'
    }
  },
  watch: {
    defaultFileList(val) {
      this.fileList = JSON.parse(JSON.stringify(val))
    }
  },
  mounted() {},
  methods: {
    //文件选中之后调用
    async afterRead(file) {
      this.loading = true
      var formData = new FormData() //构造一个 FormData，把后台需要发送的参数添加
      let length = 0
      if (Array.prototype.isPrototypeOf(file)) {
        length = file.length
        for (let i = 0; i < file.length; i++) {
          formData.append('files', file[i].file) //接口需要传的参数
          this.fileList[this.fileList.length - 1 - i].message = '上传中...'
          this.fileList[this.fileList.length - 1 - i].status = 'uploading'
        }
      } else {
        formData.append('files', file.file) //接口需要传的参数
        this.fileList[this.fileList.length - 1].message = '上传中...'
        this.fileList[this.fileList.length - 1].status = 'uploading'
      }
      let url = '/carp/file/a/q/file/upload/files/'
      if (
        this.module == this.$dictionaries.imgType.today ||
        this.module == this.$dictionaries.imgType.video ||
        this.module == this.$dictionaries.imgType.car ||
        this.module == this.$dictionaries.imgType.electronic ||
        this.module == this.$dictionaries.imgType.appoint
      ) {
        url = '/carp/file/a/q/hbase/file/upload/files/'
      }
      if (this.useType == 'wechat') {
        url = '/carp/file/k/q/open/files/'
      }
      let resp = await this.$http.post(url + this.module, formData)
      if (!resp) resp = { code: 500 }
      if (resp.code == 4002) {
        if (Array.prototype.isPrototypeOf(file)) {
          for (let i = 0; i < resp.data.length; i++) {
            this.fileList[this.fileList.length - length + i].message = ''
            this.fileList[this.fileList.length - length + i].status = 'done'
            this.fileList[this.fileList.length - length + i].imgUrl = resp.data[i]
          }
        } else {
          this.fileList[this.fileList.length - 1].message = ''
          this.fileList[this.fileList.length - 1].status = 'done'
          this.fileList[this.fileList.length - 1].imgUrl = resp.data[0]
        }
      } else {
        for (let i = 0; i < length; i++) {
          this.fileList.pop()
        }
        this.$dialog.alert({
          message: '上传失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      this.uploadImg = []
      for (let i = 0; i < this.fileList.length; i++) {
        this.uploadImg.push(this.fileList[i].imgUrl)
      }
      this.$emit('uploadYes', this.uploadImg)
      this.loading = false
    },
    //文件超出大小
    onOversize(file) {
      this.$toast('文件过大')
    },
    deleteImg(file) {
      this.uploadImg = []
      for (let i = 0; i < this.fileList.length; i++) {
        this.uploadImg.push(this.fileList[i].imgUrl)
      }
      this.$emit('uploadYes', this.uploadImg)
    }
  }
}
</script>

<style lang="less">
.MyUpload {
  .van-uploader__upload {
    margin: 0;
  }
}
</style>
