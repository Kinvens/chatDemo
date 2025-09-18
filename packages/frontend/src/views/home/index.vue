<script setup lang="ts">
import {computed} from 'vue'
import LeftSide from './components/LeftSide.vue'
import {theme} from 'ant-design-vue'
import Chat from './components/Chat.vue'

const {token} = theme.useToken()

const styles = computed(() => {
  return {
    'layout': {
      'width': '100%',
      'min-width': '970px',
      'height': '722px',
      'border-radius': `${token.value.borderRadius}px`,
      'display': 'flex',
      'background': `${token.value.colorBgContainer}`,
      'font-family': `AlibabaPuHuiTi, ${token.value.fontFamily}, sans-serif`,
    }
  } as const
})

</script>

<template>
  <div :style="styles.layout">
    <LeftSide/>
    <Chat/>
  </div>
</template>
