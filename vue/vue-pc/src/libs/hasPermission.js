import $http from '@/config'
import qs from 'qs'

/* *
 * 判断菜单权限
 * */
export default hasPermission

/* *
 * 菜单树权限验证
 * */
export async function menuVerify(menu) {
  await forMenu(menu)
}

/* *
 * 遍历菜单数组,每个层级单独发送菜单验证请求
 * @params menu: 菜单树形数组
 * */
async function forMenu(menu) {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].uri) {
      menu[i].visible = await hasPermission([menu[i].uri], 'or')
    } else {
      menu[i].visible = false
    }
    // 如果还有子项且当前目录权限验证通过则执行递归操作
    if (menu[i].children && menu[i].visible) {
      await forMenu(menu[i].children)
    }

    // 如果当前目录或菜单权限验证未通过则删除该菜单项目
    if (!menu[i].visible) {
      menu.splice(i, 1)
      i--
    } else {
      delete menu[i].uri
      delete menu[i].visible
    }
  }
}

/* *
 * 发送验证方法
 * * @params uriList: 权限列表
 * */
async function hasPermission(permissions, logical) {
  let params = {
    permissions,
    logical
  }
  let { data } = await $http.post('/carp/auth/k/q/hasPermission', qs.stringify(params, { arrayFormat: 'repeat' })).catch(() => ({ data: false }))
  return data
}
