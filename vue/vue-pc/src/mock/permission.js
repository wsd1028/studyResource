import Mock from 'mockjs'
export default {
  getMenu: config => {
    const { username, password } = JSON.parse(config.body)
    console.log(JSON.parse(config.body))
    // 先判断用户是否存在
    if (username === 'lam' || username === 'wp') {
      // 判断账号和密码是否对应
      if (username === 'lam' && password === '123456') {
        return {
          code: 0,
          data: {
            menu: [
              {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'home/Home'
              },
              {
                label: '基础数据管理',
                icon: 's-data',
                children: [
                  {
                    path: '/company',
                    name: 'company',
                    label: '企业管理',
                    icon: 'office-building',
                    url: 'base/company/Index'
                  },
                  {
                    path: '/project',
                    name: 'project',
                    label: '项目管理',
                    icon: 'office-building',
                    url: 'base/project/Index'
                  },
                  {
                    path: '/address',
                    name: 'address',
                    label: '地址管理',
                    icon: 'office-building',
                    url: 'base/address/Index'
                  },
                  {
                    path: '/projectmap',
                    name: 'projectmap',
                    label: '项目排布图',
                    icon: 'office-building',
                    url: 'base/projectmap/Index'
                  }
                ]
              },
              {
                label: '系统管理',
                icon: 'location',
                children: [
                  {
                    path: '/user',
                    name: 'user',
                    label: '用户管理',
                    icon: 'setting',
                    url: 'account/User'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '权限管理',
                    icon: 'setting',
                    url: 'account/Account'
                  },
                  {
                    path: '/role',
                    name: 'role',
                    label: '角色管理',
                    icon: 'setting',
                    url: 'account/Role'
                  },
                  {
                    path: '/job',
                    name: 'job',
                    label: '职务管理',
                    icon: 'setting',
                    url: 'account/Job'
                  },
                  {
                    path: '/menu',
                    name: 'menu',
                    label: '菜单管理',
                    icon: 'setting',
                    url: 'account/Menu'
                  }
                ]
              },
              {
                label: '排放管理',
                icon: 's-release',
                children: [
                  {
                    path: '/account',
                    name: 'account',
                    label: '排放归档案',
                    icon: 'setting',
                    url: 'account/Index',
                    permisison: ''
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '工期管理',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/map',
                    name: 'map',
                    label: '运输合同',
                    icon: 'setting',
                    url: 'test/testMap'
                  },
                  {
                    path: '/emissioncard',
                    name: 'emissioncard',
                    label: '排放证',
                    icon: 'setting',
                    url: 'emission/card/Index'
                  },
                  {
                    path: '/spotcheck',
                    name: 'spotcheck',
                    label: '点检',
                    icon: 'setting',
                    url: 'emission/spotcheck/Index'
                  }
                ]
              },
              {
                label: '运输管理',
                icon: 'truck',
                children: [
                  {
                    path: '/transportcard',
                    name: 'transportcard',
                    label: '运输证管理',
                    icon: 'setting',
                    url: 'transport/card/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '非名录车监控',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '名录车监控',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '重点车辆监控',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '运输规范行为',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '名录车维护',
                    icon: 'setting',
                    url: 'account/Index'
                  }
                ]
              },
              {
                label: '消纳管理',
                icon: 's-grid',
                children: [
                  {
                    path: '/savespace',
                    name: 'savespace',
                    label: '消纳场',
                    icon: 'setting',
                    url: 'save/space/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '疑似消纳',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '电子联单',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/account',
                    name: 'account',
                    label: '产品平衡',
                    icon: 'setting',
                    url: 'account/Index'
                  },
                  {
                    path: '/accom',
                    name: 'accommap',
                    label: '消纳场排布图',
                    icon: 'setting',
                    url: 'accom/map/Index'
                  }
                ]
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      } else if (username === 'wp' && password === '123456') {
        return {
          code: 20000,
          data: {
            menu: [
              {
                path: '/',
                name: 'home',
                label: '首页',
                icon: 's-home',
                url: 'Home/Home'
              },
              {
                path: '/video',
                name: 'video',
                label: '视频管理页',
                icon: 'video-play',
                url: 'VideoManage/VideoManage'
              }
            ],
            token: Mock.Random.guid(),
            message: '获取成功'
          }
        }
      } else {
        return {
          code: -999,
          data: {
            message: '密码错误'
          }
        }
      }
    } else {
      return {
        code: -999,
        data: {
          message: '用户不存在'
        }
      }
    }
  }
}
