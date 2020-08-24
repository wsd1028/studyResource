/* *
 * 判断是否拥有角色
 * @params roles: 角色名称数组
 * @params logical: and或or
 * */
import $http from '@/config'
import qs from 'qs'
export default function(roles, logical) {
  return new Promise((resolve, reject) => {
    $http
      .post(
        '/carp/auth/k/q/hasRole',
        qs.stringify(
          {
            roles: roles,
            logical
          },
          { arrayFormat: 'repeat' }
        )
      )
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
