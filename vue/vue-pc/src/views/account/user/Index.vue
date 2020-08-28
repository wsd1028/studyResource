<template>
  <div class="container">
    <!-- 表操作组件 -->
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="eidtUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-edit="false"
      :show-control-del="false"
      :show-control="[0].includes($userType)"
      :filters="filters"
      :bind-buttons="bindBt"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 表操作组件end -->

    <!-- 角色绑定操作 -->
    <el-dialog class="dialog" :visible.sync="roleBind.show" top="6vh" width="576px">
      <!-- 标题 -->
      <div slot="title">
        <span style="margin-right:4px">角色绑定</span>
        <el-tag size="mini">{{ user.accountBaseDto_name }}</el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <role-bind :user="user" ref="roleBind"></role-bind>
      <!-- 绑定操作表单end -->
      <!-- 确认取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleBind.show = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            roleBind.show = false
            roleBindSubmit()
          "
          >确 定</el-button
        >
      </span>
      <!-- 确认取消按钮end -->
    </el-dialog>
    <!-- 角色绑定操作end -->
    <!-- 项目角色绑定操作 -->
    <el-dialog class="dialog" :visible.sync="projectRoleBind.show" top="6vh" width="576px">
      <!-- 标题 -->
      <div slot="title">
        <span style="margin-right:4px">项目角色分配</span>
        <el-tag size="mini">{{ user.accountBaseDto_name }}</el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <project-role-bind :user="user" ref="projectRoleBind"></project-role-bind>
      <!-- 绑定操作表单end -->
      <!-- 确认取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="projectRoleBind.show = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            projectRoleBind.show = false
            projectRoleBindSubmit()
          "
          >确 定</el-button
        >
      </span>
      <!-- 确认取消按钮end -->
    </el-dialog>
    <!-- 项目角色绑定操作end -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import roleBind from './RoleBind'
