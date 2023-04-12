<template>
    <!-- 公告栏 -->
    <el-card shadow="never" class="border-0">
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
                <el-table-column prop="title" label="公告标题" width="180" />
                <el-table-column prop="create_time" label="发布时间" width="380" />
                <el-table-column label="操作" width="180" align="center">
                    <!-- 操作按钮 -->
                    <template #default="scope">
                        <el-button size="small" text @click="handleEdit(scope.row)">编辑</el-button>
                        <!-- 删除提示 -->
                        <el-popconfirm title="是否要删除该公告？" confirmButtonText="确认" cancelButtonText="取消"
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
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="公告内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import {
  getNoticeList,
  createNotice,
  updateNotice,
  deleteNotice
} from "~/api/notice"

import FormDrawer from '~/components/FormDrawer.vue'
import { toast } from '~/composables/util'


// 分页相关信息
const loading = ref(false)  //加载
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)


// 获取数据
function getData(p = null){
    if(typeof p == "number"){
        currentPage.value = p
    }

    loading.value = true
    getNoticeList(currentPage.value)
    .then(res=>{
        // list赋值给tableData
        tableData.value = res.list
        // totalCount赋值给total
        total.value = res.totalCount
    })
    .finally(()=>{
        loading.value = false
    })
}

// 定义tableData 
const tableData = ref([])
    // function getdata(){
    //     tableData.value = [
    //     {
    //         "id": 13, 
            
    //         "title": "nip", 
            
    //         "content": "nip\n", 
            
    //         "order": 0, 
            
    //         "create_time": "2022-06-06 14:40:11", 
            
    //         "update_time": "2022-06-06 14:40:11" 
 
    //     }
    //     ]
    // }

    getData()
    // 删除方法
    const handleDelete = (id)=>{
        loading.value = true
        deleteNotice(id).then(res=>{
            toast("删除成功")
            getData()
        })
        .finally((res=>{
            loading.value = false
        }))
    }

    // 重置表单方法,修改时保留原有信息
    function resetForm(row=false){
        if(formRef.value) formRef.value.clearValidate()
        if(row){
            for(const key in form){
                form[key] = row[key]
            }
        }
    }

    const editId = ref(0)
    // 判断是新增还是修改，设定弹窗显示内容
    const drawerTitle = computed(()=>editId.value ? "修改" : "新增")

    // 新增弹窗
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const form = reactive({
        titel:"",
        content:""
    })

    
    const handleSubmit = ()=>{
        formRef.value.validate((valid)=>{
            if(!valid) return

            formDrawerRef.value.showLoading()
            createNotice(form).then((res)=>{
                toast("新增成功")
                getData(1)  // 新增成功刷新数据
                formDrawerRef.value.close()
            })
            .finally(()=>{
                formDrawerRef.value.hideLoading()
            })
        })
    }

    // 新增表单方法
    const handleCreate = ()=>{
        // 新增表单id设定为0
        editId.value = 0
        resetForm({
            titel:"",
            content:""
        })
        formDrawerRef.value.open()

    }
// 表单验证规则
    rules: {
        title: [{
            required: true,
            message: '公告标题不能为空',
            trigger: 'blur'
        }]
        content: [{
            required: true,
            message: '公告内容不能为空',
            trigger: 'blur'
        }]
    }

     // 编辑方法
     const handleEdit = (row)=>{
        editId.value = row.id
            // 修改，传值当前对象
        resetForm(row)
        formDrawerRef.value.open()
     }
        

</script>