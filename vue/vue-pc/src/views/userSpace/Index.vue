<template>
  <el-row class="main-container" type="flex" align="stretch">
    <el-col :lg="6" class="left-container">
      <el-card header="个人信息" class="card" style="overflow:visible">
        <el-row>
          <el-col>
            <el-avatar class="avatar" :src="avatar" fit="cover"></el-avatar>
          </el-col>
          <el-col>
            <h3 class="name">
              <span v-text="user.accountBaseDto.name"></span>
              <el-tag class="el-tag" type="success" size="mini" v-text="getAccountType"></el-tag>
            </h3>
          </el-col>
          <el-col style="display:flex;flex-wrap:wrap">
            <el-row :gutter="10">
              <el-col class="col-info" :span="12">
                <span class="title">用户名:&nbsp;</span>
                <span class="info" v-text="user.username"></span>
              </el-col>
              <el-col class="col-info" :span="12">
                <span class="title">性别:&nbsp;</span>
                <span class="info" v-text="user.accountBaseDto.sex ? '男' : '女'"></span>
              </el-col>
              <el-col class="col-info" :span="12">
                <span class="title">生日:&nbsp;</span>
                <span class="info" v-text="user.accountBaseDto.birthday && user.accountBaseDto.birthday.replace(/\s.*/g, '')"></span>
              </el-col>
              <el-col class="col-info" :span="12">
                <span class="title">电话:&nbsp;</span>
                <span class="info" v-text="user.accountBaseDto.phone"></span>
              </el-col>
              <el-col v-if="user.organizationDto" class="col-info" :span="12">
                <span class="title">所属单位:&nbsp;</span>
                <span class="info" v-text="user.organizationDto.name"></span>
              </el-col>
              <el-col v-if="user.organizationDto" class="col-info" :span="12">
                <span class="title">行政地区:&nbsp;</span>
                <span class="info" v-text="user.organizationDto.areaName"></span>
              </el-col>
              <el-col v-if="[30].includes($userType)" class="col-info" :span="24">
                <span class="title">所属项目:&nbsp;</span>
                <span class="info" v-text="project.name"></span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :lg="18" class="right-container">
      <el-card class="card" style="overflow:visible">
        <!-- 导航栏 -->
        <nav>
          <!-- 导航菜单 -->
          <el-menu default-active="0" class="el-menu" mode="horizontal" @select="active = $event">
            <el-menu-item v-for="(item, index) in navbars" :key="index" :index="`${index}`" class="nav-item">
              <span v-text="item.label"></span>
            </el-menu-item>
          </el-menu>
        </nav>
        <!-- 修改信息 -->
        <article class="info" v-show="active == 0">
          <common-form ref="commonForm" :formConfig="form"></common-form>
          <div class="bt-group">
            <el-button type="info" @click="handleFormReset">重置</el-button>
            <el-button type="primary" @click="handleFormSubmit">提交</el-button>
          </div>
        </article>
        <!-- 修改密码 -->
        <article class="password" v-show="active == 1">
          <el-form ref="pwForm" label-position="left" label-width="80px" :rules="passwordRules" :model="pwForm">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="pwForm.oldPassword" size="mini" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="pwForm.password" size="mini" show-password></el-input>
            </el-form-item>
            <el-form-item class="bt-group">
              <el-button type="primary" @click="handlePasswordModify">提交</el-button>
            </el-form-item>
          </el-form>
        </article>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import commonForm from '@/components/CommonForm'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      avatar: this.$store.state.config.convertImgUrl(this.$store.state.user.userInfo.accountBaseDto.photo) || require('@/assets/images/user.png'),
      // 导航栏索引号
      active: 0,
      // 导航栏配置
      navbars: [
        {
          label: '修改个人信息'
        },
        {
          label: '修改密码'
        }
      ],
      // 个人资料表单内容配置
      form: {
        data: {},
        // 表格标题
        label: {
          photo: {
            label: '头像',
            url: '/carp/file/a/q/file/upload/files/base_image',
            type: 'uploadImg',
            span: 24
          },
          name: {
            label: '姓名',
            span: 12,
            rule: {
              regExp: /^([\u4e00-\u9fa5]){2,10}$/gi,
              message: '2-4位的汉字'
            }
          },
          sex: {
            label: '性别',
            type: 'radio',
            span: 12,
            item: [
              { label: '男', code: true },
              { label: '女', code: false }
            ],
            default: true
          },
          phone: {
            label: '电话',
            span: 12,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          idCard: {
            label: '身份证',
            span: 12,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          }
        }
      },
      // 密码修改表单
      pwForm: {
        oldPassword: '',
        password: '',
        accountId: this.$store.state.user.userInfo.id
      },
      passwordRules: {
        oldPassword: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },

      // 项目人员项目信息
      project: {},
      // 消纳员消纳站信息
      garbageStation: {}
    }
  },
  computed: {
    ...mapState({
      user(state) {
        let result = state.user.userInfo
        this.getData(result.accountTypeDto.ancillaryId)
        return result
      }
    }),
    getAccountType() {
      return {
        '0': '系统管理员',
        '10': '公司内部',
        '20': '安装运维',
        '30': '项目人员',
        '40': '银行',
        '50': '主管部门',
        '60': '消纳站',
        '70': '运输公司'
      }[this.user.accountTypeDto.type]
    }
  },
  mounted() {
    // 用户数据初始化
    // this.$refs.commonForm.formInit()
    // 用户数据填充表单
    this.formFill()
  },
  methods: {
    /* *
     * 获取用户附属信息
     * @param id: 附属id
     * * */
    getData(id) {
      // 项目人员获取项目信息
      if ([30].includes(this.$userType)) {
        this.$http.get(`/carp/business/a/q/project/${id}`).then(({ code, data }) => {
          if (code === 0) {
            this.project = data
          } else {
            this.$message.error('项目信息请求失败')
          }
        })
      }
    },

    /* *
     * 用户数据填充表单
     * * */
    formFill() {
      Object.keys(this.form.label).forEach(key => {
        this.form.data[key] = this.user.accountBaseDto[key]
      })
    },

    /* *
     * 重置表单
     * * */
    handleFormReset() {
      this.formFill()
    },

    /* *
     * 提交表单
     * * */
    handleFormSubmit() {
      let account = JSON.parse(JSON.stringify(this.user))
      let accountBaseDto = Object.assign(account.accountBaseDto, this.form.data)
      account.accountBaseDto = accountBaseDto
      this.$http.put('/carp/auth/a/q/account', account).then(({ code, message }) => {
        if (code === 0) {
          this.$store.commit('getUserInfo')
          this.$message.success('修改成功')
        } else {
          this.$message.error(message)
          this.formFill()
        }
      })
    },

    /* *
     * 修改密码
     * * */
    handlePasswordModify() {
      this.$refs.pwForm.validate(valid => {
        if (!valid) return
        this.$http.post('/carp/auth/a/q/account/pwd', this.$qs.stringify(this.pwForm)).then(({ code, message }) => {
          if (code === 0) {
            this.$http.get('/carp/auth/a/q/logout')
            this.$message.success('修改成功')
            this.$store.commit('clearToken')
            this.$store.commit('clearUserInfo')
            this.$router.push({ name: 'login' })
          } else {
            this.$message.error(message)
          }
        })
      })
    }
  },
  components: {
    commonForm
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.main-container {
  padding: 5px;
  background-color: #f9f9f9;
  flex: auto;
  .left-container,
  .right-container {
    padding: 5px;
    .card {
      height: 100%;
    }
    .info,
    .password {
      margin-top: 26px;
      .bt-group {
        text-align: center;
      }
    }
  }
  .left-container {
    .avatar {
      display: block;
      margin: auto;
      width: 100px;
      height: 100px;
    }
    .name {
      text-align: center;
    }
  }
  .col-info {
    margin-top: 10px;
  }
  .title,
  .info {
    font-size: 14px;
  }
  .title {
    color: #999999;
  }
  .el-tag {
    margin-left: 4px;
  }
}
</style>
