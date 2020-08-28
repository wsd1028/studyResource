export default {
  state: {
    /*宜宾区域id*/
    yibinAreaId: '290871061266829312',
    /* *
     * 注册角色标识
     * 根据code识别 0:系统管理员 10:公司内部(本公司) 20:安装运维(本公司) 30:项目 50:政府 60:消纳员 70:企业
     * * */
    roles: [
      // 系统管理员
      { id: '307559388539912192', code: 0 },
      // 项目
      { id: '320601526546595840', code: 30 },
      // 政府人员
      { id: '311100839504773120', code: 50 },
      // 消纳员
      { id: '312156214396059648', code: 60 }
    ],

    /* *
     * 服务器文件下载地址转化
     * @param url: 文件id
     * @param isHBase: 是否在hbase文件服务器中
     * * */
    convertFileUrl(url, isHBase) {
      if (/^(http|\/carp)/.test(url)) {
        return url
      } else {
        return (isHBase ? '/carp/file/k/q/hbase/open/download/' : '/carp/file/k/q/open/download/') + url
      }
    },

    /* *
     * 服务器图片地址转化,非http开头的地址处理
     * @param url: 图片id
     * @param isHBase: 是否在hbase文件服务器中
     * * */
    convertImgUrl(url, isHBase) {
      if (/^(http|\/carp)/.test(url)) {
        return url
      } else {
        return (isHBase ? '/carp/file/k/q/hbase/open/image/' : '/carp/file/k/q/open/image/') + url
      }
    },

    /* *
     * 服务器视频预览地址转化,非http开头的地址处理
     * @param url: 视频id
     * @param isHBase: 是否在hbase文件服务器中
     * * */
    convertVideoUrl(url, isHBase) {
      if (/^(http|\/carp)/.test(url)) {
        return url
      } else {
        return (isHBase ? '/carp/file/k/q/hbase/open/video/play/' : '/carp/file/k/q/open/video/play/') + url
      }
    }
  }
}
