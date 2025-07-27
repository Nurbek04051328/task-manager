import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { Task } from '@/types/Task'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>(loadFromStorage('tasks') || [])
  const currentUserId = ref('user123') // demo

  const userTasks = computed(() =>
    tasks.value.filter((task) => task.userId === currentUserId.value)
  )

  const addTask = (task: Task) => {
    tasks.value.push(task)
  }

  const updateTask = (updated: Task) => {
    const idx = tasks.value.findIndex((t) => t.id === updated.id)
    if (idx !== -1) tasks.value[idx] = updated
  }

  const deleteTask = (id: string) => {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  const moveTask = (id: string, newStatus: Task['status']) => {
    const task = tasks.value.find((t) => t.id === id)
    if (task) task.status = newStatus
  }

  watch(tasks, () => {
    saveToStorage('tasks', tasks.value)
  }, { deep: true })

  return {
    tasks,
    userTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    currentUserId
  }
})
