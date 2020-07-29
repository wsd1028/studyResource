<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
@import url('./assets/css/common.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
* {
  box-sizing: border-box;
  font-family: Microsoft YaHei;
}
span {
  display: inline-block;
}
html,
body {
  height: 100%;
}
table {
  border-collapse: collapse;
  width: 100%;
  border-color: #eee;
  line-height: 40px;
}

h2,
h3,
p {
  margin: 0;
  padding: 0;
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
