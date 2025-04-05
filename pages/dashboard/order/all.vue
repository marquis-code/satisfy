<template>
  <div class="container mx-auto">
    <!-- Header with animated counter -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-2">
        <ClipboardListIcon class="h-8 w-8 text-emerald-600" />
        <span>Orders Dashboard</span>
      </h1>
      <div class="flex items-center">
        <span class="text-lg text-gray-600">Total Orders:</span>
        <div class="ml-2 bg-emerald-100 text-emerald-800 font-semibold px-3 py-1 rounded-full">
          {{ orders?.length }}
        </div>
      </div>
    </div>

    <!-- {{orders}} -->

    <!-- Filters card -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FilterIcon class="h-5 w-5 text-emerald-600" />
        <span>Filters & Controls</span>
      </h2>
      
      <!-- Date filters and sort -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="flex flex-col">
          <label class="text-gray-600 mb-2 font-medium">From Date:</label>
          <div class="relative">
            <input 
              v-model="dateRange.from" 
              type="text" 
              placeholder="mm/dd/yyyy" 
              class="border border-gray-300 rounded-lg px-4 py-3 w-full pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              @focus="showFromDatepicker = true"
            />
            <button @click="showFromDatepicker = true" class="absolute right-3 top-3 text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              <CalendarIcon class="h-5 w-5" />
            </button>
            <Datepicker 
              v-if="showFromDatepicker" 
              v-model="dateRange.from" 
              @close="showFromDatepicker = false"
              class="absolute z-10 mt-1"
            />
          </div>
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-600 mb-2 font-medium">To Date:</label>
          <div class="relative">
            <input 
              v-model="dateRange.to" 
              type="text" 
              placeholder="mm/dd/yyyy" 
              class="border border-gray-300 rounded-lg px-4 py-3 w-full pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              @focus="showToDatepicker = true"
            />
            <button @click="showToDatepicker = true" class="absolute right-3 top-3 text-gray-500 hover:text-emerald-600 transition-colors duration-200">
              <CalendarIcon class="h-5 w-5" />
            </button>
            <Datepicker 
              v-if="showToDatepicker" 
              v-model="dateRange.to" 
              @close="showToDatepicker = false"
              class="absolute z-10 mt-1"
            />
          </div>
        </div>
        
        <div class="flex flex-col">
          <label class="text-gray-600 mb-2 font-medium">Actions:</label>
          <div class="flex gap-3">
            <button 
              @click="sortOrders" 
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 flex-1"
            >
              <SortAscIcon class="h-5 w-5" />
              <span>Sort by Name</span>
            </button>
            <button 
              @click="applyFilters" 
              class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 flex-1"
            >
              <FilterIcon class="h-5 w-5" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Table controls -->
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-gray-600 font-medium">Show</span>
          <select 
            v-model="perPage" 
            class="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            @change="applyFilters"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-gray-600 font-medium">entries</span>
        </div>
        
        <div class="relative flex-1 md:max-w-md">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search orders..."
            class="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            @input="debounceSearch"
          />
          <SearchIcon class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
    
    <!-- Orders table -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                customerName
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date Added
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Location
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="(order, index) in orders" 
              :key="order.id" 
              class="hover:bg-gray-50 transition-all duration-200"
              :class="{'animate-fadeIn': true}"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.orderId }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mr-3">
                    {{ order.customerName.charAt(0) }}
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-emerald-700">₦{{ formatPrice(order.totalAmount) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <div class="text-sm text-gray-600">{{ order.location }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-emerald-100 text-emerald-800': order.status === 'accepted',
                    'bg-red-100 text-red-800': order.status === 'rejected',
                    'bg-yellow-100 text-yellow-800': order.status === 'pending'
                  }"
                >
                  {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex space-x-2">
                  <button 
                    @click="viewOrder(order)" 
                    class="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200 tooltip-wrapper"
                  >
                    <EyeIcon class="h-5 w-5" />
                    <span class="tooltip">View Details</span>
                  </button>
                  <button 
                    @click="openStatusModal(order)" 
                    class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 p-2 rounded-lg transition-colors duration-200 tooltip-wrapper"
                  >
                    <EditIcon class="h-5 w-5" />
                    <span class="tooltip">Update Status</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="orders?.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <InboxIcon class="h-12 w-12 text-gray-400 mb-3" />
                  <p class="text-gray-500 text-lg">No orders found</p>
                  <p class="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Pagination -->
    <div class="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-300 hover:shadow-lg">
      <div class="text-sm text-gray-600">
        Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of {{ totalOrders }} entries
      </div>
      <div class="flex space-x-2">
        <button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
        >
          <ChevronLeftIcon class="h-4 w-4" />
          <span>Previous</span>
        </button>
        <button 
          v-for="page in displayedPages" 
          :key="page" 
          @click="changePage(page)"
          :class="[
            'px-4 py-2 rounded-lg border transition-all duration-200',
            currentPage === page 
              ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
        <button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRightIcon class="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <!-- Status Update Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="showStatusModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showStatusModal = false"></div>
            
            <!-- Modal panel -->
            <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div class="bg-white px-6 pt-5 pb-6">
                <div class="flex items-start justify-between mb-5">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900" id="modal-title">Update Order Status</h3>
                    <p class="mt-1 text-sm text-gray-500">Change the status of this order</p>
                  </div>
                  <button 
                    @click="showStatusModal = false" 
                    class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <XIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <div class="bg-gray-50 rounded-lg p-4 mb-5">
                  <div class="flex items-center mb-2">
                    <TagIcon class="h-5 w-5 text-gray-500 mr-2" />
                    <span class="text-sm font-medium text-gray-700">Order ID:</span>
                    <span class="ml-2 text-sm text-gray-900 font-mono">{{ selectedOrder?.orderId }}</span>
                  </div>
                  <div class="flex items-center">
                    <UserIcon class="h-5 w-5 text-gray-500 mr-2" />
                    <span class="text-sm font-medium text-gray-700">customerName:</span>
                    <span class="ml-2 text-sm text-gray-900">{{ selectedOrder?.customerName }}</span>
                  </div>
                </div>
                
                <div class="flex flex-col items-center justify-center mb-6">
                  <p class="text-sm font-medium text-gray-700 mb-4">Select Order Status:</p>
                  
                  <div class="flex items-center justify-center space-x-4">
                    <label 
                      class="flex flex-col items-center cursor-pointer"
                      :class="{ 'opacity-50': !orderStatus }"
                    >
                      <div 
                        class="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200"
                        :class="orderStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'"
                      >
                        <CheckIcon class="h-6 w-6" />
                      </div>
                      <span class="text-sm font-medium" :class="orderStatus ? 'text-emerald-600' : 'text-gray-500'">
                        Accepted
                      </span>
                    </label>
                    
                    <div class="relative inline-block w-16 h-8 mx-4">
                      <input 
                        type="checkbox" 
                        id="toggle" 
                        v-model="orderStatus" 
                        class="sr-only"
                      />
                      <label 
                        for="toggle" 
                        class="block overflow-hidden h-8 rounded-full bg-gray-200 cursor-pointer"
                      >
                        <span 
                          class="block h-8 w-8 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out"
                          :class="orderStatus ? 'translate-x-8 border-emerald-500' : 'translate-x-0 border-red-500'"
                        ></span>
                      </label>
                    </div>
                    
                    <label 
                      class="flex flex-col items-center cursor-pointer"
                      :class="{ 'opacity-50': orderStatus }"
                    >
                      <div 
                        class="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200"
                        :class="!orderStatus ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'"
                      >
                        <XIcon class="h-6 w-6" />
                      </div>
                      <span class="text-sm font-medium" :class="!orderStatus ? 'text-red-600' : 'text-gray-500'">
                        Rejected
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button 
                  @click="showStatusModal = false" 
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  :disabled="updating"
                  @click="handleUpdateOrderStatus" 
                  class="px-4 py-2 bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-25 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none transition-colors duration-200"
                >
                  {{ updating ? 'UPDATING...' : 'Save Changes'}}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CalendarIcon, 
  XIcon, 
  FilterIcon, 
  SearchIcon, 
  SortAscIcon, 
  EyeIcon, 
  EditIcon, 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClipboardListIcon,
  MapPinIcon, 
  InboxIcon,
  TagIcon,
  UserIcon
} from 'lucide-vue-next'
import { useFetchVendorsOrder } from '@/composables/modules/order/useFetchVendorOrders'
import { useUpdateOrderStatus } from '@/composables/modules/order/useUpdateOrderStatus'

