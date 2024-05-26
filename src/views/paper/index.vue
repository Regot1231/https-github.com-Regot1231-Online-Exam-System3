<script setup>
import { studentGetListService, studentPostPaperService, } from '@/api/article'
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import { ElMessage } from 'element-plus';
const dialog = ref()
const dotime = ref(0)//定义学生做的时间
let timer = null
const grade = ref()
const channelList = ref([])
const rowChannelList = ref({})//定义一个每一行的数据
rowChannelList.value.studentAnswers = new Array(9).fill('')
console.log(rowChannelList.value.studentAnswers);
// 选择科目
const dialogVisibleSubject = ref(false);
const subjects = ref(['数学分析', '高等代数', '大学英语'])
const selectedSubject = ref()
const openPaperSubject = () => {
  dialogVisibleSubject.value = true;
}

const confirmSelection = () => {
  // 使用 forEach 方法给每个对象添加 subject 属性
  channelList.value.forEach(channel => {
  channel.subject = selectedSubject.value;
})
  dialogVisibleSubject.value = false;
  getChannelList()
}

const loading = ref(false)


// 获取学生试卷信息
const getChannelList = async () => {
  loading.value = true
  const res = await studentGetListService(selectedSubject.value)//??
  channelList.value = res.data.data
  loading.value = false
}

// 开始作答
const dialogVisible = ref(false)
// 定义过滤的行试卷信息
const filterRowChannelListContent = ref([])
const dopaper = (row) => {
  rowChannelList.value.studentAnswers = []
  dialogVisible.value = true
  startTimer()
  row.studentAnswers = rowChannelList.value.studentAnswers
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
  // 检查是否存在空字符串
  const b = rowChannelList.value.studentAnswers.filter(item => item !== '');
  if ( b.length !== filterRowChannelListContent.value.length ) {
    // 存在空字符串，阻止提交操作
    ElMessage({
      type: 'error',
      message: "答案不能为空"
    });
    return;
  }
  rowChannelList.value.content = b.map((answer, index) => ({
    id: filterRowChannelListContent.value[index].id,
    studentanswer: answer
  }));
  rowChannelList.value.dotime = dotime.value
  const res = await studentPostPaperService(rowChannelList.value)
  rowChannelList.value.grade = res.data.data.grade  //是成绩
  ElMessage({
    type: 'success',
    message: "提交成功"
  })
  getChannelList()
  dialogVisible.value = false
};




onBeforeUnmount(() => {
  stopTimer();
});




</script>

<template>
  <page-container title="任务中心">
    <template #extra>
      <el-button type="primary" @click="openPaperSubject">根据科目查试卷</el-button>
    </template>
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
      <el-input v-model="rowChannelList.studentAnswers[index]" placeholder="请输入答案"></el-input>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">退出考试</el-button>
        <el-button @click="onSubmit" type="primary">提交</el-button>
      </span>
    </template>
  </el-dialog>



  <!-- 选择科目界面 -->
  <el-dialog v-model="dialogVisibleSubject" title="选择科目">
    <el-radio-group v-model="selectedSubject">
      <el-radio v-for="subject in subjects" :key="subject" :label="subject">{{ subject }}</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisibleSubject = false">取消</el-button>
        <el-button type="primary" @click="confirmSelection">确定</el-button>
      </span>
    </template>
  </el-dialog>


</template>