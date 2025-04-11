<template>
  <section class="my-10">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold">All Vendors</h2>
      <a href="#" class="text-red-700 hover:text-red-800 flex items-center transition-colors duration-300">
        View all
        <ChevronRight size="20" />
      </a>
    </div>
    
    <div class="relative mb-6">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search food or vendor" 
        class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        @input="handleSearch"
      />
      <Search 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        :class="{'text-red-500': isSearching}"
        size="20" 
      />
      
      <!-- Animated search spinner -->
      <div v-if="isSearching" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <div class="flex items-center space-x-2">
          <div class="relative">
            <div class="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <Pizza class="text-orange-500" size="12" />
            </div>
          </div>
          <span class="text-sm text-gray-500">Searching...</span>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="py-10">
      <div :class="'py-10'" class="flex flex-col items-center justify-center">
        <div class="relative">
          <div class="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Pizza class="text-orange-500" size="20" />
          </div>
        </div>
        <p class="mt-4 text-gray-600">Loading vendors...</p>
      </div>
    </div>
    
    <!-- Search Results -->
    <div v-else-if="searchQuery && !isSearching">
      <div v-if="filteredVendors.length > 0">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            v-for="vendor in filteredVendors" 
            :key="vendor._id"
            @click="router.push(`/vendors/${vendor._id}`)"
            class="bg-white cursor-pointer border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="relative cursor-pointer">
              <img :src="vendor.displayImage" :alt="vendor.restaurantName" class="w-full h-48 cursor-pointer object-cover" />
              <div class="absolute top-2 right-2 flex space-x-2">
                <button class="bg-white rounded-full p-1.5 shadow-sm transition-transform duration-300 hover:scale-110">
                  <Heart size="18" :class="favoriteVendors[vendor._id] ? 'text-red-500 fill-red-500' : 'text-gray-600'" @click="toggleFavorite(vendor._id)" />
                </button>
              </div>
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <!-- <span v-if="vendor.isStoreOpen" class="text-xs px-2 py-1 bg-green-500 text-white rounded-full">Open</span> -->
                <div  v-if="vendor.isStoreOpen" class="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
                  <CheckCircle size="14" class="mr-1" />
                  Opensss
                </div>
                <span v-else class="text-xs px-2 py-1 bg-red-500 text-white rounded-full">Closed</span>
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-lg">{{ vendor.restaurantName }}</h3>
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ getVendorDescription(vendor) }}</p>
              
              <div class="mt-3 flex items-center">
                <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ vendor.category }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ formatLocation(vendor.locationName) }}</span>
              </div>
              
              <div class="mt-4 flex justify-between items-center">
                <a href="#" class="text-sm text-red-700 hover:text-red-800 font-medium">View Menu</a>
                <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm transition-colors duration-300">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="py-10 text-center">
          <div class="relative max-w-xs mx-auto mb-6">
            <img src="/illustrations/no-results.svg" alt="Empty state illustration" class="w-full" />
            <Pizza class="absolute top-0 right-0 text-red-500" size="32" />
            <Coffee class="absolute bottom-0 left-0 text-orange-500" size="32" />
          </div>
          <h3 class="text-xl font-bold mb-2">No results found</h3>
          <p class="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any vendors matching '{{ searchQuery }}'</p>
          
          <div class="max-w-3xl mx-auto">
            <h3 class="text-xl font-bold mb-4">You may also like</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
              <div 
                v-for="vendor in suggestedVendors" 
                :key="vendor._id" 
                 @click="router.push(`/vendors/${vendor._id}`)"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div class="relative">
                  <img :src="vendor?.displayImage" :alt="vendor.restaurantName" class="w-full h-32 object-cover" />
                  <div class="absolute top-2 right-2">
                    <button class="bg-white rounded-full p-1.5 shadow-sm transition-transform duration-300 hover:scale-110">
                      <Heart size="18" :class="favoriteVendors[vendor._id] ? 'text-red-500 fill-red-500' : 'text-gray-600'" @click="toggleFavorite(vendor._id)" />
                    </button>
                  </div>
                </div>
                <div class="p-3">
                  <h4 class="font-bold">{{ vendor.restaurantName }}</h4>
                  <p class="text-sm text-gray-500">{{ getVendorDescription(vendor) }}</p>
                  <div class="flex items-center mt-2">
                    <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ vendor.category }}</span>
                    <span v-if="vendor.isStoreOpen" class="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Open</span>
                    <span v-else class="ml-2 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- All Vendors Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="vendor in vendors" 
        :key="vendor._id"
        @click="handleSelectedVendor(vendor)"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="relative">
          <img :src="vendor?.displayImage" :alt="vendor.restaurantName" class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2 flex space-x-2">
            <button class="bg-white rounded-full p-1.5 shadow-sm transition-transform duration-300 hover:scale-110">
              <Heart size="18" :class="favoriteVendors[vendor._id] ? 'text-red-500 fill-red-500' : 'text-gray-600'" @click="toggleFavorite(vendor._id)" />
            </button>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <!-- <span v-if="vendor.isStoreOpen" class="text-xs px-2 py-1 bg-green-500 text-white rounded-full">Open sss</span> -->
            <div v-if="vendor.isStoreOpen" class="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded flex items-center">
              <CheckCircle size="14" class="mr-1" />
              Open
            </div>
            <span v-else class="text-xs px-2 py-1 bg-red-500 text-white rounded-full">Closed</span>
          </div>
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-lg">{{ vendor.restaurantName }}</h3>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ getVendorDescription(vendor) }}</p>
          
          <div class="mt-3 flex items-center">
            <span class="text-xs px-2 py-1 bg-gray-100 rounded-full">{{ vendor.category }}</span>
            <span class="ml-2 text-xs text-gray-500">{{ formatLocation(vendor.locationName) }}</span>
          </div>
          
          <!-- <div class="mt-4 flex justify-between items-center">
            <a href="#" class="text-sm text-red-700 hover:text-red-800 font-medium">View Menu</a>
            <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl text-sm transition-colors duration-300">
              Order Now
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { ChevronRight, Search, Heart, CheckCircle, Star, Pizza, Coffee } from 'lucide-vue-next';
import { useFetchVendors } from '@/composables/modules/vendor/useFetchVendors'
const router = useRouter()

