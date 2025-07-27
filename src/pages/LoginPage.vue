<template>
  <div class="flex flex-center q-pa-xl" style="height: 100vh">
    <q-card class="q-pa-md" style="min-width: 300px">
      <q-card-section>
        <div class="text-h6">Tizimga kirish</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Ismingiz" dense autofocus />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Kirish" color="primary" @click="login" :disable="!username" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'stores/user'

const username = ref('')
const router = useRouter()
const userStore = useUserStore()

async function login() {
  userStore.setUser(username.value)
  await router.push('/tasks')
}

</script>
