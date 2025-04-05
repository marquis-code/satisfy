<template>
  <div class="container mx-auto">
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
          class="flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow hover:shadow-md transform hover:-translate-y-0.5"
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
            class="animate-pulse-slow px-3 py-1 rounded-full text-sm font-medium"
            :class="{
              'bg-green-100 text-green-800': order?.status === 'accepted',
              'bg-red-100 text-red-800': order?.status === 'rejected',
              'bg-yellow-100 text-yellow-800': order?.status === 'pending'
            }"
          >
            {{ order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending' }}
          </div>
        </div>
        <p class="text-gray-600 mt-1">Order ID: <span class="font-medium">{{ order?.orderId }}</span></p>
      </div>
      
      <!-- Order info grid with improved cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="transform transition duration-300 hover:scale-102">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <UserIcon class="h-5 w-5 mr-2 text-orange-500" />
            Customer Information
          </h2>
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Name:</span> 
              <span class="text-gray-900">{{ order?.customerName }}</span>
            </p>
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Phone:</span> 
              <span class="text-gray-900">{{ order?.phoneNumber }}</span>
            </p>
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Location:</span> 
              <span class="text-gray-900">{{ order?.location }}</span>
            </p>
            <p v-if="order?.address" class="text-gray-700 flex items-center">
              <span class="font-medium w-24">Address:</span> 
              <span class="text-gray-900">{{ order.address }}</span>
            </p>
          </div>
        </div>
        
        <div class="transform transition duration-300 hover:scale-102">
          <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
            Order Information
          </h2>
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Date:</span> 
              <span class="text-gray-900">{{ formatDate(order?.createdAt || '') }}</span>
            </p>
            <!-- <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Status:</span> 
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
            </p> -->
            <p class="text-gray-700 mb-2 flex items-center">
              <span class="font-medium w-24">Delivery:</span> 
              <span class="text-gray-900 capitalize">{{ order?.deliveryType || 'N/A' }}</span>
            </p>
            <p class="text-gray-700 flex items-center">
              <span class="font-medium w-24">Total:</span> 
              <span class="text-orange-600 font-bold">₦{{ formatPrice(order?.totalAmount || 0) }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Notes section if available -->
      <div v-if="order?.notes" class="mb-8 animate-fade-in">
        <h2 class="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <ClipboardIcon class="h-5 w-5 mr-2 text-orange-500" />
          Additional Notes
        </h2>
        <div class="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
          <p class="text-gray-700 italic">{{ order.notes }}</p>
        </div>
      </div>
      
      <!-- Order packs with beautiful cards -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <PackageIcon class="h-5 w-5 mr-2 text-orange-500" />
          Order Packs
        </h2>
        
        <div class="space-y-6">
          <div 
            v-for="(pack, packIndex) in order?.packs" 
            :key="pack._id"
            class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md animate-fade-in"
            :style="{ animationDelay: `${packIndex * 150}ms` }"
          >
            <div class="bg-orange-50 px-4 py-3 border-b border-orange-100 flex justify-between items-center">
              <h3 class="font-medium text-orange-800 flex items-center">
                <PackageIcon class="h-4 w-4 mr-2" />
                Pack #{{ packIndex + 1 }}
              </h3>
              <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Quantity: {{ pack.quantity }}
              </span>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="(item, itemIndex) in pack.items" 
                    :key="item._id"
                    class="hover:bg-orange-50 transition-colors duration-150 animate-slide-in"
                    :style="{ animationDelay: `${(packIndex * 150) + (itemIndex * 50)}ms` }"
                  >
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ getItemName(item.menuItemId) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span class="inline-flex items-center justify-center bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full">
                        {{ item.quantity }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      ₦{{ formatPrice(item.price) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₦{{ formatPrice(item.price * item.quantity) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-4 py-2 text-right text-sm font-medium text-gray-500">
                      Pack Subtotal:
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-orange-600">
                      ₦{{ formatPrice(calculatePackTotal(pack)) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order summary with improved styling -->
      <div class="flex justify-end animate-fade-in-up">
        <div class="w-full md:w-1/3">
          <div class="bg-orange-50 p-5 rounded-xl border border-orange-100 shadow-sm">
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Subtotal:</span>
              <span class="text-gray-800 font-medium">₦{{ formatPrice(calculateSubtotal()) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600">Delivery Fee:</span>
              <span class="text-gray-800 font-medium">₦{{ formatPrice(order?.charge || 0) }}</span>
            </div>
            <div class="flex justify-between py-3 border-t border-orange-200 mt-2">
              <span class="text-gray-800 font-semibold">Total:</span>
              <span class="text-orange-600 font-bold text-xl">₦{{ formatPrice(order?.totalAmount || 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status update section with improved toggle -->
     <!-- {{order.status}} -->
    <div v-if="order?.status === 'rejected'" class="bg-white rounded-xl shadow-lg p-6 print:hidden transform transition-all duration-300 hover:shadow-xl animate-fade-in-up" style="animation-delay: 300ms">
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
          @click="handleUpdateOrderStatus" 
          class="px-6 py-3 bg-orange-500 border border-transparent rounded-xl text-base font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow hover:shadow-lg transform hover:-translate-y-0.5"
          :disabled="updating"
        >
          <template v-if="updating">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </template>
          <template v-else>
            Save Changes
          </template>
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
  XIcon,
  PackageIcon,
  ClipboardIcon
} from 'lucide-vue-next'
import { useUpdateOrderStatus } from '@/composables/modules/order/useUpdateOrderStatus'

// Define the Order interface based on the provided structure
interface Order {
  _id: string
  orderId: string
  vendorId: string
  customerName: string
  phoneNumber: string
  location: string
  address: string
  packs: Array<{
    items: Array<{
      menuItemId: string
      quantity: number
      price: number
      _id: string
    }>
    quantity: number
    _id: string
  }>
  totalAmount: number
  charge: number
  status: 'accepted' | 'rejected' | 'pending'
  deliveryType: string
  notes: string
  createdAt: string
  updatedAt: string
  __v: number
}

// Router
const router = useRouter()
const route = useRoute()

// State
const order = ref<Order | null>(null)
const orderStatus = ref(false)

// Get the updateOrderStatus composable
const { updateOrderStatus, loading: updating } = useUpdateOrderStatus()

// Menu items mapping (in a real app, this would come from an API)
const menuItems = ref<Record<string, string>>({})

// Methods
const loadOrderDetails = () => {
  try {
    // Get order from local storage
    const orderData = localStorage.getItem('order')
    
    if (orderData) {
      const parsedOrder: Order = JSON.parse(orderData)
      order.value = parsedOrder
      
      // Set order status based on the order data
      orderStatus.value = parsedOrder.status === 'accepted'
      
      // In a real app, you would fetch menu item names from an API
      // For now, we'll create a mapping with mock names
      const itemIds = new Set<string>()
      parsedOrder.packs.forEach(pack => {
        pack.items.forEach(item => {
          itemIds.add(item.menuItemId)
        })
      })
      
      // Create mock menu item names
      const mockMenuItems: Record<string, string> = {}
      const foodNames = [
        'Jollof Rice', 'Fried Rice', 'Chicken Suya', 'Egusi Soup', 
        'Pounded Yam', 'Moin Moin', 'Pepper Soup', 'Suya', 
        'Akara', 'Puff Puff', 'Chin Chin', 'Dodo', 
        'Efo Riro', 'Ogbono Soup', 'Banga Soup', 'Afang Soup'
      ]
      
      let index = 0
      itemIds.forEach(id => {
        mockMenuItems[id] = foodNames[index % foodNames.length]
        index++
      })
      
      menuItems.value = mockMenuItems
    }
  } catch (error) {
    console.error('Failed to load order details:', error)
  }
}

const getItemName = (menuItemId: string): string => {
  return menuItems.value[menuItemId] || `Item ${menuItemId.substring(menuItemId.length - 5)}`
}

const calculatePackTotal = (pack: Order['packs'][0]): number => {
  return pack.items.reduce((total, item) => total + (item.price * item.quantity), 0) * pack.quantity
}

const calculateSubtotal = (): number => {
  if (!order.value) return 0
  
  return order.value.packs.reduce((total, pack) => {
    return total + calculatePackTotal(pack)
  }, 0)
}

const formatPrice = (price: number): string => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const printOrder = (): void => {
  window.print()
}

const handleUpdateOrderStatus = async (): Promise<void> => {
  if (!order.value) return
  
  try {
    // Call the updateOrderStatus method from the composable
    await updateOrderStatus(order.value._id, {
      // id: order.value._id,
      status: orderStatus.value ? 'accepted' : 'rejected'
    })
    
    // Update the order in local storage to maintain consistency
    if (order.value) {
      order.value.status = orderStatus.value ? 'accepted' : 'rejected'
      localStorage.setItem('order', JSON.stringify(order.value))
    }
    
    // Refresh the page to get the updated data
    window.location.reload()
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