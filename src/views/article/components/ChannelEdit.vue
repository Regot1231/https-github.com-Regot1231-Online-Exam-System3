<script setup>
import { addPapersService, editPapersService } from '@/api/article';
import { ref, defineExpose, defineEmits } from 'vue'
import { useUserStore } from '@/stores';
const userStore = useUserStore()
const dialogVisible = ref(false)
const open = async (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
const formModel = ref({
  subject: '',
  question: '',
  answer: '',
  false1: '',
  false2: '',
  false3: '',
  type: ''
})
const rules = {
  subject: [
    { required: true, message: '请选择题目学科', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请输入题目类型', trigger: 'blur' }
  ],
  question: [
    { required: true, message: '请输入题目问题', trigger: 'blur' }
  ],
  answer: [
    { required: true, message: '请输入题目答案', trigger: 'blur' }
  ],
}
const emit = defineEmits(['success'])
const formRef = ref()
const onSubmit = async () => {
  await formRef.value.validate()
  formModel.value.sid ? await editPapersService(formModel.value) : await addPapersService(formModel.value)
  ElMessage({
    type: 'success',
    message: formModel.value.id ? '编辑成功' : '添加成功'
  })
  emit('success')
  dialogVisible.value = false
}



defineExpose({
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑题目' : '添加题目'" width="30%">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="题目类型" prop="type">
        <el-select v-model="formModel.type" placeholder="选择题目类型">
          <el-option label="单选" value="单选" />
          <el-option label="填空" value="填空" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目学科" prop="subject">
        <el-select v-model="formModel.subject" placeholder="选择科目">
          <el-option v-for="item in userStore.user.subject" :label="item" :value="item" :key="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="题目问题" prop="question">
        <el-input v-model="formModel.question"></el-input>
      </el-form-item>
      <el-form-item label="答案" prop="answer">
        <el-input v-model="formModel.answer"></el-input>
      </el-form-item>
      <el-form-item label="错误答案1" prop="false1" v-if="formModel.type === '单选'">
        <el-input v-model="formModel.false1"></el-input>
      </el-form-item>
      <el-form-item label="错误答案2" prop="false2" v-if="formModel.type === '单选'">
        <el-input v-model="formModel.false2"></el-input>
      </el-form-item>
      <el-form-item label="错误答案3" prop="false3" v-if="formModel.type === '单选'">
        <el-input v-model="formModel.false3"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button @click="onSubmit" type="primary"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>