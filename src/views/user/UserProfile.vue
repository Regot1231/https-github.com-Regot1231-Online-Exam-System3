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

const rules = {
  name: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  gender: [
    { required: true, message: '请输入用户性别', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  mobilephone: [
    { required: true, message: '请输入用户电话号码', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  jobnumber: [
    { required: true, message: '请输入用户工号', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  academy: [
    { required: true, message: '请输入用户学院', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  subject: [
    { required: true, message: '请输入用户授课学科', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
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
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-input v-model="userInfo.gender"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobilephone">
            <el-input v-model="userInfo.mobilephone"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="jobnumber">
            <el-input v-model="userInfo.jobnumber"></el-input>
          </el-form-item>
          <el-form-item label="学院" prop="academy">
            <el-input v-model="userInfo.academy"></el-input>
          </el-form-item>
          <el-form-item label="所授科目" prop="subject">
            <el-input v-model="userInfo.subject"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>