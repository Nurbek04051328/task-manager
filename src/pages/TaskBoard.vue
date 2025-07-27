<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Task Board</h1>
      <q-btn
        color="primary"
        icon="add"
        label="Add Task"
        @click="openTaskModal()"
      />
    </div>

    <div class="row q-gutter-md q-mb-md">
      <q-select
        outlined
        dense
        v-model="taskStore.filterStatus"
        :options="['all', 'todo', 'in-progress', 'done']"
        label="Filter by Status"
        style="min-width: 150px;"
        @update:model-value="taskStore.setFilter"
      />
      <q-select
        outlined
        dense
        v-model="taskStore.sortBy"
        :options="['dueDate', 'priority']"
        label="Sort by"
        style="min-width: 150px;"
        @update:model-value="taskStore.setSortBy"
      />
    </div>


    <div class="row q-col-gutter-md">
      <div
        v-for="status in statuses"
        :key="status"
        class="col-12 col-md-4"
      >
        <q-card class="bg-grey-2 full-height">
          <q-card-section>
            <div class="text-h6 text-capitalize">{{ status.replace('-', ' ') }}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <draggable
              :list="columns[status]"
              group="tasks"
              @end="onDragEnd"
              item-key="id"
              class="min-h-200"
            >
              <template #item="{ element }">
                <TaskCard
                  :task="element"
                  class="q-mb-sm cursor-pointer"
                  @click="openTaskModal(element)"
                />
              </template>
            </draggable>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <TaskModal
      :show="showModal"
      :task="selectedTask"
      @close="showModal = false"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useTaskStore } from '../stores/task';
import TaskCard from '@/components/TaskCard.vue';
import TaskModal from '@/components/TaskModal.vue';
import draggable from 'vuedraggable';
import type { Task } from '../types/Task';

const taskStore = useTaskStore();
const showModal = ref(false);
const selectedTask = ref<Task | undefined>(undefined);

const statuses: Task['status'][] = ['todo', 'in-progress', 'done'];

// Vazifalarni statuslar bo'yicha guruhlash
const columns = computed(() => {
  const grouped: Record<Task['status'], Task[]> = {
    todo: [],
    'in-progress': [],
    done: [],
  };
  taskStore.filteredAndSortedTasks.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    }
  });
  return grouped;
});

// Drag & Drop tugaganda
const onDragEnd = (event: any) => {
  const { to, item } = event;
  const newStatus = to.closest('.q-card')?.querySelector('.text-h6')?.textContent?.toLowerCase().replace(' ', '-') as Task['status'];
  const taskId = item.getAttribute('data-id'); // TaskCard'da data-id qo'shish kerak

  if (newStatus && taskId) {
    const task = columns.value[newStatus].find(t => t.id === taskId);
    if(task && task.status !== newStatus) {
        taskStore.moveTask(taskId, newStatus);
    }
  }
};

// Modal oynani ochish (yangi yoki tahrirlash uchun)
const openTaskModal = (task?: Task) => {
  selectedTask.value = task;
  showModal.value = true;
};
</script>

<style scoped>
.min-h-200 {
  min-height: 200px;
}
</style>