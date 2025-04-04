<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Vendor Header -->
      <div class="relative">
        <!-- {{vendorObject}} -->
         <!-- {{menus}} -->
        <div class="h-40 bg-gradient-to-r from-red-600 to-red-800"></div>
        <div class="container px-4 md:px-6 relative -mt-16">
          <div class="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div class="w-20 h-20 rounded-xl overflow-hidden border-4 border-white shadow-sm">
              <img 
                :src="vendor?.image || '/placeholder.svg?height=80&width=80'" 
                :alt="vendor?.name" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <h1 class="text-xl font-bold">{{ vendorObject?.restaurantName || 'Loading...' }}</h1>
              <p class="text-gray-600">{{ vendor?.description || '' }}</p>
              <div class="flex items-center mt-1">
                <div class="flex">
                  <Star v-for="i in 5" :key="i" :class="i <= (vendor?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'" size="16" />
                </div>
                <span class="ml-1 text-sm text-gray-600">{{ vendor?.rating || '0.0' }} ({{ vendor?.reviewCount || '0' }} reviews)</span>
              </div>
            </div>
            <div class="flex items-center gap-2 self-end md:self-center">
            <button 
              @click="callVendor"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 hover:scale-110 transform"
              :class="{'animate-pulse': isCallButtonAnimating}"
            >
              <Phone size="18" />
            </button>
            <button 
              @click="showShareModal = true"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 hover:scale-110 transform"
            >
              <Share2 size="18" />
            </button>
            <button 
              @click="toggleFavoriteVendor"
              class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 hover:scale-110 transform"
              :class="{'text-red-500': isVendorFavorite}"
            >
              <Heart size="18" :fill="isVendorFavorite ? 'currentColor' : 'none'" />
            </button>
          </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="container px-4 md:px-6 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Menu Categories and Items -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-md p-4 mb-6">
              <div class="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                <button 
                  v-for="category in menuCategories" 
                  :key="category.id"
                  @click="activeCategory = category.id"
                  class="px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200"
                  :class="activeCategory === category.id ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
            
            <div v-if="isLoading" class="flex justify-center py-10">
              <div class="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            <div v-else-if="menuItems.length === 0" class="bg-white rounded-xl shadow-md p-8 text-center">
              <div class="flex justify-center mb-4">
                <Pizza class="text-gray-400" size="48" />
              </div>
              <h3 class="text-lg font-semibold">No Menu Items Available</h3>
              <p class="text-gray-600 mt-2">This vendor hasn't added any menu items yet.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="item in filteredMenuItems" 
                :key="item.id"
                class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div class="flex flex-col sm:flex-row">
                  <div class="sm:w-1/3 h-48 sm:h-auto">
                    <img 
                      :src="item.image || '/placeholder.svg?height=200&width=200'" 
                      :alt="item.name" 
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex-1 p-4 flex flex-col">
                    <div>
                      <div class="flex justify-between items-start">
                        <h3 class="font-bold text-lg">{{ item.name }}</h3>
                        <span class="font-bold text-red-600">₦{{ formatPrice(item.price) }}</span>
                      </div>
                      <p class="text-gray-600 text-sm mt-1 line-clamp-2">{{ item.description }}</p>
                      
                      <div class="flex flex-wrap gap-2 mt-2">
                        <span 
                          v-for="tag in item.tags" 
                          :key="tag"
                          class="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="mt-auto pt-4 flex justify-between items-center">
                      <div class="flex items-center">
                        <button 
                          v-if="getCartItemQuantity(item.id) > 0"
                          @click="decrementCartItem(item)"
                          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                        >
                          <Minus size="16" class="text-gray-700" />
                        </button>
                        
                        <span v-if="getCartItemQuantity(item.id) > 0" class="w-8 text-center font-medium">
                          {{ getCartItemQuantity(item.id) }}
                        </span>
                        
                        <button 
                          @click="addToCart(item)"
                          :class="getCartItemQuantity(item.id) > 0 ? 'w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200' : 'px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white'"
                          class="flex items-center justify-center transition-all duration-200"
                        >
                          <Plus size="16" :class="getCartItemQuantity(item.id) > 0 ? 'text-gray-700' : 'text-white'" />
                          <span v-if="getCartItemQuantity(item.id) === 0" class="ml-1">Add</span>
                        </button>
                      </div>
                      
                      <button 
                        @click="toggleFavorite(item.id)"
                        class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        :class="{'text-red-500': item.isFavorite}"
                      >
                        <Heart size="18" :fill="item.isFavorite ? 'currentColor' : 'none'" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cart and Checkout -->
          <div class="lg:col-span-1">
            <div class="sticky top-4 space-y-4">
              <div v-if="cartItems.length > 0" class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="p-4 bg-red-600 text-white">
                  <h3 class="font-bold flex items-center">
                    <ShoppingCart size="18" class="mr-2" />
                    Your Order ({{ cartItems.length }})
                  </h3>
                </div>
                
                <div class="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                  <CartItem 
                    v-for="item in cartItems" 
                    :key="item.id" 
                    :item="item"
                    @update:quantity="updateCartItemQuantity"
                    @remove="removeFromCart"
                  />
                </div>
                
                <div class="p-4 bg-gray-50">
                  <OrderSummary 
                    :subtotal="cartSubtotal"
                    :service-fee="50"
                    :delivery-fee="deliveryFee"
                    :loading="false"
                    @checkout="showCheckoutForm = true"
                  />
                </div>
              </div>
              
              <div v-else class="bg-white rounded-xl shadow-md p-6 text-center">
                <div class="flex justify-center mb-4">
                  <ShoppingCart class="text-gray-400" size="48" />
                </div>
                <h3 class="text-lg font-semibold">Your cart is empty</h3>
                <p class="text-gray-600 mt-2">Add items from the menu to start your order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Checkout Modal -->
      <div 
        v-if="showCheckoutForm && cartItems.length > 0" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="font-bold">Checkout</h3>
            <button 
              @click="showCheckoutForm = false"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size="20" />
            </button>
          </div>
          
          <div class="p-4">
            <CheckoutForm 
              :loading="orderLoading" 
              :vendor-id="vendor?.id || ''"
              @submit="placeOrder"
            />
          </div>
        </div>
      </div>
      
      <!-- Order Confirmation Modal -->
      <div 
        v-if="showOrderConfirmation" 
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div class="p-4">
            <OrderConfirmation 
              :order="completedOrder"
              @continue-shopping="resetOrder"
            />
          </div>
        </div>
      </div>

          <!-- Share Modal -->
    <ShareModal 
      :is-open="showShareModal" 
      :vendor="vendor || {}" 
      @close="showShareModal = false" 
    />
    
    <!-- Toast Notification -->
    <div 
      v-if="showToast" 
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg z-50 animate-toast"
    >
      {{ toastMessage }}
    </div>

    </div>
  </template>
  

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Star, Phone, Share2, Heart, Minus, Plus, ShoppingCart, X } from 'lucide-vue-next';
import { useCreateOrder } from '@/composables/modules/order/useCreateOrder';
import CartItem from '@/components/CartItems.vue';
import OrderSummary from '@/components/OrderSummary.vue';
import CheckoutForm from '@/components/CheckoutForm.vue';
import OrderConfirmation from '@/components/OrderConfirmation.vue';
import { useFetchVendorById } from '@/composables/modules/vendor/useFetchVendorById'
import ShareModal from '@/components/ShareModal.vue';

