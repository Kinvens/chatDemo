import {ref, onUnmounted} from "vue";
import {io, type Socket, type SocketOptions, type ManagerOptions} from 'socket.io-client';

export function useWebSocket(url: string, options?: Partial<ManagerOptions & SocketOptions>) {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);

  const connect = (newUrl = url, newOpts = options) => {
    console.log(`connect url:${newUrl}`);
    socket.value = io(url, {
      ...newOpts
    })

    socket.value.on('connect', () => {
      console.log(`socket connected. socketId:${socket.value?.id}`);
      isConnected.value = true;
    })

    socket.value.on('disconnect', () => {
      console.log("socket disconnected.");
      isConnected.value = false;
    })
  }

  const disconnect = () => {
    socket.value?.disconnect?.()
  }

  const reconnect = (url?: string, options?: Partial<ManagerOptions & SocketOptions>) => {
    disconnect()
    connect(url, options)
  }


  onUnmounted(() => {
    disconnect()
  });

  return {
    socket,
    isConnected,
    connect,
    disconnect, reconnect
  }
}
