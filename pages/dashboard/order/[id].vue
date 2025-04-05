<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6 print:shadow-none transform transition-all duration-300 hover:shadow-xl">
      <!-- Header with back button and print button -->
      <div class="flex justify-between items-center mb-6 print:hidden">
        <button 
          @click="router.back()" 
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
          <span class="font-medium">Back to Orders</span>
        </button>
        
        <button 
          @click="printOrder" 
          class="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5"
        >
          <PrinterIcon class="h-5 w-5 mr-2" />
          Print Order
        </button>
      </div>
      
      <!-- Order header with animated badge -->
      <div class="border-b pb-4 mb-6 relative">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">Order Details</h1>
          <div 
            class="animate-pulse-slow absolute top-0 right-0 px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': order?.status === 'accepted',
              'bg-red-100 text-red-800': order?.status === 'rejected',
              'bg-yellow-100 text-yellow-800': order?.status === 'pending'
            }"
          >
            {{ order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending' }}
          </div>
        </div>
        <p class="text-gray-600 mt-1">Order ID: <span class="font-medium">{{ order?.id }}</span></p>
      </div>
      
      <!-- Order info grid with improved cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="transform transition duration-300 hover:scale-102">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <UserIcon class="h-5 w-5 mr-2 text-orange-500" />
            Customer Information
          </h2>
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-20">Name:</span> 
              <span class="text-gray-900">{{ order?.customer }}</span>
            </p>
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-20">Phone:</span> 
              <span class="text-gray-900">{{ order?.customerPhone || '+234 812 345 6789' }}</span>
            </p>
            <p class="text-gray-700 flex items-center">
              <span class="font-medium w-20">Email:</span> 
              <span class="text-gray-900">{{ order?.customerEmail || 'customer@example.com' }}</span>
            </p>
          </div>
        </div>
        
        <div class="transform transition duration-300 hover:scale-102">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
            Order Information
          </h2>
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-20">Date:</span> 
              <span class="text-gray-900">{{ formatDate(order?.dateAdded || '') }}</span>
            </p>
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-20">Status:</span> 
              <span 
                :class="{
                  'text-green-600': order?.status === 'accepted',
                  'text-red-600': order?.status === 'rejected',
                  'text-yellow-600': order?.status === 'pending'
                }"
                class="font-medium"
              >
                {{ order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending' }}
              </span>
            </p>
            <p class="text-gray-700 flex items-center">
              <span class="font-medium w-20">Location:</span> 
              <span class="text-gray-900">{{ order?.location }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Order items with improved table -->
      <div class="mb-8 animate-fade-in">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ShoppingCartIcon class="h-5 w-5 mr-2 text-orange-500" />
          Order Items
        </h2>
        <div class="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="(item, index) in orderItems" 
                :key="index" 
                class="hover:bg-orange-50 transition-colors duration-150"
                :style="{ animationDelay: `${index * 100}ms` }"
                :class="'animate-slide-in'"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ item.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="inline-flex items-center justify-center bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                    {{ item.quantity }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₦{{ formatPrice(item.price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₦{{ formatPrice(item.price * item.quantity) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Order summary with improved styling -->
      <div class="flex justify-end animate-fade-in-up">
        <div class="w-full md:w-1/3">
          <div class="bg-orange-50 p-5 rounded-lg border border-orange-100 shadow-sm">
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="text-gray-800 font-medium">₦{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Delivery Fee:</span>
              <span class="text-gray-800 font-medium">₦{{ formatPrice(deliveryFee) }}</span>
            </div>
            <div class="flex justify-between py-3 border-t border-orange-200 mt-2">
              <span class="text-gray-800 font-semibold">Total:</span>
              <span class="text-orange-600 font-bold text-xl">₦{{ formatPrice(order?.total || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status update section with improved toggle -->
    <div class="bg-white rounded-xl shadow-lg p-6 print:hidden transform transition-all duration-300 hover:shadow-xl animate-fade-in-up" style="animation-delay: 300ms">
      <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <CheckCircleIcon class="h-5 w-5 mr-2 text-orange-500" />
        Update Order Status
      </h2>
      
      <div class="flex flex-col items-center justify-center mb-6">
        <div class="relative inline-block w-20 h-10 mb-4">
          <input 
            type="checkbox" 
            id="toggle" 
            v-model="orderStatus" 
            class="sr-only"
          />
          <label 
            for="toggle" 
            class="block overflow-hidden h-10 rounded-full bg-gray-200 cursor-pointer shadow-inner"
          >
            <span 
              class="absolute inset-y-0 left-0 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow transform transition-transform duration-300 ease-in-out"
              :class="orderStatus ? 'translate-x-10 bg-green-500' : 'translate-x-0 bg-red-500'"
            >
              <CheckIcon v-if="orderStatus" class="h-5 w-5 text-white" />
              <XIcon v-else class="h-5 w-5 text-white" />
            </span>
          </label>
        </div>
        <span class="text-lg font-medium" :class="orderStatus ? 'text-green-600' : 'text-red-600'">
          {{ orderStatus ? 'Accepted' : 'Rejected' }}
        </span>
      </div>
      
      <div class="flex justify-center">
        <button 
          @click="updateOrderStatus" 
          class="px-6 py-3 bg-orange-500 border border-transparent rounded-lg text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  UserIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  CheckCircleIcon,
  CheckIcon,
  XIcon
} from 'lucide-vue-next'

interface Order {
  id: string
  customer: string
  customerPhone?: string
  customerEmail?: string
  total: number
  dateAdded: string
  location: string
  status: 'accepted' | 'rejected' | 'pending'
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

// Router
const router = useRouter()
const route = useRoute()

// State
const order = ref<Order | null>(null)
const orderItems = ref<OrderItem[]>([])
const orderStatus = ref(false)
const deliveryFee = ref(500)

// Computed
const subtotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// Methods
const loadOrderDetails = async () => {
  try {
    const orderId = route.params.id as string
    
    // In a real app, this would be an API call
    // For demo purposes, we'll use mock data
    const mockOrder: Order = {
      id: orderId,
      customer: 'Bukaz',
      customerPhone: '+234 812 345 6789',
      customerEmail: 'bukaz@example.com',
      total: 4210.00,
      dateAdded: '2025-04-04',
      location: 'Oluwo',
      status: 'pending'
    }
    
    // Mock order items
    const mockOrderItems: OrderItem[] = [
      { name: 'Jollof Rice with Chicken', quantity: 2, price: 1500 },
      { name: 'Fried Rice', quantity: 1, price: 1200 },
      { name: 'Pepsi (50cl)', quantity: 2, price: 250 },
    ]
    
    order.value = mockOrder
    orderItems.value = mockOrderItems
    orderStatus.value = mockOrder.status === 'accepted'
    
  } catch (error) {
    console.error('Failed to load order details:', error)
  }
}

const formatPrice = (price: number) => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const printOrder = () => {
  window.print()
}

const updateOrderStatus = async () => {
  if (!order.value) return
  
  try {
    // In a real app, this would be an API call
    console.log(`Updating order ${order.value.id} status to ${orderStatus.value ? 'accepted' : 'rejected'}`)
    
    // Update the order in our local state
    order.value.status = orderStatus.value ? 'accepted' : 'rejected'
    
    // Show success notification (in a real app)
  } catch (error) {
    console.error('Failed to update order status:', error)
    // Show error notification (in a real app)
  }
}

// Lifecycle
onMounted(() => {
  loadOrderDetails()
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Print styles */
@media print {
  @page {
    size: A4;
    margin: 1cm;
  }
  
  body {
    font-size: 12pt;
  }
  
  .print-hidden {
    display: none !important;
  }
}

/* Custom toggle switch styling */
input[type="checkbox"] + label {
  position: relative;
}

input[type="checkbox"] + label span {
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.3s ease;
}

input[type="checkbox"]:checked + label span {
  transform: translateX(100%);
}

/* Enhanced animations */
.animate-fade-in {
  animation: fadeIn 0.6s ease-in-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

.animate-pulse-slow {
  animation: pulseSlow 2s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulseSlow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Hover scale effect */
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>