const route = useRoute();
const vendorId = route.params.id as string;
const { vendor: vendorObject, loading: fetchingVendorDetails } = useFetchVendorById()
import { useFetchVendorMenu } from '@/composables/modules/menu/useFetchVendorMenu'

// Vendor data - initialize with default values
const vendor = ref({
  id: vendorId,
  name: "Mama's Kitchen",
  description: "Authentic Nigerian cuisine with a modern twist",
  image: "/placeholder.svg?height=80&width=80",
  rating: 4.7,
  reviewCount: 128,
  phoneNumber: "+2348147626503"
});
const isLoading = ref(false);
const isVendorFavorite = ref(false);
const isCallButtonAnimating = ref(false);

const { menus, loading: fetchingMenu } = useFetchVendorMenu()
// Menu categories and items
const menuCategories = ref<any[]>([]);
const menuItems = ref<any[]>([]);
const activeCategory = ref<string>('all');

// Cart state
const cartItems = ref<any[]>([]);
const deliveryFee = ref(200); // Example delivery fee
const showCheckoutForm = ref(false);
const orderLoading = ref(false);
const showOrderConfirmation = ref(false);
const showShareModal = ref(false);
const completedOrder = ref<any>({
  id: '',
  vendorName: '',
  totalAmount: 0,
  deliveryType: '',
  vendorPhone: ''
});

