<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast-item p-4 rounded-lg shadow-lg flex items-start gap-3 transform transition-all duration-300 animate-slide-in"
        :class="{
          'bg-green-50 border-l-4 border-green-500': toast.type === 'success',
          'bg-red-50 border-l-4 border-red-500': toast.type === 'error',
          'bg-blue-50 border-l-4 border-blue-500': toast.type === 'info',
          'bg-yellow-50 border-l-4 border-yellow-500': toast.type === 'warning'
        }"
      >
        <div class="flex-shrink-0">
          <CheckCircleIcon v-if="toast.type === 'success'" class="h-5 w-5 text-green-500" />
          <XCircleIcon v-else-if="toast.type === 'error'" class="h-5 w-5 text-red-500" />
          <InfoIcon v-else-if="toast.type === 'info'" class="h-5 w-5 text-blue-500" />
          <AlertCircleIcon v-else-if="toast.type === 'warning'" class="h-5 w-5 text-yellow-500" />
        </div>
        <div class="flex-1">
          <p 
            class="text-sm font-medium"
            :class="{
              'text-green-800': toast.type === 'success',
              'text-red-800': toast.type === 'error',
              'text-blue-800': toast.type === 'info',
              'text-yellow-800': toast.type === 'warning'
            }"
          >
            {{ toast.message }}
          </p>
        </div>
        <button 
          @click="removeToast(toast.id)" 
          class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useToast } from '~/composables/useToast'
  import { CheckCircleIcon, XCircleIcon, InfoIcon, AlertCircleIcon, XIcon } from 'lucide-vue-next'
  
  const { toasts, removeToast } = useToast()
  </script>
  
  <style scoped>
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .toast-item {
    max-width: 24rem;
    width: 100%;
  }
  </style>