<template>
    <div class="f-header">
        <span class="logo">
            <!-- 小图标 -->
            <el-icon class="mr-1"><InfoFilled /></el-icon>
            练习编程
        </span>
        <!-- 折叠图标 -->
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <fold v-if="$store.state.asideWidth == '250px'"/>
            <Expand v-else/>
        </el-icon>
        <!-- 刷新图标 -->
        <el-tooltip
            effect="dark"
            content="刷新"
            placement="bottom"
        >
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <!-- 头部 右边 -->
        <div class="ml-auto flex items-center" style="margin-left: auto;">
            <el-tooltip
                effect="dark"
                content="全屏"
                placement="bottom"
            >
                <el-icon class="icon-btn" @click="toggle">
                    <full-screen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>
            <!-- 登录信息下拉菜单 -->
            <el-dropdown class="dropdown" @command="handleCommand">
                <el-button type="primary">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username}}
                    <!-- Dropdown List -->
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                    <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <!-- 修改密码组件 -->
    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>
</template>

<script setup>
    import FormDrawer from '~/components/FormDrawer.vue'
    import { logout } from "~/api/manager"
    import { showModal,toast } from "~/composables/util"
    import { useRepassword } from "~/composables/useManager"
    import { useRouter } from "vue-router"
    import { useStore } from "vuex"
    import { ArrowDown } from '@element-plus/icons-vue'
    import { useFullscreen } from '@vueuse/core'
    import { ref } from 'vue'
// 切换全屏
    const {
    // 是否全屏状态
    isFullscreen,
    // 切换全屏
    toggle
} = useFullscreen()

    // 修改密码
    const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm
} = useRepassword()
    
    const router = useRouter()
    const store = useStore()

    // 修改密码
    const showDrawer = ref(false)

    const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            openRePasswordForm()
            break;
    }
}

    function handleLogout(){
        showModal("是否要退出登录？").then(res=>{
            logout()
            .finally(()=>{
               
                store.dispatch("logout")
                // 跳转回登录页
                router.push("/login")
                // 提示退出登录成功
                toast("退出登录成功")
            })
        })
    }

    const handleClick = () => {
    // eslint-disable-next-line no-alert
    alert('button click')
    }

    // 刷新事件
    const handleRefresh = () => location.reload()
</script>

<style>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-00;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>