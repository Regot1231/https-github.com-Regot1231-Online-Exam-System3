<script setup>
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { studentUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'
const formRef = ref()
const role = ref("student")
const {
  user: { username, name, gender, mobilephone, jobnumber, academy, class_name },
  getUser
} = useUserStore()
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
const userInfo = ref({ username, name, gender, mobilephone, jobnumber, academy, class_name })
// 校验规则
const rules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '姓名必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  jobnumber: [
    { required: true, message: '请输入您的工号或学号', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字的工号或学号', trigger: 'blur' }
  ],
  class_name: [
    { required: true, message: '请选择您的班级', trigger: 'blur' },
  ]
}

const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    userInfo.value.role = role.value
    await studentUpdateInfoService(userInfo.value)
    await getUser(role.value)
    ElMessage.success('修改成功')
  }
}
</script>

<template>
  <page-container title="基本资料">
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" ref="formRef" label-width="100px" size="large">
          <el-form-item label="用户名称">
            <el-input v-model="userInfo.username" disabled clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userInfo.name" placeholder="请输入您的姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model='userInfo.gender' placeholder="请选择您的性别" clearable>
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="mobilephone">
            <el-input v-model="userInfo.mobilephone" placeholder="请输入您的电话号码" clearable></el-input>
          </el-form-item>
          <el-form-item label="工号或学号" prop="jobnumber">
            <el-input v-model="userInfo.jobnumber" placeholder="请输入您的工号或学号" clearable></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="academy">
            <el-input v-model="userInfo.academy" placeholder="请输入您的学院" clearable></el-input>
          </el-form-item>
          <el-form-item label="班级" prop="class_name">
            <el-select v-model='userInfo.class_name' placeholder="请选择您的班级" clearable>
              <el-option v-for="item in classAll" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>

<style scoped>


</style>