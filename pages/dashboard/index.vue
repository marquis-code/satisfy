<template>
  <div class="space-y-6">
    <!-- Price Update Notice -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-5 w-5 text-amber-400" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800">Important Notice: Price Update</h3>
          <div class="mt-1 text-sm text-amber-700">
            Please be informed that effective from next week, our service charge will be adjusted to <strong>NGN 100</strong> per order. This change is part of our commitment to maintaining high-quality service delivery.
          </div>
        </div>
      </div>
    </div>
    
    <div class="space-y-9">
      <!-- Welcome Card -->
      <div class="md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="relative h-64 bg-gradient-to-r from-amber-500 to-amber-300">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <h2 class="text-3xl font-bold text-white">WELCOME!</h2>
          </div>
          <div class="absolute bottom-0 left-0 right-0">
            <img 
              src="@/assets/img/meal2.jpg" 
              alt="Vendor" 
              class="w-full h-40 object-cover object-top"
            />
          </div>
          <div class="absolute top-4 left-4 bg-white rounded-full p-1 shadow-md">
            <img 
              src="@/assets/img/meal2.jpg" 
              alt="Vendor" 
              class="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-4 bg-gray-100 rounded-md p-2">
            <div class="text-sm text-gray-600 truncate flex-1">
              <p class="text-gray-700 text-sm truncate">{{ restaurantUrl }}</p>
            </div>
            <button @click="copyToClipboard(restaurantUrl)" class="p-1 text-gray-500 hover:text-orange-500 transition-colors duration-300 transform hover:scale-110">
              <Copy class="h-5 w-5" />
            </button>
          </div>
          
          <button 
            :class="[
              'w-full py-2 px-4 rounded-md text-white font-medium transition-colors flex items-center justify-center',
              vendor?.isStoreOpen ? 'bg-teal-500 hover:bg-teal-600' : 'bg-amber-500 hover:bg-amber-600',
              (closing || opening) ? 'opacity-75 cursor-not-allowed' : ''
            ]"
            @click="handleStoreStatusToggle"
            :disabled="closing || opening"
          >
            <template v-if="closing || opening">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ closing ? 'Closing...' : 'Opening...' }}
            </template>
            <template v-else>
              {{ vendor?.isStoreOpen ? 'Close Store' : 'Open Store' }}
            </template>
          </button>
          
          <div class="mt-4 text-sm text-gray-600">
            <p>Kindly follow us on <a href="#" class="text-blue-500 hover:underline">instagram</a> and <a href="#" class="text-blue-500 hover:underline">twitter</a>, we promise to follow back.</p>
          </div>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="text-sm font-medium text-gray-500">Wallet Balance</h3>
            <Wallet class="h-4 w-4 text-gray-500" />
          </div>
          <div class="text-2xl font-bold">₦{{wallet?.balance ?? 0}}</div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="text-sm font-medium text-gray-500">Total Menus</h3>
            <Clipboard class="h-4 w-4 text-gray-500" />
          </div>
          <div class="text-2xl font-bold">{{menus?.data?.length ?? 0}}</div>
        </div>
        
        <div class="bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-row items-center justify-between pb-2">
            <h3 class="text-sm font-medium text-gray-500">Today's Orders</h3>
            <ShoppingBag class="h-4 w-4 text-gray-500" />
          </div>
          <div class="text-2xl font-bold">{{ordersList?.length ?? 0}}</div>
        </div>
      </div>
    </div>
    
    <!-- Monthly Analysis -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Monthly Analysis</h3>
      </div>
      <div class="p-4">
        <BarChart />
      </div>
    </div>
    
    <!-- Security Tips -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="p-4 border-b">
        <h3 class="text-lg font-medium">Security Tips</h3>
      </div>
      <div class="p-4">
        <ul class="space-y-3 list-disc pl-5">
          <li class="text-gray-700">
            Verify payments personally before dispatching any orders, irrespective of customer's perceive urgency.
          </li>
          <li class="text-gray-700">
            When a customer claims to have made an online payment, validate the transaction through your <a href="#" class="text-blue-500 hover:underline">transaction link</a> to ensure accuracy.
          </li>
          <li class="text-gray-700">
            Always click the accept button for orders that comes from the mobile app before processing, as customers can still cancel orders not yet accepted by you.
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Close Store Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showCloseStoreModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
          <div class="p-4 border-b">
            <h3 class="text-lg font-medium">Close Your Store?</h3>
            <p class="text-sm text-gray-500">Your store will be temporarily unavailable to customers.</p>
          </div>
          
          <div class="flex justify-center py-6">
            <div class="relative w-48 h-48">
              <svg viewBox="0 0 200 200" class="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#FEF2F2" />
                <path d="M100 50C72.4 50 50 72.4 50 100C50 127.6 72.4 150 100 150C127.6 150 150 127.6 150 100C150 72.4 127.6 50 100 50ZM100 140C78 140 60 122 60 100C60 78 78 60 100 60C122 60 140 78 140 100C140 122 122 140 100 140Z" fill="#EF4444" />
                <path d="M120 80L80 120" stroke="#EF4444" stroke-width="8" stroke-linecap="round" />
                <path d="M80 80L120 120" stroke="#EF4444" stroke-width="8" stroke-linecap="round" />
                
                <!-- Animated elements -->
                <g class="animate-bounce" style="transform-origin: center; animation-duration: 2s;">
                  <circle cx="50" cy="50" r="10" fill="#F97316" />
                </g>
                <g class="animate-bounce" style="transform-origin: center; animation-duration: 1.5s; animation-delay: 0.5s;">
                  <circle cx="150" cy="50" r="10" fill="#F97316" />
                </g>
                <g class="animate-bounce" style="transform-origin: center; animation-duration: 2.5s; animation-delay: 0.2s;">
                  <circle cx="150" cy="150" r="10" fill="#F97316" />
                </g>
                <g class="animate-bounce" style="transform-origin: center; animation-duration: 1.8s; animation-delay: 0.7s;">
                  <circle cx="50" cy="150" r="10" fill="#F97316" />
                </g>
              </svg>
              
              <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div class="text-center">
                  <ShoppingBag class="h-12 w-12 text-red-500 mx-auto mb-2" />
                  <p class="text-sm font-medium text-gray-600">Store Closing</p>
                </div>
              </div>
            </div>
          </div>
          
          <p class="text-center text-sm text-gray-500 px-4">
            You can reopen your store at any time. While closed, customers won't be able to place orders.
          </p>
          
          <div class="flex justify-center space-x-2 p-4 border-t mt-4">
            <button 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              @click="showCloseStoreModal = false"
              :disabled="closing"
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
              @click="confirmCloseStore"
              :disabled="closing"
            >
              <template v-if="closing">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Closing...
              </template>
              <template v-else>
                <X size="16" />
                Close Store
              </template>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Animated Copy Modal -->
    <AnimatedCopyModal
      :is-visible="showCopyModal"
      :copied-content="copiedUrl"
      title="URL Copied Successfully!"
      message="Share your restaurant link with customers"
      button-text="Awesome!"
      animation="bounce"
      :auto-close="true"
      :auto-close-time="5000"
      @close="closeCopyModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { 
  AlertTriangle, 
  Clipboard, 
  Copy, 
  ShoppingBag, 
  Wallet, 
  X 
} from 'lucide-vue-next';
import BarChart from '@/components/BarChart.vue';
import { useVendorWallet } from '@/composables/modules/vendor/useVendorWallet'
import { useFetchMenu } from '@/composables/modules/menu/useFetchMenu'
import { useCloseStore } from "@/composables/modules/vendor/useCloseStore"
import { useOpenStore } from "@/composables/modules/vendor/useOpenStore"
import { useFetchVendorTodaysOrder } from '@/composables/modules/order/useFetchTodaysOrders'
import { useUpdateProfile } from '@/composables/modules/customer/useUpdateProfile'
import { useRestaurantUrl } from '@/composables/useRestaurantUrl'
import AnimatedCopyModal from '@/components/AnimatedCopyModal.vue'
import { useUser } from '@/composables/auth/user'
import { useFetchVendorById } from "@/composables/modules/vendor/useFetchVendorById";

