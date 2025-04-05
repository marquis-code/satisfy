<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div class="flex items-center mb-6">
        <div class="h-10 w-2 bg-emerald-500 rounded-full mr-3"></div>
        <h1 class="text-2xl font-bold text-gray-800">Today's Orders</h1>
        <div class="ml-3 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
          {{ totalOrders }} Orders
        </div>
      </div>
      
      <!-- Date filters and sort -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="flex flex-col">
          <label class="text-gray-600 mb-2 font-medium">From:</label>
          <div class="relative">
            <input 
              v-model="dateRange.from" 
              type="text" 
              placeholder="mm/dd/yyyy" 
              class="border border-gray-300 rounded-lg px-4 py-3 w-full transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
              @focus="showFromDatepicker = true"
            />
            <button @click="showFromDatepicker = true" class="absolute right-3 top-3 text-gray-500 hover:text-emerald-500 transition-colors duration-200">
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
          <label class="text-gray-600 mb-2 font-medium">To:</label>
          <div class="relative">
            <input 
              v-model="dateRange.to" 
              type="text" 
              placeholder="mm/dd/yyyy" 
              class="border border-gray-300 rounded-lg px-4 py-3 w-full transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
              @focus="showToDatepicker = true"
            />
            <button @click="showToDatepicker = true" class="absolute right-3 top-3 text-gray-500 hover:text-emerald-500 transition-colors duration-200">
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
          <label class="text-gray-600 mb-2 font-medium">Sort Orders:</label>
          <button 
            @click="sortOrders" 
            class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <ArrowDownAZIcon class="h-5 w-5 mr-2" />
            Sort by Customer
          </button>
        </div>
      </div>
      
      <!-- Table controls -->
      <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
          <span class="text-gray-600 font-medium">Show</span>
          <select 
            v-model="perPage" 
            class="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200"
            @change="loadOrders"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-gray-600 font-medium">entries</span>
        </div>
        
        <div class="relative flex-grow md:max-w-md">
          <SearchIcon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search orders..."
            class="border border-gray-300 rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-all duration-200"
            @input="debounceSearch"
          />
        </div>
      </div>
    </div>
    
    <!-- Orders table -->
    <div class="overflow-hidden bg-white rounded-2xl shadow-lg mb-8">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gradient-to-r from-emerald-50 to-teal-50">
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
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
              class="hover:bg-gray-50 transition-colors duration-150"
              :class="{'animate-fadeIn': true}"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold mr-3">
                    {{ order.customer.charAt(0) }}
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ order.customer }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">₦{{ formatPrice(order.total) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(order.dateAdded) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <MapPinIcon class="h-4 w-4 text-gray-400 mr-1" />
                  <div class="text-sm text-gray-600">{{ order.location }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
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
                    class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg transition-all duration-200 flex items-center shadow hover:shadow-md transform hover:-translate-y-1"
                  >
                    <EyeIcon class="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button 
                    @click="openStatusModal(order)" 
                    class="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-lg transition-all duration-200 flex items-center shadow hover:shadow-md transform hover:-translate-y-1"
                  >
                    <RefreshCwIcon class="h-4 w-4 mr-1" />
                    Update
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="orders.length === 0">
              <td colspan="7" class="px-6 py-10 text-center">
                <div class="flex flex-col items-center justify-center">
                  <PackageXIcon class="h-12 w-12 text-gray-300 mb-3" />
                  <div class="text-gray-500 text-lg font-medium">No orders found</div>
                  <div class="text-gray-400 text-sm mt-1">Try adjusting your search or filters</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-sm text-gray-600">
          Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of {{ totalOrders }} entries
        </div>
        <div class="flex space-x-1">
          <button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </button>
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            @click="changePage(page)"
            :class="[
              'px-3 py-2 rounded-lg border transition-all duration-200',
              currentPage === page 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-500 shadow-md' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ page }}
          </button>
          <button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Status Update Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showStatusModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out"
            :class="{ 'scale-100 opacity-100': showStatusModal, 'scale-95 opacity-0': !showStatusModal }"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-900">Update Order Status</h3>
              <button 
                @click="showStatusModal = false" 
                class="text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors duration-200"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-4 mb-6">
              <div class="flex items-center mb-3">
                <ClipboardIcon class="h-5 w-5 text-gray-400 mr-2" />
                <p class="text-sm font-medium text-gray-700">Order ID: <span class="text-gray-900">{{ selectedOrder?.id }}</span></p>
              </div>
              <div class="flex items-center">
                <UserIcon class="h-5 w-5 text-gray-400 mr-2" />
                <p class="text-sm font-medium text-gray-700">Customer: <span class="text-gray-900">{{ selectedOrder?.customer }}</span></p>
              </div>
            </div>
            
            <div class="flex flex-col items-center justify-center mb-6">
              <p class="text-sm text-gray-600 mb-4">Toggle the switch to update order status</p>
              
              <div class="flex items-center justify-center">
                <div class="relative inline-block w-16 h-8 mr-3">
                  <input 
                    type="checkbox" 
                    id="toggle" 
                    v-model="orderStatus" 
                    class="sr-only"
                  />
                  <label 
                    for="toggle" 
                    class="block overflow-hidden h-8 rounded-full bg-gray-200 cursor-pointer transition-colors duration-300"
                    :class="orderStatus ? 'bg-emerald-100' : 'bg-red-100'"
                  >
                    <span 
                      class="block h-8 w-8 rounded-full transform transition-transform duration-300 ease-in-out shadow-md"
                      :class="orderStatus ? 'translate-x-8 bg-emerald-500' : 'translate-x-0 bg-red-500'"
                    ></span>
                  </label>
                </div>
                <span 
                  class="text-sm font-medium transition-colors duration-300"
                  :class="orderStatus ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ orderStatus ? 'Accepted' : 'Rejected' }}
                </span>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="showStatusModal = false" 
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                @click="updateOrderStatus" 
                class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
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
  SearchIcon, 
  MapPinIcon, 
  EyeIcon, 
  RefreshCwIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClipboardIcon, 
  UserIcon, 
  ArrowDownAZIcon,
  PackageXIcon
} from 'lucide-vue-next'
import { useFetchVendorTodaysOrder } from '@/composables/modules/order/useFetchTodaysOrders'

