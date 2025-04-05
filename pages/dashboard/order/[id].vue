<template>
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6 print:shadow-none">
        <!-- Header with back button and print button -->
        <div class="flex justify-between items-center mb-6 print:hidden">
          <button 
            @click="router.back()" 
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon class="h-5 w-5 mr-1" />
            Back to Orders
          </button>
          
          <button 
            @click="printOrder" 
            class="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors duration-200"
          >
            <PrinterIcon class="h-5 w-5 mr-2" />
            Print Order
          </button>
        </div>
        
        <!-- Order header -->
        <div class="border-b pb-4 mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Order Details</h1>
          <p class="text-gray-600">Order ID: {{ order?.id }}</p>
        </div>
        
        <!-- Order info grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Customer Information</h2>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-700"><span class="font-medium">Name:</span> {{ order?.customer }}</p>
              <p class="text-gray-700"><span class="font-medium">Phone:</span> {{ order?.customerPhone || '+234 812 345 6789' }}</p>
              <p class="text-gray-700"><span class="font-medium">Email:</span> {{ order?.customerEmail || 'customer@example.com' }}</p>
            </div>
          </div>
          
          <div>
            <h2 class="text-lg font-semibold text-gray-800 mb-2">Order Information</h2>
            <div class="bg-gray-50 p-4 rounded">
              <p class="text-gray-700"><span class="font-medium">Date:</span> {{ formatDate(order?.dateAdded || '') }}</p>
              <p class="text-gray-700"><span class="font-medium">Status:</span> 
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
              <p class="text-gray-700"><span class="font-medium">Location:</span> {{ order?.location }}</p>
            </div>
          </div>
        </div>
        
        <!-- Order items -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
          <div class="overflow-x-auto">
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
                <tr v-for="(item, index) in orderItems" :key="index" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{{ formatPrice(item.price) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₦{{ formatPrice(item.price * item.quantity) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Order summary -->
        <div class="flex justify-end">
          <div class="w-full md:w-1/3">
            <div class="bg-gray-50 p-4 rounded">
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Subtotal:</span>
                <span class="text-gray-800 font-medium">₦{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Delivery Fee:</span>
                <span class="text-gray-800 font-medium">₦{{ formatPrice(deliveryFee) }}</span>
              </div>
              <div class="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span class="text-gray-800 font-semibold">Total:</span>
                <span class="text-gray-800 font-bold">₦{{ formatPrice(order?.total || 0) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status update section (only visible in non-print mode) -->
      <div class="bg-white rounded-xl shadow-lg p-6 print:hidden">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Update Order Status</h2>
        
        <div class="flex items-center justify-center mb-6">
          <div class="relative inline-block w-16 h-8 mr-2">
            <input 
              type="checkbox" 
              id="toggle" 
              v-model="orderStatus" 
              class="sr-only"
            />
            <label 
              for="toggle" 
              class="block overflow-hidden h-8 rounded-full bg-gray-300 cursor-pointer"
            >
              <span 
                class="block h-8 w-8 rounded-full bg-white transform transition-transform duration-300 ease-in-out"
                :class="orderStatus ? 'translate-x-8 bg-green-500' : 'translate-x-0 bg-red-500'"
              ></span>
            </label>
          </div>
          <span class="text-sm font-medium" :class="orderStatus ? 'text-green-600' : 'text-red-600'">
            {{ orderStatus ? 'Accepted' : 'Rejected' }}
          </span>
        </div>
        
        <div class="flex justify-center">
          <button 
            @click="updateOrderStatus" 
            class="px-6 py-2 bg-orange-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-orange-600 focus:outline-none"
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
  import { ArrowLeftIcon, PrinterIcon } from 'lucide-vue-next'
  
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
  
  /* Animation for elements */
  .bg-white {
    animation: fadeIn 0.5s ease-in-out;
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