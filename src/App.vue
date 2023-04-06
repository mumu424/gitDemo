<script setup>
</script>

<template>
  <!-- 引用路由组件 -->
  <router-view></router-view>
</template>

<style>
/* 背景颜色设置为浅灰色 */
body{
  @apply bg-gray-100;
}
#nprogress .bar{
  background-color: #f4f4f4!important;
  height: 3px!important;
}
</style>
