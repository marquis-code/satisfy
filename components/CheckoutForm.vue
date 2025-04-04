<template>
    <div class="bg-white rounded-xl shadow-md p-5 animate-fadeIn">
      <h3 class="text-lg font-bold mb-4">Delivery Information</h3>
      
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="space-y-2">
          <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number*</label>
          <div class="relative">
            <Phone class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="18" />
            <input
              v-model="formData.phoneNumber"
              id="phoneNumber"
              type="tel"
              placeholder="+234 800 000 0000"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Delivery Type*</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="formData.deliveryType = 'delivery'"
              class="flex items-center justify-center p-3 rounded-xl border transition-all duration-200"
              :class="formData.deliveryType === 'delivery' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 hover:border-gray-400'"
            >
              <Truck class="mr-2" size="18" />
              <span>Delivery</span>
            </button>
            
            <button
              type="button"
              @click="formData.deliveryType = 'pickup'"
              class="flex items-center justify-center p-3 rounded-xl border transition-all duration-200"
              :class="formData.deliveryType === 'pickup' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 hover:border-gray-400'"
            >
              <ShoppingBag class="mr-2" size="18" />
              <span>Pickup</span>
            </button>
          </div>
        </div>
        
        <div v-if="formData.deliveryType === 'delivery'" class="space-y-4 animate-fadeIn">
          <div class="space-y-2">
            <label for="location" class="block text-sm font-medium text-gray-700">Location*</label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size="18" />
              <input
                v-model="formData.location"
                id="location"
                type="text"
                placeholder="e.g. FUNAAB Campus"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="address" class="block text-sm font-medium text-gray-700">Detailed Address*</label>
            <div class="relative">
              <Home class="absolute left-3 top-3 text-gray-400" size="18" />
              <textarea
                v-model="formData.address"
                id="address"
                placeholder="e.g. Hostel name, room number, landmark"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[80px]"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="space-y-2">
          <label for="notes" class="block text-sm font-medium text-gray-700">Order Notes (Optional)</label>
          <div class="relative">
            <FileText class="absolute left-3 top-3 text-gray-400" size="18" />
            <textarea
              v-model="formData.notes"
              id="notes"
              placeholder="Any special instructions for your order?"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[80px]"
            ></textarea>
          </div>
        </div>
        
        <button
          type="submit"
          class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-300 flex items-center justify-center space-x-2"
          :disabled="loading"
        >
          <span v-if="!loading">Place Order</span>
          <div v-else class="flex items-center space-x-2">
            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        </button>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Phone, Truck, ShoppingBag, MapPin, Home, FileText } from 'lucide-vue-next';
  
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    vendorId: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['submit']);
  
  const formData = reactive({
    phoneNumber: '',
    deliveryType: 'delivery', // default to delivery
    location: '',
    address: '',
    notes: ''
  });
  
  const submitForm = () => {
    // Validate form
    if (formData.deliveryType === 'delivery' && (!formData.location || !formData.address)) {
      return;
    }
    
    if (!formData.phoneNumber) {
      return;
    }
    
    // Emit the form data to parent
    emit('submit', {
      ...formData,
      vendorId: props.vendorId
    });
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
  
  