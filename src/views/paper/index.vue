<script setup>
import { studentGetListService, studentPostPaperService, } from '@/api/article'
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import { ElMessage } from 'element-plus';
const dialog = ref()
const studentAnswers = ref([])//定义学生做的答案
const dotime = ref(0)//定义学生做的时间
let timer = null
const grade = ref()
const channelList = ref([])
const rowChannelList = ref({})//定义一个每一行的数据
const subject = ref('高等代数')
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
// 定义过滤的行试卷信息
const filterRowChannelListContent = ref([])

const dopaper = (row) => {
  dialogVisible.value = true
  startTimer()
  rowChannelList.value = row
  filterRowChannelListContent.value = rowChannelList.value.content.filter(item => item !== null);
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

const onSubmit = async () => {
  stopTimer();
  rowChannelList.value.content = studentAnswers.value.map((answer, index) => ({
    id: filterRowChannelListContent.value[index].id,
    studentanswer: answer
  }));
  rowChannelList.value.dotime = dotime.value
  console.log(rowChannelList.value.content);
  ElMessage({
    type: 'warning',
    message: "确认题目提交完整"
  })
  const res = await studentPostPaperService(rowChannelList.value)
  rowChannelList.value.grade = res.data.data.grade  //是成绩
  ElMessage({
    type: 'success',
    message: "提交成功"
  })


  getChannelList()
  dialogVisible.value = false
};


onMounted(async () => {
  await getChannelList();
  await nextTick(); // 确保 DOM 更新完成
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
          <el-button type="primary" @click="dopaper(row)" v-if="!row.isExamStarted">开始考试</el-button>
          <el-button type="primary" @click="dopaper(row)" v-else>重考</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
  </page-container>




  <!-- 考试界面 -->
  <el-dialog v-model="dialogVisible" title="题目" width="30%" v-if="filterRowChannelListContent">
    <div v-for="(item, index) in filterRowChannelListContent" :key="item.id">
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