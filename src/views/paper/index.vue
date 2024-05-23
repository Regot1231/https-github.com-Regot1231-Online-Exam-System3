<script setup>
import { studentGetListService, studentPostPaperService, } from '@/api/article'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
const dialog = ref()
const studentAnswers = reactive([])//定义学生做的答案
const dotime = ref(0)//定义学生做的时间
let timer = null
const grade = ref()
const channelList = ref([])
const rowChannelList = ref({})//定义一个每一行的数据
const subject = ref('数学分析')
// 使用 forEach 方法给每个对象添加 subject 属性
channelList.value.forEach(channel => {
  channel.subject = subject.value;
})
const loading = ref(false)
// 获取学生试卷信息
const getChannelList = async () => {
  loading.value = true
  const res = await studentGetListService(subject.value)
  channelList.value = res.data.data
  loading.value = false
}
getChannelList()
// 开始作答
const dialogVisible = ref(false)
const dopaper = (row) => {
  dialogVisible.value = true
  startTimer()
  rowChannelList.value = row
}
// 同时记录时间
const startTimer = () => {
  timer = setInterval(() => {
    dotime.value++;
  }, 1000);
}
const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
const onSubmit = async() => {
  stopTimer();
  rowChannelList.value.content = studentAnswers.map((answer, index) => ({
    id: rowChannelList.value.content[index].id,
    studentanswer: answer
  }));
  rowChannelList.value.dotime = dotime.value
  res = await studentPostPaperService(rowChannelList.value)
  rowChannelList.value.grade = res.data.data.grade  //是成绩
  ElMessage({
    type: 'success',
    message: "提交成功"
  })
  dialogVisible.value = false
};


onMounted(() => {
  getChannelList()
  rowChannelList.value.content.forEach(() => studentAnswers.push(''));
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>

<template>
  <page-container title="任务中心">
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"> </el-table-column>
      <el-table-column label="班级" prop="catename"></el-table-column>
      <el-table-column label="试卷名称" prop="title"></el-table-column>
      <el-table-column label="科目" prop="subject"></el-table-column>
      <el-table-column label="成绩" prop="grade"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="dopaper(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>




  <!-- 考试界面 -->
  <el-dialog v-model:visible="dialogVisible" title="题目" width="30%">
    <div v-for="(item, index) in rowChannelList.content" :key="item.id">
      <p>{{ item.question }}</p>
      <el-input v-model="studentAnswers[index]" placeholder="请输入答案"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">退出考试</el-button>
        <el-button @click="onSubmit" type="primary">提交</el-button>
      </span>
    </template>
  </el-dialog>

</template>