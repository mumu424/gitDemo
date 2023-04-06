<template>
    <el-container class="bg-white rounded" :style="{ height: (h + 'px') }">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
        <!-- <el-button type="warning" size="small" @click="handleOpenFormDrawer">测试</el-button> -->
      </el-header>
      <el-container>
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
        <ImageMain ref="ImageMainRef"/>
        <!-- <FormDrawer ref="FormDrawerRef">
            <el-form label-width="80px" :inline="false">
                <el-form-item label="分类名称" prop="name">
                    <el-input></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number :min="0" :max="1000"/>
                </el-form-item>
            </el-form>
        </FormDrawer>> -->
      </el-container>
    </el-container>
</template>
<script setup>
import { ref } from "vue";
import ImageAside from "~/components/ImageAside.vue"
import ImageMain from "~/components/ImageMain.vue"
// import FormDrawer from "~/components/FormDrawer.vue"


const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const ImageAsideRef = ref(null)
const handleOpenCreate = ()=>ImageAsideRef.value.handleCreate()

const ImageMainRef = ref(null)
const handleAsideChange = (image_class_id)=> ImageMainRef.value.loadData(image_class_id)

// const FormDrawerRef = ref(null)

const handleOpenUpload = ()=>ImageMainRef.value.openUploadFile()

// const handleOpenFormDrawer = ()=>FormDrawerRef.value.open()


</script>
<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>