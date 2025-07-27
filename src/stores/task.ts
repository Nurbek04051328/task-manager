// src/stores/task.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Task } from '@/types/Task';
import { loadFromStorage, saveToStorage } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid'; // ID generatsiyasi uchun

// Boshlang'ich ma'lumotlar (agar local storage bo'sh bo'lsa)
const initialTasks: Task[] = [
    { id: '1', title: 'Quasar loyihasini sozlash', description: 'Barcha kerakli paketlarni o\'rnatish', dueDate: '2024-07-29', priority: 'high', tags: ['setup', 'quasar'], status: 'done', userId: 'user123' },
    { id: '2', title: 'Pinia store yaratish', description: 'Vazifalar uchun store yaratish', dueDate: '2024-07-30', priority: 'high', tags: ['state', 'pinia'], status: 'in-progress', userId: 'user123' },
    { id: '3', title: 'TaskCard komponentini yaratish', description: 'Vazifalarni ko\'rsatish uchun karta', dueDate: '2024-08-01', priority: 'medium', tags: ['ui', 'components'], status: 'todo', userId: 'user123' }
];

export const useTaskStore = defineStore('task', () => {
    // Local storage'dan yuklash yoki boshlang'ich ma'lumotlarni olish
    const tasks = ref<Task[]>(loadFromStorage('tasks') || initialTasks);

    // Hozirgi foydalanuvchi (login tizimidan keyin dinamik bo'ladi)
    const currentUserId = ref('user123');
    const filterStatus = ref<Task['status'] | 'all'>('all');
    const sortBy = ref<'dueDate' | 'priority'>('dueDate');

    // Foydalanuvchining vazifalarini filterlash
    const userTasks = computed(() =>
        tasks.value.filter((task) => task.userId === currentUserId.value)
    );

    // Saralangan va filterlangan vazifalar
    const filteredAndSortedTasks = computed(() => {
        let result = [...userTasks.value];

        // Status bo'yicha filtrlash
        if (filterStatus.value !== 'all') {
            result = result.filter((task) => task.status === filterStatus.value);
        }

        // Saralash
        if (sortBy.value === 'dueDate') {
            result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        } else if (sortBy.value === 'priority') {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        }

        return result;
    });

    // Yangi vazifa qo'shish
    const addTask = (taskData: Omit<Task, 'id' | 'userId'>) => {
        const newTask: Task = {
            ...taskData,
            id: uuidv4(),
            userId: currentUserId.value
        };
        tasks.value.push(newTask);
    };

    // Vazifani yangilash
    const updateTask = (updatedTask: Task) => {
        const index = tasks.value.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            tasks.value[index] = updatedTask;
        }
    };

    // Vazifani o'chirish
    const deleteTask = (taskId: string) => {
        tasks.value = tasks.value.filter(t => t.id !== taskId);
    };

    // Vazifa statusini o'zgartirish (Drag & Drop uchun)
    const moveTask = (taskId: string, newStatus: Task['status']) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
        }
    };

    // Har bir o'zgarishni Local Storage'ga saqlash
    watch(tasks, (newTasks) => {
        saveToStorage('tasks', newTasks);
    }, { deep: true });

    return {
        tasks,
        userTasks,
        filteredAndSortedTasks,
        filterStatus,
        sortBy,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        setFilter: (status: Task['status'] | 'all') => { filterStatus.value = status; },
        setSortBy: (criteria: 'dueDate' | 'priority') => { sortBy.value = criteria; },
    };
});