// Define the vendor interface based on the backend structure
interface Vendor {
  _id: string;
  restaurantName: string;
  email: string;
  phoneNumber: string;
  locationName: string;
  address: string;
  category: string;
  isStoreOpen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


const { vendors, loading: isLoading } = useFetchVendors();

const searchQuery = ref('');
const isSearching = ref(false);
// const isLoading = ref(false);
const searchTimeout = ref<number | null>(null);
const favoriteVendors = reactive<Record<string, boolean>>({});

const handleSearch = () => {
  isSearching.value = true;
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = window.setTimeout(() => {
    isLoading.value = true;
    
    // Simulate API call delay
    setTimeout(() => {
      isSearching.value = false;
      isLoading.value = false;
    }, 1500);
  }, 500);
};

const toggleFavorite = (vendorId: string) => {
  favoriteVendors[vendorId] = !favoriteVendors[vendorId];
};

// Helper function to get a description for a vendor
const getVendorDescription = (vendor: Vendor): string => {
  return `${vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)} at ${vendor.locationName}`;
};

// Helper function to get an image based on category
const getVendorImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    'fast food': '/images/categories/fast-food.jpg',
    'restaurant': '/images/categories/restaurant.jpg',
    'cafe': '/images/categories/cafe.jpg',
    'bakery': '/images/categories/bakery.jpg',
  };
  
  return categoryImages[category.toLowerCase()] || '/images/categories/default.jpg';
};

// Helper function to format location
const formatLocation = (location: string): string => {
  return location.length > 20 ? location.substring(0, 20) + '...' : location;
};

const filteredVendors = computed(() => {
  if (!searchQuery.value) return vendors.value;
  
  const query = searchQuery.value.toLowerCase();
  
  return vendors.value.filter((vendor: Vendor) => 
    vendor.restaurantName.toLowerCase().includes(query) ||
    vendor.category.toLowerCase().includes(query) ||
    vendor.locationName.toLowerCase().includes(query) ||
    vendor.address.toLowerCase().includes(query)
  );
});

const suggestedVendors = computed(() => {
  // Since we don't have ratings, we'll just return random vendors
  return [...vendors.value]
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);
});

const handleSelectedVendor = (vendor: any) => {
  localStorage.setItem('selected-vendor', JSON.stringify(vendor))
  router.push(`/vendors/${vendor._id}`)
}
</script>

