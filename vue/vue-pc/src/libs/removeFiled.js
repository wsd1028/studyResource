/* *
 * 正则移除对象中的字段
 * */
export default (obj, regExp) => {
  return Object.keys(obj).every(key => {
    return !regExp.test(obj[key])
  })
}
