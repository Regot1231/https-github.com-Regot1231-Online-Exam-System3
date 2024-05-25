<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref, watch, computed } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue';
import { artDelService, artGetListService, artGetFilterListService } from '@/api/article';
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage } from 'element-plus';
import { ElTable, ElTableColumn, ElButton, ElDialog, ElDivider } from 'element-plus'//??

const articleList = ref([])
const total = ref(0)
const params = ref({
  title: null,
  catename: null
})
const loading = ref(true)
// 获取试卷列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService()
  articleList.value = res.data.data
  total.value = res.data.data.total//将试卷总数存进去
  loading.value = false
}


getArticleList()


const dialogVisible = ref(false)
const dialogContent = ref([])
// 弹出题目预览
const handlePreview = (row) => {
  dialogContent.value = computed(() => {
      return row.content.filter(item => item !== null);
    });
  dialogVisible.value = true
  console.log(dialogContent.value);
}

const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除试卷
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确定删除该文章吗?', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await artDelService(row.id)
  ElMessage({ type: 'success', message: '删除成功' })
  getArticleList()
}

// 页数问题
// const onSizeChange = (size) => {
//   params.value.pagenum = 1
//   params.value.pagesize = size
//   getArticleList()
// }
// const onCurrentChange = (page) => {
//   params.value.pagenum = page
//   getArticleList()
// }
const onSearch = async () => {
  loading.value = true
  const res = await artGetFilterListService(params.value)
  articleList.value = []
  articleList.value = res.data.data
  loading.value = false
}
const onReset = () => {
  // params.value.pagenum = 1
  // params.value.catename = ''
  // params.value.state = ''
  getArticleList()
}
const articleEditRef = ref()
const onAddArticle = () => {
  articleEditRef.value.open({})
}


const onSuccess = (type) => {
  if (type === 'add') {
    // const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // params.value.pagenum = lastPage
  }
  getArticleList()
}

</script>

<template>
  <page-container title="试卷列表">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">添加试卷</el-button>
    </template>
    <!-- 试卷查询功能 -->
    <el-form inline>
      <el-form-item label="班级名称" style="width:25%">
        <channel-select v-model="params.catename" clearable></channel-select>
      </el-form-item>
      <el-form-item label="试卷名称" style="width:25%">
        <el-input v-model="params.title" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%">
      <el-table-column label="试卷名称" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="班级名称" prop="catename"></el-table-column>
      <el-table-column label="科目" prop="subject"></el-table-column>
      <el-table-column label="预览试卷题目">
        <template #default="{ row }">
          <el-button type="primary" @click="handlePreview(row)">预览题目</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditArticle(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteArticle(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页区域 -->
    <!-- <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" /> -->

    <!-- 预览题目对话框 -->
    <el-dialog v-model="dialogVisible" title="预览题目" width="50%">
      <div v-for="(item, index) in dialogContent.value" :key="index">
        <p><strong>题目id:</strong> {{ item.id }}</p>
        <p><strong>题目:</strong> {{ item.question }}</p>
        <p><strong>答案:</strong> {{ item.answer }}</p>
        <el-divider></el-divider>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">退出</el-button>
      </template>
    </el-dialog>
    <!-- 添加编辑的抽屉 -->
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>