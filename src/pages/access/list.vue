<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增，刷新按钮 -->
        <!-- 父子组件传值，子组件定义create，refresh方法，使用$emit监听，子组件调用 -->
        <ListHeader @create="handleCreate" @refresh="getData"></ListHeader>
        <!-- 表格布局 -->
        <!-- 树形结构 -->
        <el-tree :data="tableData" :props="{label:'name',children:'child'}" v-loading="loading" 
        node-key="id" :default-expanded-keys="defaultExpandedKeys"
        >
            <template #default = "{node, data}">
                <div class="custom-tree-node">
                    <e-tag size="small" :type="data.menu ? '' : info">
                        {{ data.menu ? "菜单" : "权限"}}
                    </e-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <!-- 状态,操作按钮 -->
                    <div class="ml-auto" @click.stop>
                        <el-switch :modelValue="form.status" :active-value="1" :inactive-value="0" 
                         @change="handleStatusChange($event,data)"
                        >
                        </el-switch>
                        <!-- .stop阻止冒泡事件 -->
                        <el-button text type="primary" :size="small" @click.stop="handleEdit(data)">修改</el-button>
                        <el-button text type="primary" :size="small" @click.stop="addChild(data.id)">增加</el-button>
                        <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                            @confirm="handleDelete(data.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>>
        <!-- 菜单按钮 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination background layout="prev, pager, next" :total="total"  :current-page="currentPage" :page-size="limit"
        @current-change="getData"/>
        </div>

        <!-- 新增弹窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上级菜单" prop="role_id">
                    <el-cascader v-model="form.role_id" :options="options"
                    :props="{value:'id',label:'name',children:'child'}" checkStrictly: true 
                    emitPath: false
                    placeholder="请选择上级菜单"
                    />
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" size="large" border>菜单</el-radio>
                        <el-radio :label="0" size="large" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input  v-model="form.name" placeholder="名称" style="width: 30%;"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id >0">
                    <el-select v-model="form.frontpath" class="m-2" placeholder="请选择前端路由">
                        <el-option
                            v-for="item in form.frontpath"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value"
                            />
                    </el-select>
                </el-form-item>
                <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
                    <el-input placeholder="后端规则" ></el-input>
                </el-form-item>
                <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
                    <el-select v-model="form.method" class="m-2" placeholder="请选择请求方式">
                        <el-option
                        v-for="item in ['GET','POST','PUT','DELETE']"
                        :key="item"
                        :label="item"
                        :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"/>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import ListHeader from "~/components/ListHeader.vue";
import IconSelect from "~/components/IconSelect.vue";
import {
    getRuleList,
    createRule,
    updateRule,
    deleteRule,
    updateRuleStatus
} from "~/api/rule"

import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'


// 引入定义的公共方法
import { useInitTable,useInitForm } from '../../composables/useCommon';
const roles = ref([])
const defaultExpandedKeys = ref([])
 
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
  getList:getRuleList,  //不同接口获取数据
  delete: deleteRule,
  updateStatus:updateRuleStatus,
  onGetListSuccess:(res)=>{
    options.value = res.rules
    tableData.value = res.list
    defaultExpandedKeys.value = res.list.map(o=>o.id)
    }
  }
)

const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleCreate,
  handleEdit,
} = useInitForm({
  form:{
    rule_id: 0,
    menu: 0,
    name:"",
    condition:"",
    method:"GET",
    status:1,
    order:50,
    icon:"",
    frontpath:""
  },
  rules: {
    name: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    }],
  },
  getData,
  update:updateRule,
  create:createRule
})

// 权限管理
const options = ref([])

// 增加权限
const addChild =  (id)=>{
    handleCreate()  // 先重置，再打开
    form.rule_id = id
    form.status = 1
}
</script>
<style>
.custom-tree-node{
    flex:1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
}

.el-tree-node_content {
    padding: 20px 0;
}
</style>