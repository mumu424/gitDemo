<!-- 封装新增，刷新按钮 -->
<template>
    <div class="flex items-center justify-between mb-4">
            <el-button @click="$emit('create')">新增</el-button>
            <el-tooltip effect="dark" content="刷新数据" placement="top">
                <el-button text @click="$emit('refresh')">
                    <!-- 刷新按钮 -->
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
</template>
<script setup>
import { computed } from 'vue';
const props = defineProps({
    layout:{
        type:String,
        default:"create,refresh"
    }
})


defineEmits(["create","refresh"])
</script>