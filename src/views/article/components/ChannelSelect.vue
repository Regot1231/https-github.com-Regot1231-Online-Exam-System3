<script setup>
  import { artGetChannelsService } from '@/api/article';
  import { ref, defineProps, defineEmits } from 'vue'
  defineProps({
    modelValue: {
      type: [Number, String]
    }
  })
  const emit = defineEmits(['update:modelValue'])
  const channelList = ref([])
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