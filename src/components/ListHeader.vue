<!-- 封装新增，刷新按钮 -->
<template>
    <div class="flex items-center justify-between mb-4">
            <div>
                <el-button @click="$emit('create')">新增</el-button>
                <!-- 增加批量删除按钮 -->
                <el-popconfirm v-if="btns.includes('delete')" title="是否要删除选中记录？" confirmButtonText="确认" cancelButtonText="取消" @confirm="$emit('delete')">
                    <template #reference>
                        <el-button type="danger" size="small">批量删除</el-button>
                    </template>
                </el-popconfirm>
            </div>
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

const btns = computed(()=>props.layout.split(","))

defineEmits(["create","refresh","delete"])
</script>