interface Order {
  id: string
  customer: string
  total: number
  dateAdded: string
  location: string
  status: 'accepted' | 'rejected' | 'pending'
}

const { ordersList, loading } = useFetchVendorTodaysOrder()

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
const orders = ref<Order[]>([])
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

// Methods
const loadOrders = async () => {
  try {
    // In a real app, this would be an API call with pagination params
    // For demo purposes, we'll use mock data
    const mockOrders: Order[] = [
      { id: 'CT-CTS-MGX0MBGoil', customer: 'Bukaz', total: 4210.00, dateAdded: '2025-04-04', location: 'Oluwo', status: 'pending' },
      { id: 'CT-CTS-7M4CKpmg7u', customer: 'Bonnie', total: 2810.00, dateAdded: '2025-04-04', location: 'Isolu', status: 'accepted' },
      { id: 'CT-CTS-V1FACTGc2X', customer: 'Mariam', total: 2210.00, dateAdded: '2025-04-04', location: 'Harmony', status: 'pending' },
      { id: 'CT-CTS-7M4CKzNLeC', customer: 'Bonnie', total: 2810.00, dateAdded: '2025-04-04', location: 'Isolu', status: 'rejected' },
      { id: 'CT-CTS-04AICYdneh', customer: 'ABASS', total: 3710.00, dateAdded: '2025-04-04', location: 'School, FUNAAB', status: 'pending' },
      { id: 'CT-CTS-DNXGOQ2DNi', customer: 'Ola', total: 3510.00, dateAdded: '2025-04-04', location: 'Oluwo', status: 'accepted' },
      { id: 'CT-CTS-MJ70XnM7gn', customer: 'Lukman', total: 10110.00, dateAdded: '2025-04-04', location: 'Harmony', status: 'pending' },
    ]
    
    // Add more mock data to demonstrate pagination
    for (let i = 0; i < 20; i++) {
      mockOrders.push({
        id: `CT-CTS-${Math.random().toString(36).substring(2, 10)}`,
        customer: ['John', 'Mary', 'David', 'Sarah', 'Michael'][Math.floor(Math.random() * 5)],
        total: Math.floor(Math.random() * 10000) + 1000,
        dateAdded: '2025-04-04',
        location: ['Oluwo', 'Isolu', 'Harmony', 'School, FUNAAB'][Math.floor(Math.random() * 4)],
        status: ['pending', 'accepted', 'rejected'][Math.floor(Math.random() * 3)] as 'pending' | 'accepted' | 'rejected'
      })
    }
    
    allOrders.value = mockOrders
    totalOrders.value = mockOrders.length
    
    // Apply filters and pagination
    applyFilters()
  } catch (error) {
    console.error('Failed to load orders:', error)
  }
}

const applyFilters = () => {
  let filteredOrders = [...allOrders.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredOrders = filteredOrders.filter(order => 
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
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
  totalOrders.value = filteredOrders.length
  
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
  allOrders.value.sort((a, b) => a.customer.localeCompare(b.customer))
  applyFilters()
}

const formatPrice = (price: number) => {
  return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const viewOrder = (order: Order) => {
  router.push(`/dashboard/order/${order.id}`)
}

const openStatusModal = (order: Order) => {
  selectedOrder.value = order
  orderStatus.value = order.status === 'accepted'
  showStatusModal.value = true
}

const updateOrderStatus = async () => {
  if (!selectedOrder.value) return
  
  try {
    // In a real app, this would be an API call
    console.log(`Updating order ${selectedOrder.value.id} status to ${orderStatus.value ? 'accepted' : 'rejected'}`)
    
    // Update the order in our local state
    const orderIndex = allOrders.value.findIndex(o => o.id === selectedOrder.value?.id)
    if (orderIndex !== -1) {
      allOrders.value[orderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
      
      // Also update in the current page if present
      const pageOrderIndex = orders.value.findIndex(o => o.id === selectedOrder.value?.id)
      if (pageOrderIndex !== -1) {
        orders.value[pageOrderIndex].status = orderStatus.value ? 'accepted' : 'rejected'
      }
    }
    
    // Close the modal
    showStatusModal.value = false
    
    // Show success notification (in a real app)
  } catch (error) {
    console.error('Failed to update order status:', error)
    // Show error notification (in a real app)
  }
}

// Watchers
watch([perPage, dateRange], () => {
  currentPage.value = 1
  applyFilters()
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadOrders()
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<style scoped>
/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
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

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
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

/* Button hover effects */
button {
  transition: all 0.2s ease;
}

/* Focus styles for better accessibility */
input:focus, 
select:focus, 
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}
</style>