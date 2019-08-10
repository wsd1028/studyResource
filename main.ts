import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";

import Show2d from "./app/components/Hunan/Show2d.vue";
import RackKey from "./app/components/RackKey.vue";
import ShapeManager from "./app/components/ShapeManager.vue";
import RackDetail from "./app/components/RackDetail.vue";
import Edit2d from "./app/components/Hunan/Edit2d.vue";
import InternetDevices from "./app/components/InternetDevices.vue";
import CustomerDevices from "./app/components/CustomerDevices.vue";
import Customer from "./app/components/Customer.vue";
import IpDevices from "./app/components/IpDevices.vue";
import IpResource from "./app/components/IpResource.vue";
import MachineRoom from "./app/components/MachineRoom.vue";
import SystemAccount from "./app/components/SystemAccount.vue";
import SystemRole from "./app/components/SystemRole.vue";
import NodeResource from "./app/components/NodeResource.vue";
import CabinetResource from "./app/components/CabinetResource.vue";
import CabinetPort from "./app/components/CabinetPort.vue";
import RentPart from "./app/components/RentPart.vue";

Vue.config.productionTip = false;
var routes = [
  { path: "/", component: Show2d },
  { path: "/show2d", component: Show2d },
  {
    path: "/show2d/:id/:pagetype",
    component: Show2d,
    children: [
      {
        path: "rack",
        component: RackDetail
      }
    ]
  },
  { path: "/rackKey", component: RackKey },
  { path: "/shapeManager", component: ShapeManager },
  { path: "/rackDetail/:rackid/:pagetype", component: RackDetail },
  { path: "/rackDetail/:rackid/:pagetype/:taskid", component: RackDetail },
  { path: "/internetDevices", component: InternetDevices },
  { path: "/customerDevices", component: CustomerDevices },
  { path: "/customer", component: Customer },
  { path: "/ipDevices", component: IpDevices },
  { path: "/ipResource", component: IpResource },
  { path: "/machineRoom", component: MachineRoom },
  { path: "/systemAccount", component: SystemAccount },
  { path: "/systemRole", component: SystemRole },
  { path: "/nodeResource", component: NodeResource },
  { path: "/cabinetResource", component: CabinetResource },
  { path: "/cabinetPort", component: CabinetPort },
  { path: "/rentPart", component: RentPart },
  { path: "/edit2d", component: Edit2d }
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
    //if (
    //  "-ms-scroll-limit" in document.documentElement.style &&
    //  "-ms-ime-align" in document.documentElement.style
    //) {
    //  window.addEventListener(
    //    "hashchange",
    //    function() {
    //      var currentPath = window.location.hash.slice(1);
    //      if (app.$route.path !== currentPath) {
    //        app.$router.replace(currentPath);
    //      }
    //    },
    //    false
    //  );
    //}
  }
}).$mount("#app");