// Toast notification
const showToast = ref(false);
const toastMessage = ref('');

const { createOrder, loading, error } = useCreateOrder();

// Computed properties
const cartSubtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const filteredMenuItems = computed(() => {
  if (activeCategory.value === 'all') {
    return menuItems.value;
  }
  return menuItems.value.filter(item => item.categoryId === activeCategory.value);
});

// Methods
const formatPrice = (price: number) => {
  return price.toLocaleString('en-NG');
};

const getCartItemQuantity = (itemId: string) => {
  const item = cartItems.value.find(item => item.id === itemId);
  return item ? item.quantity : 0;
};

const addToCart = (item: any) => {
  const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    // Show toast notification
    showToastNotification(`${item.name} added to cart`);
  }
};

const decrementCartItem = (item: any) => {
  const existingItem = cartItems.value.find(cartItem => cartItem.id === item.id);
  
  if (existingItem && existingItem.quantity > 1) {
    existingItem.quantity -= 1;
  } else if (existingItem && existingItem.quantity === 1) {
    removeFromCart(item.id);
  }
};

const updateCartItemQuantity = (itemId: string, quantity: number) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    item.quantity = quantity;
  }
};

const removeFromCart = (itemId: string) => {
  const item = cartItems.value.find(item => item.id === itemId);
  if (item) {
    showToastNotification(`${item.name} removed from cart`);
  }
  cartItems.value = cartItems.value.filter(item => item.id !== itemId);
};

const toggleFavorite = (itemId: string) => {
  const item = menuItems.value.find(item => item.id === itemId);
  if (item) {
    item.isFavorite = !item.isFavorite;
    showToastNotification(item.isFavorite ? `${item.name} added to favorites` : `${item.name} removed from favorites`);
  }
};

const toggleFavoriteVendor = () => {
  isVendorFavorite.value = !isVendorFavorite.value;
  showToastNotification(isVendorFavorite.value ? 
    `${vendor.value.name} added to favorites` : 
    `${vendor.value.name} removed from favorites`);
};

const callVendor = () => {
  if (vendorObject.value && vendorObject?.value.phoneNumber) {
    isCallButtonAnimating.value = true;
    
    setTimeout(() => {
      isCallButtonAnimating.value = false;
      window.location.href = `tel:${vendorObject?.value?.phoneNumber}`;
    }, 1000);
  }
};

const showToastNotification = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const placeOrder = async (formData: any) => {
  if (cartItems.value.length === 0) return;
  
  orderLoading.value = true;
  
  try {
    // Prepare order payload
    const orderPayload = {
      vendorId: vendor.value.id,
      phoneNumber: formData.phoneNumber,
      deliveryType: formData.deliveryType,
      location: formData.location || '',
      address: formData.address || '',
      items: cartItems.value.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity
      })),
      notes: formData.notes || ''
    };
    
    // Simulate API call with a successful response
    // In a real app, this would be the createOrder API call
    // const response = await createOrder(orderPayload);
    
    // For testing purposes, we'll simulate a successful response
    setTimeout(() => {
      const simulatedResponse = {
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        status: 'success',
        message: 'Order created successfully'
      };
      
      // Show confirmation
      completedOrder.value = {
        id: simulatedResponse.id,
        vendorName: vendor.value.name,
        totalAmount: cartSubtotal.value + 50 + (formData.deliveryType === 'delivery' ? deliveryFee.value : 0),
        deliveryType: formData.deliveryType,
        vendorPhone: vendor.value.phoneNumber?.replace(/\s/g, '') || ''
      };
      
      showCheckoutForm.value = false;
      showOrderConfirmation.value = true;
      
      // Generate WhatsApp message for vendor
      if (vendor.value.phoneNumber) {
        generateWhatsAppMessage(orderPayload, simulatedResponse.id);
      }
      
      orderLoading.value = false;
    }, 2000); // Simulate 2 second delay for API call
    
  } catch (err) {
    console.error('Error placing order:', err);
    orderLoading.value = false;
  }
};