interface Order {
  _id: string
  customerName: string
  total: number
  dateAdded: string
  location: string
  status: 'accepted' | 'rejected' | 'pending'
}

const { orders, loading } = useFetchVendorsOrder()
const { updateOrderStatus, loading: updating } =  useUpdateOrderStatus()

interface DateRange {
  from: string
  to: string
}

interface PaginationInfo {
  from: number
  to: number
}

// Router
const router = useRouter()

// State
const allOrders = ref<Order[]>([])
const totalOrders = ref(0)
const currentPage = ref(1)
const perPage = ref(50)
const searchQuery = ref('')
const dateRange = ref<DateRange>({
  from: '',
  to: ''
})
const showFromDatepicker = ref(false)
const showToDatepicker = ref(false)
const showStatusModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const orderStatus = ref(false)

// Computed
const totalPages = computed(() => Math.ceil(totalOrders.value / perPage.value))

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
    let endPage = startPage + maxVisiblePages - 1
    
    if (endPage > totalPages.value) {
      endPage = totalPages.value
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

const paginationInfo = computed<PaginationInfo>(() => {
  const from = (currentPage.value - 1) * perPage.value + 1
  const to = Math.min(from + perPage.value - 1, totalOrders.value)
  return { from, to }
})

const applyFilters = () => {
  let filteredOrders = [...allOrders.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredOrders = filteredOrders.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.location.toLowerCase().includes(query)
    )
  }
  
  // Apply date filters
  if (dateRange.value.from) {
    const fromDate = new Date(dateRange.value.from)
    filteredOrders = filteredOrders.filter(order => new Date(order.dateAdded) >= fromDate)
  }
  
  if (dateRange.value.to) {
    const toDate = new Date(dateRange.value.to)
    filteredOrders = filteredOrders.filter(order => new Date(order.dateAdded) <= toDate)
  }
  
  // Update total count
  totalOrders.value = filteredOrders?.length
  
  // Apply pagination
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  orders.value = filteredOrders.slice(start, end)
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  applyFilters()
}

