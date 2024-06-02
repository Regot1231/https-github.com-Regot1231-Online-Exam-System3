<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref, watch, computed } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue';
import { artDelService, artGetListService, artGetFilterListService } from '@/api/article';
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessage } from 'element-plus';
import { ElTable, ElTableColumn, ElButton, ElDialog, ElDivider } from 'element-plus'
import { useUserStore } from '@/stores';
import { useRouter } from 'vue-router';
const router = useRouter()
const userStore = useUserStore()
const articleList = ref([])
const total = ref(0)
const params = ref({
  pagenum: 1,
  pagesize: 5,
  title: '',
  catename: '计算机2301'
})
const loading = ref(true)
// 获取试卷列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.data[0].total//将试卷总数存进去
  loading.value = false
}
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
const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
const onSearch = async () => {
  loading.value = true
  const res = await artGetFilterListService(params.value)  //??
  articleList.value = []
  articleList.value = res.data.data
  loading.value = false
}
const onReset = () => {
  params.value.pagenum = 1
  params.value.catename = ''
  params.value.title = ''
  getArticleList()
}
const articleEditRef = ref()
const onAddArticle = () => {
  console.log(userStore.user.subject);
  if (!userStore.user.subject) {
    ElMessage({
      type: 'warning',
      message: "请完善个人信息"
    })
    router.push("/user/profile")
  } else {
    articleEditRef.value.open({})
  }
}


const onSuccess = (type) => {
  if (type === 'add') {
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    console.log(lastPage);
    params.value.pagenum = lastPage
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
      <el-form-item label="班级" prop="catename" style="width:25%">
        <el-select v-model='params.catename' placeholder="请选择搜索班级">
          <el-option v-for="item in classAll" :key="item.id" :label="item.name" :value="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="试卷名称"  style="width:25%" clearable>
        <el-input placeholder="请输入搜索试卷名称" v-model="params.title" clearable></el-input>
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
      <el-table-column label="班级" prop="catename"></el-table-column>
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
    <el-pagination v-model:current-page="params.pagenum" v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 4, 5, 10]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <!-- 预览题目对话框 -->
    <el-dialog v-model="dialogVisible" title="预览题目" width="50%">
      <div v-for="(item, index) in dialogContent.value" :key="index">
        <p><strong>题目id:</strong> {{ item.id }}</p>
        <p><strong>题目类型:</strong> {{ item.type }}</p>
        <p><strong>题目:</strong> {{ item.question }}</p>
        <p><strong>答案:</strong> {{ item.answer }}</p>
        <p v-if="item.type === '单选'"><strong>错误答案1:</strong> {{ item.false1 }}</p>
        <p v-if="item.type === '单选'"><strong>错误答案2:</strong> {{ item.false2 }}</p>
        <p v-if="item.type === '单选'"><strong>错误答案3:</strong> {{ item.false3 }}</p>
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