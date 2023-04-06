<template>
    <!-- 公告栏 -->
    <el-card shadow="never" class="border-0">
        <!-- 搜索框 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3">
            <el-row :gutter="20">
                <el-clo :span="8" offset="0">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
                    </el-form-item>
                </el-clo>
                <el-clo :span="8" offset="8">
                    <el-form-item>
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </el-form-item>
                </el-clo>
            </el-row>
        </el-form>

        <!-- 新增，刷新按钮 -->
        <div class="flex items-center justify-between mb-4">
            <el-button @click="handleCreate">新增</el-button>
            <el-tooltip effect="dark" content="刷新数据" placement="top">
                <el-button text @click="getData">
                    <!-- 刷新按钮 -->
                    <el-icon :size="20">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </div>
        <!-- 表格布局 -->
        <div>
            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column label="管理员" width="200">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <!-- 图标 -->
                            <el-avatar :size="40" :src="row.avatar">
                                <img
                                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                                />
                            </el-avatar>
                            <div class="ml-3">
                                <h6>{{ row.username }}</h6>
                                <small>ID:{{ row.id }}</small>
                            </div>
                        </div>
                    </template>
                </el-table-column>>
                <el-table-column label="所属管理员" align="center">
                    <template #default="{ row }">
                        {{ row.role?.name || "-" }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template #default="{ row }">
                        <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0" 
                        :loading="row.statusLoading" :disabled="row.super == 1"  @change="handleStatusChange($event,row)"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <!-- 操作按钮 -->
                    <template #default="scope">
                        <el-button size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                        <!-- 删除提示 -->
                        <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>>
            </el-table>
        </div>
        <!-- 页码布局 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total"  :current-page="currentPage" :page-size="limit"
        @current-change="getData"/>
        </div>

        <!-- 新增弹窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="" ></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    {{ form.avatar }}
                    <ChooseImage v-model="form.avatar"/>
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="选择所属角色">
                        <el-option v-for="item in roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import { 
    getManagerList,
    updateManagerStatus,
    updateManager,
    createManager,
    deleteManager
} from "~/api/manager"

import FormDrawer from '~/components/FormDrawer.vue'
import { toast } from '~/composables/util'
import ChooseImage from '~/components/ChooseImage.vue'


// 引入定义的公共方法
import { useInitTable,useInitForm } from '../../composables/useCommon';
const roles = ref([])

const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange
} = useInitTable({
  searchForm:{
    keyword:""
  },
  getList:getManagerList,  //不同接口获取数据
  onGetListSuccess:(res)=>{
    tableData.value = res.list.map(o => {
        o.statusLoading = false
        return o
    })
    total.value = res.totalCount
    roles.value = res.roles
  },
  delete:deleteManager,
  updateStatus:updateManagerStatus
})

const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit
} = useInitForm({
  form:{
      username: "",
      password: "",
      role_id: null,
      status: 1,
      avatar: ""
  },
  getData,
  update:updateManager,
  create:createManager
})

</script>