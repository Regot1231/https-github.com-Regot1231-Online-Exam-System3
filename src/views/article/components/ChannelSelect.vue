<script setup>
  import { artGetChannelsService } from '@/api/article';
  import { ref, defineProps, defineEmits } from 'vue'
  defineProps({
    modelValue: {
      type: [Number, String]
    }
  })
  const emit = defineEmits(['update:modelValue'])
  const channelList = ref([
  {
    id: 48,
    studentname: "战使部为按如斯",
    catename: "张党解回放把格",
    dotime: 765278899416,
    grade: 60,
    status: 47
  }
])
  channelList.value.forEach(item => {
    item.catename = '高三二班'
  })
  const getChannelList = async () => {
    const res = await artGetChannelsService()
    channelList.value = res.data.data
  }
  getChannelList()
</script>

<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option v-for="channel in channelList" :key="channel.id" :label="channel.catename" :value="channel.catename"></el-option>
  </el-select>
</template>