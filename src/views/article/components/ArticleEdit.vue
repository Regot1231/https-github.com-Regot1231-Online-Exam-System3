<script setup>
import { ref, defineExpose, defineEmits, } from 'vue'
import ChannelSelect from './ChannelSelect.vue';//把下拉框配置成一个组件
import { Plus } from '@element-plus/icons-vue'
import { artPublishService, artGetDetailService, artEditService, getPaperService } from '@/api/article';
import { ElMessage } from 'element-plus';

const visibleDrawer = ref(false)

const emit = defineEmits(['success'])

const defaultForm = {
  title: '',
  catename: '沸点工作室',
  subject: '高等代数',
  content: ''
}
const formModel = ref({
  ...defaultForm
})
const sid = ref()
const onPublish = async () => {
  formModel.value.sid = sid.value
  if (formModel.value.id) {
    await artEditService(formModel.value)
    ElMessage({ type: 'success', message: '编辑成功' })
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await artPublishService(formModel.value)
    ElMessage({ type: 'success', message: '添加成功' })
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

const formRef = ref()
const editorRef = ref()

// 判断是编辑还是修改
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    console.log('编辑回显');
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
  } else {
    formModel.value = { ...defaultForm }
  }
}
const dialogVisible = ref(false)
const bigcontent = ref([])
// 点击选题按钮弹出对话框 
const openDialog = async () => {
  dialogVisible.value = true
  const res = await getPaperService(formModel.value.subject)
  bigcontent.value = res.data.data
}
// 定义选择的问题的id
const selectedQuestionIds = ref([])


defineExpose({
  open
})


// 确认提交的问题的id
const submit = () => {
  if (selectedQuestionIds.value.length > 0) {
    // 处理选中的题目ID，例如提交到服务器或其他逻辑
    const selectedArray = bigcontent.value.map(item => 
        selectedQuestionIds.value.includes(item.id) ? item.id : null
      )
    sid.value = selectedArray
    dialogVisible.value = false;
    ElMessage({ type: 'success', message: '提交成功' })
  } else {
    ElMessage({ type: 'warning', message: '至少选择一道题目' })
  }
}
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑试卷' : '添加试卷'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="试卷名称" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="试卷出处" prop="catename">
        <channel-select v-model="formModel.catename" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select v-model="formModel.subject" placeholder="选择科目">
          <el-option label="数学分析" value="数学分析" />
          <el-option label="高等代数" value="高等代数" />
          <el-option label="大学英语" value="大学英语" />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷题目" prop="content">
        <el-button type="primary" @click="openDialog">选择题目</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish" type="primary">发布</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

  <!-- 弹出选题对话框 -->
  <el-dialog title="选择题目" v-model="dialogVisible">
    <el-checkbox-group v-model="selectedQuestionIds">
      <el-checkbox v-for="item in bigcontent" :label="item.question" :value="item.id" :key="item.id"></el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </template>

  </el-dialog>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>