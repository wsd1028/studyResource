import comA from './index.vue'
comA.install = Vue => {
  Vue.component(comA.name, comA)
}
// 全局导入
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(comA)
}
export default comA