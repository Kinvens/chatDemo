import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useUserStore = defineStore('user', () => {
  const account = ref<string | undefined>('暂时')
  const accessToken = ref<string | undefined>(undefined)

  const setUser = (user?: {
    account: string,
    accessToken: string,
  }) => {
    console.log('setUser', user)
    if (user?.accessToken) {
      account.value = user.account
      accessToken.value = user.accessToken
      localStorage.setItem('accessToken', user.accessToken)
    } else {
      account.value = undefined
      accessToken.value = undefined
      localStorage.removeItem('accessToken')
    }
  }
  return {
    accessToken,
    account,
    setUser,
  }
})
