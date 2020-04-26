<template>
  <div class="cw" id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import "babel-polyfill";
import { Component, Vue } from "vue-property-decorator";
import VueRouter from "vue-router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Linq from "linq";
import Ajax from "axios";
import { Config } from "./app/core/config";
import { Util } from "./app/core/util";

Vue.use(VueRouter);
Vue.use(ElementUI);
@Component({
  components: {}
})
export default class App extends Vue {}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

html,
body {
  height: 100%;
  box-sizing: border-box;
}
*::-webkit-scrollbar-thumb {
      background-color: #999;
      border-radius: 10px;
    }

*::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

*::-webkit-scrollbar-track {
      background-color: transparent;
    }
.cw {
  height: 100%;

}
#app > div {
  background-color: #f5f5f5;
  background-color: red;
  padding: 20px;
  padding-bottom: 0;
  height: 100%;
}

section{
  border-radius: 4px;
}

</style>
