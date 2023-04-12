<template>
    <el-card>
        <!-- 新增刷新按钮 -->
        <div class="add-btn">
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
            <el-table :data="tableData">
                <el-table-column prop="name" label="角色名称" width="180" />
                <el-table-column prop="desc" label="角色描述" />
                <el-table-column label="状态">
                    <template #default="{ row }">
                        <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="handleStatusChange($event,row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button size="small" text @click="openSetRule(scope.row)">配置权限</el-button>
                        <el-button size="small" text @click="handleEdit(scope.row)">修改</el-button>
                        <!-- 删除提示 -->
                        <el-popconfirm title="是否要删除该记录？" confirmButtonText="确认" cancelButtonText="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">删除</el-button>
                        </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 配置权限弹窗 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" node-key="id" :check-strictly="checkStrictly" 
            :default-expanded-keys="defaultExpandedKeys" 
            :data="ruleList" :props="{ label:'name',children:'child' }"  show-checkbox :height="treeHeight"
            @check="handleTreeCheck">
                <template #default="{ node,data }">
                    <div class="flex items-center">
                    <el-tag :type="data.menu ? '' : 'info'" size="small">
                        {{ data.menu ? "菜单" : "权限" }}
                    </el-tag>
                    <span class="ml-2 text-sm"> {{ data.name }} </span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import { toSafeInteger } from 'lodash';
import { computed, reactive, ref } from 'vue';
import FormDrawer from '~/components/FormDrawer.vue'
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    setRoleRules
} from "~/api/role"
import {
  getRuleList
} from "~/api/rule"
import { toast } from '~/composables/util.js'

// 定义分页数据
const tableData = ref([])
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 状态管理
const value1= ref(true)

// 获取数据
function getData(p=null){
    if(typeof p == "number"){
        currentPage.value = p
    }
    getRoleList(currentPage.value)
    .then(res => {
        tableData.value = res.list
        console.log(res.list)
    })
}

getData()


// 修改状态
const handleStatusChange = (status,row) => {
    updateRoleStatus(row.id, status)
    .then(res => {
        // console.log(row.id)
        // console.log(status)
        // toast("修改状态成功")
        // 修改当前对象得状态为即将修改得状态
        row.status = status
    })
    .finally(() => {
    })
}


const dialogVisible = ref(false)
// 点击新增弹窗
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
    name:"",
    status:"1",
    desc:""
})

// ref(0)创建了一个名为editId的响应式引用类型的变量，初始值为0。可以使用.value属性读取或修改其值。
const editId = ref(0)

// 判断是新增还是修改，设定弹窗显示内容
function fun() {
    if(editId.value == "修改"){
        return updateRole(editId.value,form)
    }else{
        return createRole(form)
        .then((res)=>{
            toast(drawerTitle.value + "成功")
            getData(editId.value ? false : 1) 
            formDrawerRef.value.close()
        })
    }
}



// fun.then((res=>{
//     toast(drawerTitle.value + "成功")
//     // 修改成功，刷新当前页
//     getData(editId.value ? false : 1)
//     formDrawerRef.value.close()
// }))


const drawerTitle = computed(()=>editId.value ? "修改" : "新增")


const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            createRole(form)
            .then(res => {
                console.log("触发提交")
                console.log(res)
                toast("新增成功")
                getData()
                formDrawerRef.value.close()
            })
            .finally(() => {
            })
        }
    })
}

const handleCreate = ()=>{
    console.log("触发了新增弹窗")
    // 进入新增弹窗时，重置表单
    resetForm()
    formDrawerRef.value.open()

}



// 定义新增rules
const rules = reactive({
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    desc: [
        { required: true, message: '请输入角色描述', trigger: 'blur' },
        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ]
})
 // 重置表单方法,修改时保留原有信息
 function resetForm(row=false){
        if(formRef.value) 
            formRef.value.clearValidate()
        if(row){
            for(const key in form){
                form[key] = row[key]
                console.log(row[key])
            }
        }
    }

// 点击修改弹窗
const handleEdit = (row) => {
    console.log("触发了修改弹窗")
    // 获取原有行信息
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
// 当前角色拥有的权限ID
const ruleIds = ref([])
const checkStrictly = ref(false)

const openSetRule = (row)=>{
  roleId.value = row.id
  treeHeight.value = window.innerHeight - 180
  checkStrictly.value = true

  getRuleList(1).then(res=>{
    ruleList.value = res.list
    defaultExpandedKeys.value = res.list.map(o=>o.id)
    setRuleFormDrawerRef.value.open()

    // 当前角色拥有的权限ID
    ruleIds.value = row.rules.map(o=>o.id)
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value)
      checkStrictly.value = false
    }, 150);
  })
}

const handleSetRuleSubmit = ()=>{
  setRuleFormDrawerRef.value.showLoading()
  setRoleRules(roleId.value,ruleIds.value)
  .then(res=>{
    toast("配置成功")
    getData()
    setRuleFormDrawerRef.value.close()
  })
  .finally(()=>{
    setRuleFormDrawerRef.value.hideLoading()
  })
}

const handleTreeCheck = (...e)=>{
  const { checkedKeys,halfCheckedKeys } = e[1]
  ruleIds.value = [...checkedKeys,...halfCheckedKeys]
}

// 删除按钮
const handleDelete = (id)=>{
    console.log("触发了删除")
    deleteRole(id)
    .then(res => {
        toast("删除成功")
        getData()
    })
    .finally(() => {
    })
}
</script>
<style>
.add-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
</style>