const debounceSearch = (() => {
  let timeout: NodeJS.Timeout | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      currentPage.value = 1
      applyFilters()
    }, 300)
  }
})()

const sortOrders = () => {
  allOrders.value.sort((a, b) => a.customerName.localeCompare(b.customerName))
  applyFilters()
}

const formatPrice = (price: number) => {
  return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const viewOrder = (order: Order) => {
  localStorage.setItem('order', JSON.stringify(order))
  router.push(`/dashboard/order/${order._id}`)
}

const openStatusModal = (order: Order) => {
  selectedOrder.value = order
  orderStatus.value = order.status === 'accepted'
  showStatusModal.value = true
}

const handleUpdateOrderStatus = async () => {
  if (!selectedOrder.value) return
  
  try {
    // Call the updateOrderStatus method from the composable
    // The loading state is tracked by the 'updating' ref from the composable
    await updateOrderStatus(selectedOrder.value._id,{
      status: orderStatus.value ? 'accepted' : 'rejected'
    })
    
    // Update the order in our local state to maintain UI consistency
    const orderIndex = allOrders.value.findIndex(o => o._id === selectedOrder.value?._id)
    if (orderIndex !== -1) {
      allOrders.value[orderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
      
      // Also update in the current page if present
      const pageOrderIndex = orders.value.findIndex(o => o._id === selectedOrder.value?._id)
      if (pageOrderIndex !== -1) {
        orders.value[pageOrderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
      }
    }
    
    // Close the modal
    showStatusModal.value = false
    
    // Refresh the data
    // Option 1: Using Nuxt's refreshNuxtData
    await refreshNuxtData('orders')
    
    // Option 2: If you're using useFetch or useAsyncData with a key
    // await refresh('orders')
    
    // Show success notification
    // Example with useToast (if you have a toast system)
    // toast.success('Order status updated successfully')
  } catch (error) {
    console.error('Failed to update order status:', error)
    // Show error notification
    // toast.error('Failed to update order status')
  }
}

// const handleUpdateOrderStatus = async () => {
//   if (!selectedOrder.value) return
  
//   try {
//     // In a real app, this would be an API call
//     console.log(`Updating order ${selectedOrder.value.id} status to ${orderStatus.value ? 'accepted' : 'rejected'}`)
    
//     // Update the order in our local state
//     const orderIndex = allOrders.value.findIndex(o => o.id === selectedOrder.value?.id)
//     if (orderIndex !== -1) {
//       allOrders.value[orderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
      
//       // Also update in the current page if present
//       const pageOrderIndex = orders.value.findIndex(o => o.id === selectedOrder.value?.id)
//       if (pageOrderIndex !== -1) {
//         orders.value[pageOrderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
//       }
//     }
    
//     // Close the modal
//     showStatusModal.value = false
    
//     // Show success notification (in a real app)
//   } catch (error) {
//     console.error('Failed to update order status:', error)
//     // Show error notification (in a real app)
//   }
// }

// Watchers
watch([perPage, dateRange], () => {
  currentPage.value = 1
  applyFilters()
}, { deep: true })

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Tooltip styling */
.tooltip-wrapper {
  position: relative;
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 10;
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
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
  border: 2px solid transparent;
}

input[type="checkbox"]:checked + label span {
  transform: translateX(100%);
  border-color: #10b981;
}

input[type="checkbox"]:not(:checked) + label span {
  border-color: #ef4444;
}
</style>