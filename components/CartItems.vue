<template>
    <div class="flex items-center justify-between p-4 border-b border-gray-100 animate-fadeIn">
      <div class="flex items-center space-x-3">
        <div class="relative">
          <img 
            :src="item.image || '/placeholder.svg?height=60&width=60'" 
            :alt="item.name" 
            class="w-16 h-16 object-cover rounded-xl"
          />
          <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {{ item.quantity }}
          </div>
        </div>
        <div>
          <h4 class="font-medium">{{ item.name }}</h4>
          <p class="text-sm text-gray-500">₦{{ formatPrice(item.price) }}</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-3">
        <div class="flex items-center">
          <button 
            @click="updateQuantity(-1)"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
            :disabled="item.quantity <= 1"
            :class="{'opacity-50 cursor-not-allowed': item.quantity <= 1}"
          >
            <Minus size="16" class="text-gray-700" />
          </button>
          
          <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
          
          <button 
            @click="updateQuantity(1)"
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
          >
            <Plus size="16" class="text-gray-700" />
          </button>
        </div>
        
        <button 
          @click="removeItem"
          class="text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <Trash2 size="18" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Minus, Plus, Trash2 } from 'lucide-vue-next';
  
  interface CartItemProps {
    item: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    };
  }
  
  const props = defineProps<CartItemProps>();
  const emit = defineEmits(['update:quantity', 'remove']);
  
  const updateQuantity = (change: number) => {
    if (props.item.quantity + change < 1) return;
    emit('update:quantity', props.item.id, props.item.quantity + change);
  };
  
  const removeItem = () => {
    emit('remove', props.item.id);
  };
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-NG');
  };
  </script>
  
  <style scoped>
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
  