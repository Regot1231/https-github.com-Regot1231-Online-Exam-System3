<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
const dialog = ref()
const channelList = ref([])
const loading = ref(false)

const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()

</script>

<template>
  <page-container title="试卷列表">
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="班级" prop="catename"></el-table-column>
      <el-table-column label="姓名" prop="studentname"></el-table-column>
      <el-table-column label="考试时间" prop="dotime"></el-table-column>
      <el-table-column label="成绩" prop="grade"></el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>
</template>