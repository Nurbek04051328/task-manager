<template>
  <q-dialog :model-value="show" @update:model-value="$emit('close')" persistent>
    <q-card style="width: 500px; max-width: 90vw;">
      <q-form @submit.prevent="handleSubmit">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Edit Task' : 'New Task' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.title"
            label="Title"
            filled
            :rules="[val => !!val || 'Title is required']"
            lazy-rules
          />
          <q-input
            v-model="form.description"
            label="Description"
            type="textarea"
            filled
            class="q-mt-md"
          />
          <q-input
            v-model="form.dueDate"
            label="Due Date"
            type="date"
            filled
            class="q-mt-md"
            :rules="[val => !!val || 'Due date is required']"
            lazy-rules
          />
          <q-select
            v-model="form.priority"
            :options="['low', 'medium', 'high']"
            label="Priority"
            filled
            class="q-mt-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="primary" @click="$emit('close')" />
          <q-btn
            type="submit"
            :label="form.id ? 'Update' : 'Add'"
            color="primary"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useTaskStore } from '@/stores/task';
import type { Task, Priority } from '@/types/Task';;

const props = defineProps<{
  task?: Task
  show: boolean
}>()
const emit = defineEmits(['close']);

const $q = useQuasar();
const taskStore = useTaskStore();

// Formani boshlang'ich holati
const getDefaultForm = (): Omit<Task, 'id' | 'userId'> & { id?: string } => ({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  tags: [],
  status: 'todo',
});

const form = ref(getDefaultForm());

// Prop o'zgarganda formani to'ldirish
watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = { ...newTask };
  } else {
    form.value = getDefaultForm();
  }
}, { immediate: true, deep: true });

// Formani yuborish
const handleSubmit = () => {
  if (form.value.id) {
    // Tahrirlash
    taskStore.updateTask(form.value as Task);
    $q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'cloud_done',
        message: 'Task updated successfully'
    });
  } else {
    // Qo'shish
    const { ...taskData } = form.value;
    taskStore.addTask(taskData);
    $q.notify({
        color: 'positive',
        message: 'Task added successfully',
        icon: 'check'
    });
  }
  emit('close');
};
</script>
