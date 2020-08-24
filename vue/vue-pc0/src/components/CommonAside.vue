<template>
  <el-menu
    :collapse="isCollapse"
    default-active="2"
    class="el-menu-vertical-demo"
    background-color="#001529"
    text-color="hsla(0, 0%, 100%, 0.7)"
    active-text-color="#409EFF"
    :unique-opened="true"
  >
    <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path" @click="clickMenu(item)">
      <i :class="/^iconfont/.test(item.icon) ? `iconfont ${item.icon}` : `el-icon-${item.icon}`"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
    <el-submenu :index="index + ''" v-for="(item, index) in hasChildren" :key="index">
      <template slot="title">
        <i :class="/^iconfont/.test(item.icon) ? `iconfont ${item.icon}` : `el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item :index="subItem.path" v-for="(subItem, subIndex) in item.children" :key="subIndex" @click="clickMenu(subItem)">
          <i :class="/^iconfont/.test(subItem.icon) ? `iconfont ${subItem.icon}` : `el-icon-${subItem.icon}`"></i>
          <span slot="title">{{ subItem.label }}</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  computed: {
    noChildren() {
      return this.menu.filter(item => !item.children)
    },
    hasChildren() {
      return this.menu.filter(item => item.children)
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    },
    menu() {
      return this.$store.state.tab.menu
    }
  },
  data() {
    return {}
  },
  methods: {
    clickMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    }
  }
}
</script>

<style lang="less" scoped>
i {
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  color: #909399;
}
</style>

<style lang="less">
.el-menu {
  border: none;
  h3 {
    color: #ffffff;
    text-align: center;
    line-height: 48px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  min-height: 400px;
}
</style>
