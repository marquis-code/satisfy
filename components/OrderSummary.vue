<template>
    <div class="bg-white rounded-xl shadow-md p-5 animate-slideUp">
      <h3 class="text-lg font-bold mb-4">Order Summary</h3>
      
      <div class="space-y-3 mb-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-medium">₦{{ formatPrice(subtotal) }}</span>
        </div>
        
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Service Fee</span>
          <span class="font-medium">₦{{ formatPrice(serviceFee) }}</span>
        </div>
        
        <div v-if="deliveryFee > 0" class="flex justify-between text-sm">
          <span class="text-gray-600">Delivery Fee</span>
          <span class="font-medium">₦{{ formatPrice(deliveryFee) }}</span>
        </div>
        
        <div class="border-t border-dashed border-gray-200 pt-3 mt-3">
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span class="text-red-600">₦{{ formatPrice(total) }}</span>
          </div>
        </div>
      </div>
      
      <button 
        @click="$emit('checkout')"
        class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
        :disabled="loading"
      >
        <span v-if="!loading">Proceed to Checkout</span>
        <div v-else class="flex items-center space-x-2">
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </div>
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    subtotal: {
      type: Number,
      required: true
    },
    serviceFee: {
      type: Number,
      default: 50 // Default service fee of 50 naira
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  const total = computed(() => {
    return props.subtotal + props.serviceFee + props.deliveryFee;
  });
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-NG');
  };
  </script>
  
  <style scoped>
  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
  