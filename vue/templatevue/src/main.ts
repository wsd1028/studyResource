import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";

import MySelf from "./app/components/mySelf.vue";
import Business from "./app/components/business.vue";
import Desktop from "./app/components/desktop.vue";
import GpuDesktop from "./app/components/gpuDesktop.vue";
import HardDisk from "./app/components/hardDisk.vue";
import HardDiskBack from "./app/components/hardDiskBack.vue";
import EnginePrice from "./app/components/enginePrice.vue";
import Bandwidth from "./app/components/bandwidth.vue";
import Discounts from "./app/components/discounts.vue";
import Liveness from "./app/components/liveness.vue";
import CallDetail from "./app/components/callDetail.vue";
import CallDetailShow from "./app/components/callDetailShow.vue";
import LivenessDetail from "./app/components/livenessDetail.vue";
import LivenessDetailShow from "./app/components/livenessDetailShow.vue";
import ResourceDetail from "./app/components/resourceDetail.vue";
import ResourceDetailShow from "./app/components/resourceDetailShow.vue";
import SellDetail from "./app/components/sellDetail.vue";
import SellDetailShow from "./app/components/sellDetailShow.vue";
Vue.config.productionTip = false;
var routes = [
  { path: "/mySelf", component: MySelf }, //个人信息修改
  { path: "/business", component: Business }, //云业务量收发报表
  { path: "/liveness", component: Liveness }, //活跃度报表
  { path: "/discounts", component: Discounts }, //优惠活动管理
  { path: "/bandwidth", component: Bandwidth }, //公网带宽资费管理
  { path: "/enginePrice", component: EnginePrice }, //云主机系列定价管理
  { path: "/hardDiskBack", component: HardDiskBack }, //云硬盘备份资费管理
  { path: "/hardDisk", component: HardDisk }, //云硬盘资费管理
  { path: "/gpudesktop", component: GpuDesktop }, //GPU云桌面资费管理
  { path: "/desktop", component: Desktop }, //云桌面资费管理
  { path: "/callDetailShow", component: CallDetailShow }, //话单数据展示
  { path: "/callDetail", component: CallDetail }, //话单数据管理
  { path: "/livenessDetailShow", component: LivenessDetailShow }, //活跃度数据展示
  { path: "/livenessDetail", component: LivenessDetail }, //活跃度数据管理
  { path: "/resourceDetailShow", component:ResourceDetailShow }, //资源明细数据展示
  { path: "/resourceDetail", component: ResourceDetail } ,//资源明细数据管理
  { path: "/sellDetailShow", component:SellDetailShow }, //销售数据展示
  { path: "/sellDetail", component: SellDetail } ,//销售数据管理
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
