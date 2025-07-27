import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: ''
  }),
  actions: {
    setUser(name: string) {
      this.username = name
    }
  },
  persist: true
})