const generateWhatsAppMessage = (orderData: any, orderId: string) => {
  // Format the order details for WhatsApp
  let message = `🔔 *NEW ORDER #${orderId}*\n\n`;
  message += `📱 *Customer Phone:* ${orderData.phoneNumber}\n`;
  message += `🚚 *Delivery Type:* ${orderData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}\n`;
  
  if (orderData.deliveryType === 'delivery') {
    message += `📍 *Location:* ${orderData.location}\n`;
    message += `🏠 *Address:* ${orderData.address}\n`;
  }
  
  message += `\n*📋 ORDER ITEMS:*\n`;
  
  // Add each item
  cartItems.value.forEach(item => {
    message += `- ${item.quantity}x ${item.name} (₦${formatPrice(item.price * item.quantity)})\n`;
  });
  
  // Add totals
  message += `\n*💰 PAYMENT DETAILS:*\n`;
  message += `Subtotal: ₦${formatPrice(cartSubtotal.value)}\n`;
  message += `Service Fee: ₦50\n`;
  
  if (orderData.deliveryType === 'delivery') {
    message += `Delivery Fee: ₦${formatPrice(deliveryFee.value)}\n`;
  }
  
  const total = cartSubtotal.value + 50 + (orderData.deliveryType === 'delivery' ? deliveryFee.value : 0);
  message += `*TOTAL: ₦${formatPrice(total)}*\n`;
  
  if (orderData.notes) {
    message += `\n*📝 NOTES:*\n${orderData.notes}\n`;
  }
  
  // Send to vendor's WhatsApp
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${vendor.value.phoneNumber?.replace(/\s/g, '')}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};

const resetOrder = () => {
  showOrderConfirmation.value = false;
  cartItems.value = [];
};

// Fetch vendor and menu data
onMounted(() => {
  console.log('Vendor page mounted with ID:', vendorId);
  
  // Menu categories and items are loaded immediately for testing
  menuCategories.value = [
    { id: 'all', name: 'All' },
    { id: 'popular', name: 'Popular' },
    { id: 'mains', name: 'Main Dishes' },
    { id: 'sides', name: 'Side Dishes' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' }
  ];
  
  menuItems.value = [
    {
      id: '67ec78d505e1781d34769e46',
      name: 'Jollof Rice with Chicken',
      description: 'Spicy Nigerian jollof rice served with grilled chicken and plantains',
      price: 2500,
      image: '/placeholder.svg?height=200&width=200',
      categoryId: 'mains',
      tags: ['Spicy', 'Popular'],
      isFavorite: false
    },
    {
      id: '67ec78e705e1781d34769e4b',
      name: 'Egusi Soup with Pounded Yam',
      description: 'Traditional Nigerian soup made with ground melon seeds and served with pounded yam',
      price: 3000,
      image: '/placeholder.svg?height=200&width=200',
      categoryId: 'mains',
      tags: ['Traditional', 'Soup'],
      isFavorite: false
    },
    {
      id: '67ec791705e1781d34769e59',
      name: 'Suya Platter',
      description: 'Spicy grilled beef skewers served with onions and tomatoes',
      price: 2000,
      image: '/placeholder.svg?height=200&width=200',
      categoryId: 'popular',
      tags: ['Spicy', 'Grilled'],
      isFavorite: false
    },
    {
      id: '4',
      name: 'Chapman Drink',
      description: 'Refreshing Nigerian cocktail made with Grenadine, Fanta, and Sprite',
      price: 800,
      image: '/placeholder.svg?height=200&width=200',
      categoryId: 'drinks',
      tags: ['Cold', 'Sweet'],
      isFavorite: false
    },
    {
      id: '5',
      name: 'Fried Plantains',
      description: 'Sweet ripe plantains, fried to golden perfection',
      price: 500,
      image: '/placeholder.svg?height=200&width=200',
      categoryId: 'sides',
      tags: ['Sweet', 'Vegetarian'],
      isFavorite: false
    }
  ];
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-scaleIn {
  animation: scaleIn 0.4s ease-out;
}

.animate-slideDown {
  animation: slideDown 0.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

.animate-slideLeft {
  animation: slideLeft 0.5s ease-out;
}

.animate-pulse {
  animation: pulse 1s infinite;
}

.animate-toast {
  animation: toast 0.3s ease-out forwards, fadeOut 0.3s ease-in forwards 2.7s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes toast {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>

