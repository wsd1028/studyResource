//打包组件时
// import Vue from 'vue'
// import NodeSelector from './app/components/NodeSelector.vue';

// Vue.config.productionTip = false;

// const components = [
//     NodeSelector
// ];

// export default components;


//测试时
import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import ElementUI from "element-ui";

Vue.use(ElementUI);

import Test from "./app/components/test.vue";
import Test2 from "./app/components/test2.vue";

Vue.config.productionTip = false;
var routes = [
  { path: "/test", component: Test },
  { path: "/test2", component: Test2 }
];
var router = new VueRouter({
  routes: routes
});
new Vue({
  router,
  render: h => h(App),
  mounted() {
    var app = this;
    //IE11下兼容Vue-Router
    if (
      "-ms-scroll-limit" in document.documentElement.style &&
      "-ms-ime-align" in document.documentElement.style
    ) {
      window.addEventListener(
        "hashchange",
        function() {
          var currentPath = window.location.hash.slice(1);
          if (app.$route.path !== currentPath) {
            app.$router.replace(currentPath);
          }
        },
        false
      );
    }
  }
}).$mount("#app");



