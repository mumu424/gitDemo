<template>
    <div class="f-menu" :style= "{ width:$store.state.asideWidth }" >
        <!-- 侧边栏样式修改 -->
        <el-menu
        :default-active="defaultActive"
        default-active="2"
        class="border-0"
        @select="handleSelect"
        :collapse="isCollapse"
        :collapse-transition="false"
        :unique-opened="true"
        >
        <!-- x循环菜单 -->
        <template v-for="(item,index) in asideMenus" :key="index">
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <el-menu-item v-for="(item2,index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span>
                    </el-menu-item>
                </el-sub-menu>

                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                         <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
        </template>  
      </el-menu>
    </div>
</template>
<script setup>
// onBeforeRouteUpdate,解决快捷方式与菜单的联动问题
import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const router = useRouter()
const store = useStore()
const route = useRoute()


// 默认选中路径
const defaultActive = ref(route.path)

// 监听路有变化
onBeforeRouteUpdate((to,from)=>{
    defaultActive.value = to.path
})

// 定义是否折叠
const isCollapse = computed(()=> !(store.state.asideWidth == '250px'))

const asideMenus = computed(() => store.state.menus)
// 选中菜单跳转至相应页面
const handleSelect = (e)=>{
    if(e == "video"){
        return window.open("https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585")
    }
    router.push(e)
}
</script>
<style>
    .f-menu {
        /* 折叠太慢，添加动画 */
    transition: all 0.2s;
    top: 64px;
    bottom: 0;
    left: 0;
    /* 防止折叠得时候闪一下的 问题 */
    overflow-y: auto;
    overflow-x: hidden;
    @apply shadow-md fixed bg-light-50;
}
/* 隐藏菜单滚动条 */
.f-menu::-webkit-scrollbar{
    width: 0px;
}
</style>