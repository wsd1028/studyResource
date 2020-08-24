import $http from '@/config'
export default {
  state: {
    fullScreen: false,
    isCollapse: false,
    currentMenu: null,
    menu: [],
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'home'
      }
    ]
  },
  mutations: {
    addMenu(state, router) {
      // 获取菜单
      $http.get('/carp/auth/a/q/menu').then(({ code, data }) => {
        // 菜单权限验证
        menuVerification.call(this, data).then(() => {
          if (code === 0) {
            let currentMenu = [
              {
                path: '/',
                component: () => import(`@/views/Main`),
                children: [
                  {
                    label: '用户空间',
                    path: '/userSpace',
                    name: 'userSpace',
                    component: () => import('@/views/userSpace/Index')
                  },
                  {
                    label: '项目信息',
                    path: '/projectInfo',
                    name: 'projectInfo',
                    component: () => import('@/views/projectInfo/Index')
                  }
                ]
              }
            ]

            state.menu = data

            data.forEach(item => {
              if (item.children) {
                item.children = item.children.map(item => {
                  if (item.path === router.history.current.path) this.commit('selectMenu', item)
                  item.component = () => import(`@/views/${item.url}`)
                  return item
                })
                currentMenu[0].children.push(...item.children)
              } else {
                if (item.path === router.history.current.path) this.commit('selectMenu', item)
                item.component = () => import(`@/views/${item.url}`)
                if (item.path !== null) {
                  currentMenu[0].children.push(item)
                }
              }
            })

            currentMenu.push(
              {
                label: '用户空间',
                path: '/dustMap',
                name: 'dustMap',
                component: () => import('@/views/base/dataView/Index')
              },
              {
                path: '/404',
                name: 'notFound',
                component: () => import('@/views/error/404')
              },
              {
                path: '*', // 重定向
                redirect: '/404' // 重定向到错误页面
              }
            )

            router.addRoutes(currentMenu)
          } else {
            console.log('菜单列表请求失败')
          }
        })
      })
    },
    selectMenu(state, val) {
      // 判断是菜单对象还是路由名称,是路由名称则先检索菜单对象
      if (val.substr) {
        // 在菜单列表中递归查询当前路由名称的对象
        let selectMenu = (name, menus, callback) => {
          menus.forEach(menu => {
            if (menu.name === name) {
              callback(menu)
            } else if (menu.children && menu.children[0]) {
              selectMenu(name, menu.children, callback)
            }
          })
        }
        selectMenu(val, state.menu, menu => (val = menu))
      }

      if (val.name !== 'home') {
        state.currentMenu = val
        let result = state.tabsList.findIndex(item => item.name === val.name)
        result === -1 ? state.tabsList.push(val) : ''
      } else {
        state.currentMenu = null
      }
      // val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu = val)
    },
    closeTab(state, val) {
      let result = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(result, 1)
    },
    collapseMenu(state) {
      let val = true
      if (state.isCollapse) {
        state.isCollapse = !val
      } else {
        state.isCollapse = val
      }
    }
  },
  actions: {}
}

/* *
 * 菜单权限验证
 * @param menus: 菜单树
 * */
function menuVerification(menus) {
  return new Promise((resolve, reject) => {
    // 获取当前用户绑定的角色
    getRoles(this.state.user.userInfo.id).then(({ code, data, message }) => {
      if (code === 0) {
        // 获取权限列表
        getPermissions(data).then(data => {
          menusPermissionFilter(menus, data)
          resolve(menus)
        })
      } else {
        reject('获取当前用户绑定的角色失败: ' + message)
      }
    })
  })
}

// 通过用户id获取角色列表 @param userId:用户id
function getRoles(userId) {
  return $http.get(`/carp/auth/a/q/account_role/${userId}`)
}

// 通过角色列表获取权限列表
function getPermissions(roleList) {
  // 通过角色列表并发请求权限列表
  const promiseList = roleList.map(item => {
    return new Promise(resolve => {
      $http.get(`/carp/auth/a/q/account_permission/tree/${item.roleId}`).then(({ code, data }) => {
        if (code === 0) {
          resolve(data)
        } else {
          resolve(false)
        }
      })
    })
  })
  // 等待所有请求完毕
  return new Promise((resolve, reject) => {
    Promise.all(promiseList)
      .then(res => {
        let permissions = []
        res.forEach(item => {
          if (item) {
            permissions = permissions.concat(item)
          }
        })
        let permissionsArray = []
        treeConvertArray(permissions, permissionsArray)
        resolve(Array.from(new Set(permissionsArray)))
      })
      .catch(err => {
        if (err) reject(err)
      })
  })
}

// 权限树转一维数组
function treeConvertArray(tree, arr) {
  tree.forEach(item => {
    arr.push(item.uri)
    if (item.children && item.children.length) {
      treeConvertArray(item.children, arr)
    }
  })
}

// 验证菜单权限,去除没有权限的菜单
function menusPermissionFilter(menus, permissions) {
  for (let i = 0; i < menus.length; i++) {
    // 不存在权限
    if (permissions.indexOf(menus[i].uri) === -1) {
      menus.splice(i, 1)
      i--
    } else {
      if (menus[i].children && menus[i].children.length) {
        menusPermissionFilter(menus[i].children, permissions)
      }
    }
  }
}
