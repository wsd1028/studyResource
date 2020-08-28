<template>
  <project-info :prop-project-id="projectId" class="projectInfo"></project-info>
</template>

<script>
import projectInfo from '@/views/projectInfo/Index'
export default {
  name: 'projectDetails',
  props: {
    projectId: String
  },
  components: {
    projectInfo
  }
}
</script>

<style lang="less" scoped>
.projectInfo {
  margin: -60px -20px -30px;
}
</style>
