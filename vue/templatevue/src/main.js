import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import MapShow from "./app/components/MapShow.vue";
import MapSys from "./app/components/MapSys.vue";
import MonitoringShow from "./app/components/MonitoringShow.vue";
import MonitoringSys from "./app/components/MonitoringSys.vue";
Vue.config.productionTip = false;
var routes = [
    { path: "/", component: MapShow },
    { path: "/mapShow", component: MapShow },
    { path: "/mapSys", component: MapSys },
    { path: "/monitoringShow", component: MonitoringShow },
    { path: "/monitoringSys", component: MonitoringSys }
];
var router = new VueRouter({
    routes: routes
});
new Vue({
    router: router,
    render: function (h) { return h(App); },
    mounted: function () {
        var app = this;
        //IE11下兼容Vue-Router
        if ("-ms-scroll-limit" in document.documentElement.style &&
            "-ms-ime-align" in document.documentElement.style) {
            window.addEventListener("hashchange", function () {
                var currentPath = window.location.hash.slice(1);
                if (app.$route.path !== currentPath) {
                    app.$router.replace(currentPath);
                }
            }, false);
        }
    }
}).$mount("#app");
//# sourceMappingURL=main.js.map