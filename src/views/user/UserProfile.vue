<script setup>
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import PageContainer from '@/components/PageContainer.vue'
import { userUpdateInfoService } from '@/api/user'
import { ElMessage } from 'element-plus'
const formRef = ref()
const {
  user: { username, name, gender, mobilephone, jobnumber, academy, subject },
  getUser
} = useUserStore()

const userInfo = ref({ username, name, gender, mobilephone, jobnumber, academy, subject })
// 校验规则
const rules = {
  name: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '姓名必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  gender: [
    { required: true, message: '请输入用户性别', trigger: 'blur' },
  ],
  mobilephone: [
    { required: true, message: '请输入用户电话号码', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '电话号码必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  jobnumber: [
    { required: true, message: '请输入用户工号或学号', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '工号或学号必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  academy: [
    { required: true, message: '请输入用户学院', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '学院必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  subject: [
    { required: true, message: '请输入用户授课学科或所选课程', trigger: 'blur' },
  ]
}

const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    await userUpdateInfoService(userInfo.value)
    await getUser()
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
          <el-form-item label="课程" prop="subject">
            <el-select v-model='userInfo.subject' placeholder="请选择您所授课程或所选课程" clearable>
              <el-option label="数学分析" value="数学分析" />
              <el-option label="高等代数" value="高等代数" />
              <el-option label="大学英语" value="大学英语" />
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