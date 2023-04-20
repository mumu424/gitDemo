<template>
    <el-card>
        <!-- 新增，刷新 -->
        <!-- <ListHeader @create="handleCreate" @refresh="getData"/> -->
        <!-- 批量删除，需要先在listHeader里面增加批量删除按钮 --> 
        <ListHeader layout="create,delete,refresh" @create="handleCreate" @refresh="getData" @delete="handleMultiDelete"/>
        <!-- 表格布局 -->
        <el-table ref="multipleTableRef" :data="tableData" @selection-change="handleSelectionChang">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="规格名称"></el-table-column>
            <el-table-column prop="default" label="规格值" width="380"></el-table-column>
            <el-table-column prop="status" label="状态" width="120">
                <template #default="{row}">
                    <el-switch
                        :modelValue="row.status"
                        :active-value="1"
                        :inactive-value="0"
                        @change="handleStatusChange($event,row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template #default="{row}">
                    <el-button text size="small" @click="handleEdit(row)">修改</el-button>
                    <el-button text size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 页码布局 -->
        <div class="flex items-center justify-center mt-5">
            <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-page="currentPage"
                :page-size="limit"
                @current-change="getData"
            />
        </div>

        <!-- 弹窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="规格名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="1" :max="50" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <el-input v-model="form.default" placeholder="规格值"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<script setup>
import ListHeader from "~/components/ListHeader.vue"
import { reactive, ref, computed } from "vue"
import {
    getSkusList,
    createSkus,
    updateSkus,
    deleteSkus
} from "~/api/skus"
import FormDrawer from "~/components/FormDrawer.vue"
import { toast } from "~/composables/util.js"

// 定义页码布局参数
const currentPage = ref(1)
const limit = ref(10)
const total = ref(0)
const formRef = ref(null)
// 定义form表单参数
const form = reactive({
    name: "",
    order: 50,
    default: "",
    status: 1,
})
// 一进入页面，获取数据
const tableData = ref([])
function getData(){
    getSkusList(currentPage.value).then(res => {
        tableData.value = res.list
        console.log(res.list)
    })
}
getData()



// ref(0)创建了一个名为editId的响应式引用类型的变量，初始值为0。可以使用.value属性读取或修改其值。
const editId = ref(0)

// 判断是新增还是修改，设定弹窗显示内容
function fun() {
    if(editId.value == "修改"){
        return updateSkus(editId.value,form)
    }else{
        return createSkus(form)
        .then((res)=>{
            toast(drawerTitle.value + "成功")
            getData(editId.value ? false : 1) 
            formDrawerRef.value.close()
        })
    }
}

const drawerTitle = computed(()=>editId.value ? "修改" : "新增")

// 定义弹窗规则
const rules = reactive({
    name: [
        { required: true, message: "请输入规格名称", trigger: "blur" },
        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
    ],
    default: [
        { required: true, message: "请输入规格值", trigger: "blur" },
        { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" },
    ],
})
// 重置表单
function resetForm(row=false){
    if(formRef.value) 
        formRef.value.clearValidate()
    if(row){
        for(const key in form){
            form[key] = row[key]
            // console.log(row[key])
        }
    }
}
// 新增弹窗
const formDrawerRef = ref(null)
const handleCreate = ()=>{
    // 先重置表单，再打开弹窗
    resetForm()
    formDrawerRef.value.open()
}

// 点击提交按钮，提交信息
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (valid) {
            createSkus(form)
            .then(res => {
                // console.log("触发提交")
                // console.log(res)
                toast("新增成功")
                getData()
                formDrawerRef.value.close()
            })
            .finally(() => {
            })
        }
    })
}

// 点击修改按钮
const handleEdit = (row) => {
    console.log("触发修改")
    // 将修改行信息带出
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}

// 选择多行
const multiSelectionIds = ref([])   // 默认选中id为空数组
const handleSelectionChang = (e)=>{
    console.log("触发选择多行")
    // 打印/拿到选中行的id
    multiSelectionIds.value = e.map(o=>o.id)}
    


// 批量删除
const multipleTableRef = ref(null)
const handleMultiDelete = ()=>{
    console.log("触发批量删除")
    deleteSkus(multiSelectionIds.value)
    .then(res=>{
        toast("批量删除成功")
        // 删除成功之后,清空所选中的id,重新获取数据
        if(multipleTableRef.value){
            multipleTableRef.value.clearSelection()
        }
        getData()
    })
    .finally(()=>{
        multiSelectionIds.value = []
    })    
}
</script>>