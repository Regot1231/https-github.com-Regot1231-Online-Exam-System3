<script setup>
import { getPaperAllService } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import ChannelEdit from './components/ChannelEdit.vue'
const dialog = ref()
const channelList = ref([])
const loading = ref(false)

const getChannelList = async () => {
  loading.value = true 
  const res = await getPaperAllService()
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
const onAddChannel = () => {
  dialog.value.open({})
}
const onEditChannel = (row) => {
  console.log(row);
  dialog.value.open(row)
}
// const onDelChannel = async (row) => {
//   await ElMessageBox.confirm('你确定删除该分类信息吗?', '温馨提示', {
//     type: 'warning',
//     confirmButtonText: '确认',
//     cancelButtonText: '取消'
//   })
//   await artDelChannelService(row.id)
//   ElMessage({ type: 'success', message: '删除成功'})
//   getChannelList()
// }
const onSuccess = () => {
  getChannelList()
}



</script>

<template>
  <page-container title="题目创编">
    <template #extra>
      <el-button @click="onAddChannel" type="primary"> 添加题目 </el-button>
    </template>

    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="科目"  prop="subject"></el-table-column>
      <el-table-column label="问题" prop="question"></el-table-column>
      <el-table-column label="类型" prop="type"></el-table-column>
      <el-table-column label="答案" prop="answer"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditChannel(row)"></el-button>
          <!-- <el-button :icon="Delete" circle plain type="danger" @click="onDelChannel(row)"></el-button> -->
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <channel-edit ref="dialog" @success="onSuccess"></channel-edit>
  </page-container>
</template>