// Interface for profile data
interface ProfileData {
  imageUrl: string;
  restaurantName: string;
  email: string;
  phoneNumber: string;
  locationName: string;
  description: string;
  tags: string[];
  openingHours: string;
}

// Composables
const { menus, fetchMenu, loading } = useFetchMenu()
const { wallet, loading: fetchingWallet } = useVendorWallet()
const { closeStore, loading: closing } = useCloseStore()
const { openStore, loading: opening } = useOpenStore()
const { ordersList, loading: fetchingTodaysOrders } = useFetchVendorTodaysOrder()
const { vendor } = useFetchVendorById(); // Added vendor composable

// Get user data from composable
const { user } = useUser()
const { updateProfile, loading: isUpdating } = useUpdateProfile()

// State
const isEditing = ref(false)
const imageFileName = ref('')
const tagsInput = ref('')
const showCopyModal = ref(false)
const copiedUrl = ref('')
const showCloseStoreModal = ref(false)

// Initialize the URL composable
const { getRestaurantUrl } = useRestaurantUrl()

// Computed URL based on restaurant name
const restaurantUrl = computed(() => {
  return getRestaurantUrl(user.value?.restaurantName || 'restaurant')
})

// Initialize profile data with empty values
const profileData = reactive<ProfileData>({
  imageUrl: '',
  restaurantName: '',
  email: '',
  phoneNumber: '',
  locationName: '',
  description: '',
  tags: [],
  openingHours: ''
})

// Copy URL to clipboard with animated modal
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  copiedUrl.value = text
  showCopyModal.value = true
}

// Close copy modal
const closeCopyModal = () => {
  showCopyModal.value = false
}

// Handle store status toggle
const handleStoreStatusToggle = () => {
  if (vendor.value?.isStoreOpen) {
    showCloseStoreModal.value = true
  } else {
    handleOpenStore()
  }
}

// Handle close store confirmation
const confirmCloseStore = async () => {
  try {
    await closeStore()
    // The vendor object should be updated automatically if the API is reactive
    // If not, you might need to refetch the vendor data
  } catch (error) {
    console.error('Failed to close store:', error)
    // Handle error (could show a toast notification here)
  } finally {
    showCloseStoreModal.value = false
  }
}

// Handle open store
const handleOpenStore = async () => {
  try {
    await openStore()
    // The vendor object should be updated automatically if the API is reactive
    // If not, you might need to refetch the vendor data
  } catch (error) {
    console.error('Failed to open store:', error)
    // Handle error (could show a toast notification here)
  }
}

// Watch for user data changes and update profile data
watch(() => user.value, (newUser) => {
  if (newUser) {
    // Update profile data with user data
    profileData.restaurantName = newUser.restaurantName || ''
    profileData.email = newUser.email || ''
    profileData.phoneNumber = newUser.phoneNumber || ''
    profileData.locationName = newUser.locationName || ''
    
    // If we have additional fields in the user object, map them too
    if (newUser.description) profileData.description = newUser.description
    if (newUser.imageUrl) profileData.imageUrl = newUser.imageUrl
    if (newUser.tags) profileData.tags = newUser.tags
    if (newUser.openingHours) profileData.openingHours = newUser.openingHours
  }
}, { immediate: true, deep: true })

definePageMeta({
  layout: 'dashboard'
})
</script>