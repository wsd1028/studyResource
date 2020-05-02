<template>
  <div class="cw myStyle" id="app" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import "babel-polyfill";
import { Component, Vue } from "vue-property-decorator";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Show2d from "./app/components/Hunan/Show2d.vue";
import RackKey from "./app/components/RackKey.vue";
import ShapeManager from "./app/components/ShapeManager.vue";
import RackDetail from "./app/components/RackDetail.vue";
import Edit2d from "./app/components/Hunan/Edit2d.vue";
// import TestDemo from "./app/components/TestDemo.vue";

Vue.use(VueRouter);
Vue.use(ElementUI);
@Component({
  components: {
    Show2d,
    RackKey,
    ShapeManager,
    RackDetail,
    Edit2d
    // TestDemo
  }
})
export default class App extends Vue {
  protected loading = false; //加载数据时锁屏
  mounted() {}
}
</script>

<style>
.myStyle{
  padding: 0 10px;
}
</style>
