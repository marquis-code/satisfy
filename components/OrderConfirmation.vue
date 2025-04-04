<template>
    <div class="bg-white rounded-lg shadow-md p-5 animate-scaleIn">
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle class="text-green-500" size="32" />
        </div>
        <h3 class="text-xl font-bold">Order Placed Successfully!</h3>
        <p class="text-gray-600 mt-2">Your order has been sent to the vendor</p>
      </div>
      
      <div class="border border-gray-100 rounded-lg p-4 mb-6">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Order ID:</span>
          <span class="font-medium">{{ order.id }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Vendor:</span>
          <span class="font-medium">{{ order.vendorName }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600">Total Amount:</span>
          <span class="font-bold text-red-600">₦{{ formatPrice(order.totalAmount) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Delivery Type:</span>
          <span class="font-medium capitalize">{{ order.deliveryType }}</span>
        </div>
      </div>
      
      <div class="space-y-4">
        <button 
          @click="shareOnWhatsApp"
          class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <span class="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </span>
          Track Order on WhatsApp
        </button>
        
        <button 
          @click="$emit('continue-shopping')"
          class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { CheckCircle } from 'lucide-vue-next';
  
  interface OrderConfirmationProps {
    order: {
      id: string;
      vendorName: string;
      totalAmount: number;
      deliveryType: string;
      vendorPhone?: string;
    };
  }
  
  const props = defineProps<OrderConfirmationProps>();
  const emit = defineEmits(['continue-shopping']);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-NG');
  };
  
  const shareOnWhatsApp = () => {
    if (!props.order.vendorPhone) return;
    
    const message = `Hello! I'm tracking my order #${props.order.id} from ${props.order.vendorName}. Total: ₦${formatPrice(props.order.totalAmount)}. Please let me know when it will be ready.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${props.order.vendorPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };
  </script>
  
  <style scoped>
  .animate-scaleIn {
    animation: scaleIn 0.4s ease-out;
  }
  
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  
  