import { ref, reactive } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration: number
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
  
  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) => {
    const id = generateId()
    
    toasts.value.push({
      id,
      message,
      type,
      duration
    })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message: string, duration?: number) => {
    return addToast(message, 'success', duration)
  }
  
  const error = (message: string, duration?: number) => {
    return addToast(message, 'error', duration)
  }
  
  const info = (message: string, duration?: number) => {
    return addToast(message, 'info', duration)
  }
  
  const warning = (message: string, duration?: number) => {
    return addToast(message, 'warning', duration)
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}