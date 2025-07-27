<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Task Manager</q-toolbar-title>
        <q-btn flat icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'

const userStore = useUserStore()
const router = useRouter()

async function logout() {
  userStore.$reset()
  await router.push('/login')
}
</script>

