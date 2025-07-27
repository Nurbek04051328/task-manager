<template>
  <div class="p-3 rounded shadow bg-white border">
    <h3 class="font-bold text-lg">{{ task.title }}</h3>
    <p class="text-sm text-gray-600">{{ task.description }}</p>
    <div class="flex justify-between items-center mt-2 text-xs">
      <span :class="priorityClass">{{ task.priority }}</span>
      <span>{{ task.dueDate }}</span>
    </div>
    <div class="mt-2 flex flex-wrap gap-1">
      <span v-for="tag in task.tags" :key="tag" class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">{{ tag }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Task } from '@/types/Task'
const props = defineProps<{ task: Task }>()

const priorityClass = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600'
}[props.task.priority]

</script>
