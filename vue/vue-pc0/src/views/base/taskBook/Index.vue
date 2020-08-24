<template>
  <div class="container">
    <header>
      <el-menu default-active="question" class="header" mode="horizontal" @select="routeName = $event">
        <el-menu-item index="question">问题上报</el-menu-item>
        <el-menu-item index="task">督办派单</el-menu-item>
        <el-menu-item index="commandCheck">指派点检</el-menu-item>
      </el-menu>
    </header>
    <div class="body">
      <question-mod v-if="routeName == 'question'"></question-mod>
      <task-mod v-if="routeName == 'task'"></task-mod>
      <command-check-mod v-if="routeName == 'commandCheck'"></command-check-mod>
    </div>
  </div>
</template>

<script>
import questionMod from '../question/Index'
import taskMod from '../task/Index'
import commandCheckMod from '../commandCheck/Index'
export default {
  name: 'taskBook',
  data() {
    return {
      routeName: 'question'
    }
  },
  components: {
    questionMod,
    taskMod,
    commandCheckMod
  }
}
</script>

<style lang="less" scoped>
@import './style/Index.less';
</style>
