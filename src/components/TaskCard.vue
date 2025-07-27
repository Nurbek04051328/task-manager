<template>
  <q-card class="task-card" flat bordered :data-id="task.id">
    <q-card-section>
      <div class="text-h6">{{ task.title }}</div>
      <div class="text-caption text-grey">{{ task.description }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pt-none">
       <div class="row items-center justify-between">
           <q-badge :color="priorityColor" :label="task.priority" />
           <div class="text-caption text-grey">
               <q-icon name="event" class="q-mr-xs" />
               {{ task.dueDate }}
           </div>
       </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Task } from '@/types/Task';

const props = defineProps<{ task: Task }>();

// Muhimlik darajasiga qarab rang tanlash
const priorityColor = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'green';
    default: return 'grey';
  }
});
</script>
