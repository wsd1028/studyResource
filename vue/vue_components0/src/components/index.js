// components/index.js
import comA from "./comA/index"
const components = [comA]
const install = Vue => {
    components.map(component => {
        Vue.component(component.name, component)
    })
}
if (window !== undefined && window.Vue) {
    install(window.Vue)
}
export default {
    install,
    comA,
}
