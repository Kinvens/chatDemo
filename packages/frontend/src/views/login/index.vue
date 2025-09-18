<script setup lang="ts">
import {nextTick, ref} from 'vue';
import {useRouter} from 'vue-router';
import {toast} from 'vue-sonner'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {MessageCircle} from 'lucide-vue-next';
import {login} from '@/apis/auth.ts'
import {useUserStore} from "@stores/user.ts";

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const {setUser} = useUserStore()
const router = useRouter();

const handleLogin = async (e: Event) => {
  e.preventDefault();
  if (!username.value || !password.value) {
    toast.error('Error', {
      description: 'Please fill in all fields',
    });
    return;
  }

  isLoading.value = true;

  await login({
    account: username.value,
    password: password.value,
  }).then((response) => {
    if (response.code !== 200) {
      throw new Error('Username or password error.')
    }
    const {userId, account, accessToken} = response.data
    setUser({
      account,
      accessToken
    })
    toast('Welcome!', {
      description: `Logged in as ${account}`,
    })
    nextTick(() => {
      router.push('/');
    })
  }).catch(error => {
    toast.error('Error', {
      description: error?.message || 'Unknown error',
    });
  }).finally(() => {
    isLoading.value = false;
  })
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-chat-background p-4">
    <Card class="w-full max-w-md bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg">
      <CardHeader class="text-center pb-2">
        <div class="flex justify-center mb-4">
          <div class="p-3 rounded-full bg-primary/10">
            <MessageCircle class="h-8 w-8 text-primary"/>
          </div>
        </div>
        <CardTitle
          class="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
          Welcome to ChatDemo
        </CardTitle>
        <CardDescription class="text-muted-foreground">
          Enter your credentials to join the conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              v-model="username"
              class="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              v-model="password"
              class="transition-all duration-200 focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button
            type="submit"
            :style="{
              color:'#fff'
            }"
            class=" w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
