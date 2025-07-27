<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Task Board</h1>
      <button class="btn" @click="showModal = true">+ Add Task</button>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div v-for="status in statuses" :key="status" class="bg-gray-100 p-4 rounded">
        <h2 class="font-bold mb-2 capitalize">{{ status.replace('-', ' ') }}</h2>
        <draggable v-model="columns[status]" group="tasks" @end="onDragEnd">
          <template #item="{ element }">
            <TaskCard :task="element" class="mb-2" />
          </template>
        </draggable>
      </div>
    </div>

    <TaskModal :show="showModal" @close="showModal = false" @save="saveTask" />
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/store/task'
import TaskCard from '@/components/TaskCard.vue'
import TaskModal from '@/components/TaskModal.vue'
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { Task } from '@/types/Task'

const store = useTaskStore()
const showModal = ref(false)

const statuses = ['todo', 'in-progress', 'done']

const columns = ref<Record<string, Task[]>>({
  todo: [],
  'in-progress': [],
  done: []
})

const groupByStatus = () => {
  columns.value = {
    todo: [],
    'in-progress': [],
    done: []
  }
  store.userTasks.forEach((task) => {
    columns.value[task.status].push(task)
  })
}

watch(() => store.tasks, groupByStatus, { immediate: true })

const saveTask = (task: Task) => {
  const exists = store.tasks.find((t) => t.id === task.id)
  exists ? store.updateTask(task) : store.addTask(task)
  groupByStatus()
}

const onDragEnd = () => {
  statuses.forEach((status) => {
    columns.value[status].forEach((task) => {
      if (task.status !== status) {
        store.moveTask(task.id, status as Task['status'])
      }
    })
  })
}
</script>
