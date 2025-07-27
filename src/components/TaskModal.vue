<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex justify-center items-center">
    <div class="bg-white p-6 rounded w-[400px]">
      <h2 class="text-lg font-bold mb-4">{{ task?.id ? 'Edit' : 'New' }} Task</h2>
      <form @submit.prevent="handleSubmit">
        <input v-model="form.title" placeholder="Title" class="input mb-2" required />
        <textarea v-model="form.description" placeholder="Description" class="input mb-2" />
        <input type="date" v-model="form.dueDate" class="input mb-2" required />
        <select v-model="form.priority" class="input mb-2">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input v-model="tagInput" placeholder="Add tag" class="input mb-2" @keyup.enter.prevent="addTag" />
        <div class="flex gap-1 mb-2">
          <span v-for="(tag, i) in form.tags" :key="i" class="bg-blue-200 px-2 py-0.5 rounded">
            {{ tag }}
            <button @click.prevent="form.tags.splice(i, 1)">x</button>
          </span>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="emit('close')">Cancel</button>
          <button type="submit">{{ task?.id ? 'Update' : 'Add' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Task } from '@/types/Task'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{ task?: Task, show: boolean }>()
const emit = defineEmits(['save', 'close'])

const form = ref<Task>({
  id: '',
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  tags: [],
  status: 'todo',
  userId: 'user123'
})

watch(() => props.task, () => {
  if (props.task) form.value = { ...props.task }
  else form.value = { ...form.value, id: '', title: '', description: '', tags: [], status: 'todo' }
}, { immediate: true })

const tagInput = ref('')
const addTag = () => {
  if (tagInput.value) {
    form.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const handleSubmit = () => {
  if (!form.value.id) form.value.id = uuidv4()
  emit('save', { ...form.value })
  emit('close')
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded;
}
</style>
