/* *
 * 自定义全局指令
 * */
import $http from '@/config'
import qs from 'qs'
export default Vue => {
  let directive = directives()
  Object.keys(directive).forEach(key => {
    Vue.directive(key, directive[key])
  })
}

/* *
 * 指令对象数组
 * */
function directives() {
  return {
    // 权限验证指令
    permission: {
      inserted: function(el, { value }) {
        el.style.display = 'none'
        // 权限请求
        $http
          .post(
            '/carp/auth/k/q/hasPermission',
            qs.stringify(
              {
                permissions: [value],
                logical: 'or'
              },
              { arrayFormat: 'repeat' }
            )
          )
          .then(({ data }) => {
            if (!data) {
              el.remove()
            } else {
              el.style.display = 'block'
            }
          })
          .catch(err => {
            if (err) el.remove
          })
      }
    }
  }
}
