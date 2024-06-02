<script setup>
import { ref, defineExpose, defineEmits, watch } from 'vue'
import ChannelSelect from './ChannelSelect.vue';//把下拉框配置成一个组件
import { Plus } from '@element-plus/icons-vue'
import { artPublishService, artGetDetailService, artEditService, getPaperService } from '@/api/article';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores';
const userStore = useUserStore()
const visibleDrawer = ref(false)

const emit = defineEmits(['success'])

const defaultForm = {
  title: '',
  catename: '',
  subject: '',
  content: '',
  sugtime: ''
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
const classAll = ref([
  { id: 1, name: "计算机2301" },
  { id: 2, name: "计算机2302" },
  { id: 3, name: "计算机2303" },
  { id: 4, name: "计算机2304" },
  { id: 5, name: "计算机2305" },
  { id: 6, name: "计算机2306" },
  { id: 7, name: "计算机2307" },
  { id: 8, name: "计算机2308" },
  { id: 9, name: "生信2301" },
  { id: 10, name: "生信2302" },
  { id: 11, name: "信科2301" },
  { id: 12, name: "信科2302" },
  { id: 13, name: "信科2303" }
]
)
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
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
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

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const rules = ref({
  sugtime: [
    { required: true, message: '请选择建议完成时间', trigger: 'blur' }
  ]
})
const updateSugtime = () => {
  formModel.value.sugtime = `${hours.value * 3600 + minutes.value * 60 + seconds.value}`;//  !!双向绑定
}
watch(formModel, (newVal) => {
  const totalSeconds = newVal.sugtime;
  hours.value = Math.floor(totalSeconds / 3600);
  minutes.value = Math.floor((totalSeconds % 3600) / 60);
  seconds.value = totalSeconds % 60;
}, { deep: true });
</script>

<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑试卷' : '添加试卷'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="试卷名称" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="catename">
        <el-select v-model='formModel.catename' placeholder="请选择班级" clearable>
          <el-option v-for="item in classAll" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <!-- 建议完成时间 -->
      <el-form-item label="建议完成时间" prop="sugtime" :rules="rules">
        <div>
          <el-input-number v-model="hours" :min="0" :max="23" label="小时" placeholder="小时"
            @change="updateSugtime"></el-input-number>
          :
          <el-input-number v-model="minutes" :min="0" :max="59" label="分钟" placeholder="分钟"
            @change="updateSugtime"></el-input-number>
          :
          <el-input-number v-model="seconds" :min="0" :max="59" label="秒" placeholder="秒"
            @change="updateSugtime"></el-input-number>
        </div>
      </el-form-item>
      <el-form-item label="学科" prop="subject">
        <el-select v-model="formModel.subject" placeholder="选择科目">
          <el-option v-for="item in userStore.user.subject" :label="item" :value="item" :key="item" />
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