import projectRoleBind from './ProjectRoleBind'
export default {
  name: 'user',
  data() {
    // 表操作权限
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`dust_system_user_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })

    // 当前登录用户
    const user = this.$store.state.user.userInfo
    return {
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        // 表单高度
        formHeight: '36vh',
        // 表格控制列宽度
        tableControlWidth: '200px',
        // 表单数据
        data: {
          accountBaseDto: {
            sex: true
          },
          accountTypeDto: {}
        },
        // 监听添加窗口打开时显示密码输入框
        onBeforeAddShow() {
          this.label.password.show = true
        },
        // 监听修改窗口打开时隐藏密码输入框
        onBeforeEditShow() {
          this.label.password.show = false
        },

        // 监听用户创建成功事件,成功后绑定用户类型对应角色 @param data: 新增用户对象
        onCreated(data) {
          // 查询用户id
          this.$http
            .get('/carp/auth/a/q/account', {
              params: {
                limit: 1,
                page: 1,
                username: data.username,
                type: data.accountTypeDto.type
              }
            })
            .then(({ code, data }) => {
              if (code === 0) {
                data = data.records[0]
                // 用户id
                let accountId = data.id
                // 角色id
                let roleId = null
                this.form.label.accountTypeDto_type.item.forEach(item => {
                  if (item.code == data.accountTypeDto.type) roleId = item.roleId
                })
                if (!roleId) {
                  this.$message.error('用户角色绑定失败,请联系管理人员')
                  return
                }
                // 查询到用户id后绑定用户类型对应的角色
                this.$http
                  .post('/carp/auth/a/q/account_role', {
                    accountId,
                    roleId
                  })
                  .then(({ code }) => {
                    if (code !== 0) {
                      this.$message.error('用户角色绑定失败,请联系管理人员')
                    }
                  })
                  .catch(err => {
                    if (err) {
                      this.$message.error('用户角色绑定失败,请联系管理人员')
                    }
                  })
              }
            })
        },

        // 表格标题
        label: {
          // 头像
          accountBaseDto_photo: {
            label: '头像',
            type: 'uploadImg',
            colType: 'avatar',
            span: 24,
            real: false,
            url: '/carp/file/a/q/file/upload/files/base_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            },
            success: ({ code, data }) => {
              if (code !== 4002) {
                this.$message.error('图片上传失败')
              } else {
                this.form.data.accountBaseDto.photo = this.form.data.accountBaseDto_photo = data
                this.$message.success('图片上传成功')
              }
            }
          },
          // 用户类型
          accountTypeDto_type: {
            label: '用户类型',
            type: 'select',
            width: '160',
            real: false,
            allowReset: false,
            span: 8,
            item: [
              { label: '系统管理员', code: 0 },
              { label: '公司内部', code: 10 },
              { label: '安装运维', code: 20 },
              { label: '项目人员', code: 30 },
              { label: '银行', code: 40 },
              { label: '主管部门', code: 50 },
              { label: '消纳员', code: 60 },
              { label: '运输公司', code: 70 },
              { label: '设备厂商', code: 80 }
            ],
            rule: {
              regExp: /^./g,
              message: '不能为空'
            },
            required: true
          },
          // 地区码/银行码
          accountTypeDto_code: {
            label: '地区',
            type: 'area',
            areaTree: [0].includes(this.$userType)
              ? null
              : (() => {
                  let areaTree = []
                  this.$getAreaTree(user.accountTypeDto.code, tree => (areaTree = [tree]))
                  return areaTree
                })(),
            props: {
              label: 'name',
              code: 'code'
            },
            colShow: false,
            placeholder: '选择地区',
            real: false,
            rule: {
              regExp: /./g,
              message: '不能为空'
            },
            span: 8,
            default: '5115',
            required: true
          },
          // 附属信息
          accountTypeDto_ancillary: {
            label: '所属企业',
            placeholder: '请输入企业全称',
            type: 'company',
            companyType: '145',
            show: false,
            required: true,
            change(id) {
              this.form.data.accountTypeDto.ancillaryId = id
            }
          },
          // 附属信息 附属信息 示type而定，公司类型为公司ID，消纳站类型为消纳站ID，项目类型为项目ID(可以为默认登录项目)
          accountTypeDto_ancillaryId: {
            label: '消纳站',
            type: 'garbageStation',
            colShow: false,
            span: 8,
            real: false,
            required: true,
            change() {
              this.data.organizationDto = this.data.accountTypeDto_organizationId = null
            }
          },
          // 组织机构
          accountTypeDto_organizationId: {
            label: '组织机构',
            type: 'organization',
            colShow: false,
            change(id) {
              this.data.accountTypeDto_ancillaryId = null
              this.data.accountTypeDto.organizationId = id
            },
            real: false,
            required: true
          },
          // 占位符
          aaa: {
            type: 'title',
            span: 24,
            real: false,
            colShow: false
          },
          // 用户名
          username: {
            label: '账号',
            colType: 'edit',
            type: 'string',
            allowReset: false,
            span: 8,
            rule: {
              regExp: /^\w{2,11}$/gi,
              message: '2-11位的英文或数字'
            },
            required: true
          },
          // 密码
          password: {
            label: '密码',
            type: 'password',
            colShow: false,
            span: 8,
            allowReset: false,
            required: true
          },
          // 姓名
          accountBaseDto_name: {
            label: '姓名',
            type: 'string',
            real: false,
            span: 8,
            rule: {
              regExp: /^([\u4e00-\u9fa5]){2,10}$/gi,
              message: '2-10位的汉字'
            },
            required: true
          },
          // 性别
          accountBaseDto_sex: {
            label: '性别',
            type: 'radio',
            default: true,
            real: false,
            span: 8,
            item: [
              { label: '男', code: true },
              { label: '女', code: false }
            ],
            required: true
          },
          // 占位符(无实际作用)
          bbb: {
            type: 'title',
            span: 24,
            real: false,
            colShow: false
          },
          // 生日
          accountBaseDto_birthday: {
            label: '生日',
            type: 'date',
            colShow: false,
            real: false,
            default: '',
            span: 8,
            width: 120
          },
          // 身份证号码
          accountBaseDto_idCard: {
            label: '身份证',
            type: 'string',
            colShow: false,
            real: false,
            width: 180,
            span: 8,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 手机号
          accountBaseDto_phone: {
            label: '手机号',
            type: 'number',
            real: false,
            width: 160,
            span: 8,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          accountBaseDto: {
            show: false,
            colShow: false,
            default: {}
          },
          jobTitleDtoList: {
            show: false,
            colShow: false,
            default: []
          },
          accountTypeDto: {
            show: false,
            colShow: false,
            default: {}
          },
          organizationDto: {
            show: false,
            colShow: false,
            default: {}
          },
          /* *
           * 非真实信息,发送请求时不传递
           * * */
          accountBaseDto_accountId: {
            real: false,
            show: false,
            colShow: false
          },
          accountBaseDto_id: {
            real: false,
            show: false,
            colShow: false
          },
          accountTypeDto_accountId: {
            real: false,
            show: false,
            colShow: false
          },
          accountTypeDto_createDate: {
            real: false,
            show: false,
            colShow: false
          },
          accountTypeDto_id: {
            real: false,
            show: false,
            colShow: false
          },
          accountTypeDto_modifyDate: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_id: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_areaCode: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_areaId: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_areaName: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_children: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_createDate: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_modifyDate: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_name: {
            real: false,
            show: false,
            colShow: false
          },
          organizationDto_parentId: {
            real: false,
            show: false,
            colShow: false
          }
        },
        // 表格列排序
        tableSort: ['accountBaseDto_photo', 'username', 'accountBaseDto_name', 'accountBaseDto_sex', 'accountBaseDto_phone', 'accountTypeDto_type']
      },
      // 用户信息
      user: {},
      // 角色绑定操作模块的数据
      roleBind: {
        show: false
      },
      // 项目角色绑定操作
      projectRoleBind: {
        show: false
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/account',
      eidtUrl: '/carp/auth/a/q/account',
      delUrl: '/carp/auth/a/q/account',
      searchUrl: '/carp/auth/a/q/account',
      // 表格内容过滤器
      filters: {
        // 用户类型
        type: {
          label: '用户类型',
          type: 'select',
          item: [
            { label: '全部', code: '' },
            { label: '系统管理员', code: 0 },
            { label: '公司内部', code: 10 },
            { label: '安装运维', code: 20 },
            { label: '项目人员', code: 30 },
            { label: '银行', code: 40 },
            { label: '主管部门', code: 50 },
            { label: '消纳员', code: 60 },
            { label: '运输公司', code: 70 }
          ],
          value: [0].includes(this.$userType) ? null : 50
        },
        // 名称搜索
        username: {
          label: '根据账号,姓名,手机号搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  computed: {
    bindBt() {
      let userType = this.$userType
      let buttons = []
      if ([0].includes(userType)) {
        buttons.push({ key: 'role', label: '角色' })
      }
      if ([0, 50].includes(userType)) {
        buttons.push({ key: 'projectRole', label: '项目角色' })
      }
      if ([0].includes(userType)) {
        buttons.push({ key: 'resetPassword', label: '重置密码', type: 'danger' })
      }
      return buttons
    }
  },
  watch: {
    /* *
     * 假数据变动改变真实数据
     * * */
    'form.data.accountBaseDto_birthday': {
      handler(value) {
        this.form.data.accountBaseDto.birthday = value
      }
    },
    'form.data.accountBaseDto_idCard': {
      handler(value) {
        this.form.data.accountBaseDto.idCard = value
      }
    },
    'form.data.accountBaseDto_name': {
      handler(value) {
        this.form.data.accountBaseDto.name = value
      }
    },
    'form.data.accountBaseDto_phone': {
      handler(value) {
        this.form.data.accountBaseDto.phone = value
      }
    },
    'form.data.accountBaseDto_sex': {
      handler(value) {
        this.form.data.accountBaseDto.sex = value
      }
    },
    'form.data.accountTypeDto_type': {
      handler(value) {
        this.form.data.accountTypeDto.type = value
        /* *
         * 通过用户类型是否为银行判断填写地区码或银行码
         * * */
        let isBank = value == 40
        this.form.label.accountTypeDto_code.label = isBank ? '银行码' : '地区'
        this.form.label.accountTypeDto_code.type = isBank ? 'string' : 'area'
        this.form.label.accountTypeDto_code.placeholder = isBank ? '输入银行码' : '搜索地区名称'

        /* *
         * 用户类型为项目/消纳员/设备厂商
         * * */
        this.form.label.accountTypeDto_ancillaryId.show = [30, 60, 80, 90].includes(value)
        this.form.label.accountTypeDto_ancillaryId.type = { 30: 'project', 60: 'garbageStation', 80: 'manufacturer', 90: 'agent' }[value]
        this.form.label.accountTypeDto_ancillaryId.label = { 30: '项目', 60: '消纳站', 80: '设备厂商', 90: '接入厂商' }[value]

        /* *
         * 用户类型为运输企业
         * * */
        this.form.label.accountTypeDto_ancillary.show = [70].includes(value)

        // 主管部门(政府)类型
        this.form.label.accountTypeDto_organizationId.show = [50].includes(value)
      }
    },
    'form.data.accountTypeDto_code': {
      handler(value) {
        this.form.data.accountTypeDto.code = value
      }
    },
    'form.data.accountTypeDto_ancillaryId': {
      handler(value) {
        this.form.data.accountTypeDto.ancillaryId = value
      }
    }
  },
  methods: {
    /* *
     * 获取点击的行内容
     * * */
    getRow({ row, key }) {
      // 获取用户信息
      this.user = row

      switch (key) {
        // 角色绑定操作
        case 'role':
          this.roleBind.show = true
          break

        // 项目角色绑定操作
        case 'projectRole':
          this.projectRoleBind.show = true
          break

        // 重置密码
        case 'resetPassword':
          this.$confirm(`此操作将重置 ${row.accountBaseDto.name} 密码, 是否确定?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              // 发送请求
              this.$http
                .post(
                  '/carp/auth/a/q/account/restPwd',
                  {},
                  {
                    params: {
                      accountId: row.id
                    }
                  }
                )
                .then(({ code, message }) => {
                  if (code === 0) {
                    this.$message.success(row.accountBaseDto.name + ' 密码已重置')
                  } else {
                    this.$message.error('请求失败: ' + message)
                  }
                })
            })
            .catch(() => {})
          break

        default:
          break
      }
    },

    /* *
     * 提交用户的角色绑定修改
     * * */
    async roleBindSubmit() {
      /* *
       * 角色绑定修改提交操作
       * * */
      // 获取角色修改数据
      let params = this.$refs['roleBind'].role.roles
      if (!params) {
        this.$message('未发现修改')
        return
      }
      // 修改的数据条目长度为0,则直接删除绑定
      if (params.length === 0) {
        const { code } = await this.$http.delete(`/carp/auth/a/q/account_role/${this.user.id}`)
        if (code === 0) {
          this.$message.success('角色绑定修改成功')
        }
      }
      // 修改绑定
      else {
        const { code } = await this.$http.put('/carp/auth/a/q/account_role', params)
        if (code === 0) {
          this.$message.success('角色绑定修改成功')
        } else {
          this.$message.error('角色绑定修改失败')
        }
      }

      // 清除用户数据
      this.user = {}

      // 刷新表格
      this.$refs.tableControl.getList()
    },

    /* *
     * 提交用户的项目角色绑定修改
     * * */
    async projectRoleBindSubmit() {
      let userBindObj = this.$refs['projectRoleBind']
      // 判断是否进行了用户角色与项目的绑定操作,如未进行绑定操作则不会继续执行后续操作
      if (!(userBindObj.project.id && userBindObj.project.isEdit)) {
        this.user = {}
        return
      }
      // 设置请求参数
      let params = {
        accountId: this.user.id,
        projectId: userBindObj.project.id,
        roleIdList: userBindObj.project.had
      }
      // 发送请求
      const { code } = await this.$http.put('/carp/auth/a/q/account_role_project', params)
      if (code === 0) {
        this.$message.success('角色项目绑定成功')
      } else {
        this.$message.error('角色项目绑定失败')
      }

      // 清除用户数据
      this.user = {}

      // 刷新表格
      this.$refs.tableControl.getList()
    }
  },
  created() {
    // 获取用户类型字典表
    this.$http.get('/carp/business/a/q/dict/category/user_type').then(({ code, data }) => {
      if (code === 0) {
        this.form.label.accountTypeDto_type.item = ([0].includes(this.$userType) ? data : data.slice(data.length - 4, data.length)).map(item => ({
          label: item.name,
          code: parseInt(item.code),
          roleId: item.remark
        }))
        this.filters.type.item = this.form.label.accountTypeDto_type.item
      }
    })
  },
  components: {
    commonTableControl,
    roleBind,
    projectRoleBind
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  flex: auto;
  height: 0;
  @flex-column();
}
</style>
