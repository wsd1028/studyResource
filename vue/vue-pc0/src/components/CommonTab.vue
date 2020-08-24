<template>
  <div class="tabs">
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      size="medium"
      :closable="tag.name !== 'home'"
      :disable-transitions="false"
      @close="handleClose(tag, tags, currentMenu)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      style="position:relative"
    >
      <el-tooltip placement="bottom" effect="light">
        <div slot="content">
          <div class="menu" @click="handleFlushPage(tag)">
            <i class="icon el-icon-refresh"></i>
            <span>刷新</span>
          </div>
        </div>
        <span>
          <i class="el-icon-star-on"></i>
          {{ tag.label }}
        </span>
      </el-tooltip>
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState({
      tags: state => state.tab.tabsList,
      currentMenu: state => state.tab.currentMenu
    })
  },
  data() {
    return {
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    ...mapMutations({
      close: 'closeTab'
    }),
    handleClose(tag, tags, currentMenu) {
      let result = tags.findIndex(item => item.name === tag.name)
      this.close(tag)
      let val
      if (result < tags.length) {
        val = tags[result]
      } else {
        val = tags[tags.length - 1]
      }
      if (currentMenu.name == tag.name) {
        this.$router.push({ name: val.name })
        this.$store.commit('selectMenu', val)
      }
    },
    changeMenu(item) {
      this.$router.push({ name: item.name })
      this.$store.commit('selectMenu', item)
    },
    // 刷新菜单
    handleFlushPage(tag) {
      this.$router.push({ name: tag.name, query: { key: this.uuid() } })
    }
  }
}
</script>

<style lang="less" scoped>
.tabs {
  background: #eef2fb80;
  padding: 5px;
  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }
}
.menu {
  padding: 4px 6px;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
}
</style>
