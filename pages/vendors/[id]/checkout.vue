<template>
  <div class="min-h-screen bg-gray-50 pb-10">
    <div class="container mx-auto px-4 py-6">
      <!-- Header with back button -->
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="px-3 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl transition-all duration-300 mr-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Back
        </button>
        <h1 class="text-2xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div class="flex flex-col md:flex-row gap-6">
        <!-- Order Details Section -->
        <div class="w-full md:w-2/3">
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-800 flex items-center">
                <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
                Order Details
              </h2>
              <span
                class="text-sm bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-medium animate-pulse"
                v-if="cart.totalItems.value > 0"
              >
                {{ cart.totalItems.value }} items
              </span>
            </div>

            <div
              v-if="cart.loading.value"
              class="flex justify-center items-center py-8"
            >
              <div
                class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"
              ></div>
            </div>

            <div
              v-else-if="cart.totalItems.value === 0"
              class="text-center py-8"
            >
              <ShoppingCartIcon
                class="h-12 w-12 mx-auto text-gray-300 mb-3 animate-bounce-slow"
              />
              <p class="text-gray-500 mb-4">Your cart is empty</p>
              <button
                @click="goBack"
                class="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-xl transition-colors transform hover:scale-105"
              >
                Go back to menu
              </button>
            </div>

            <div
              v-else
              class="space-y-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div
                v-for="(pack, packIndex) in cart.packs.value"
                :key="pack.id"
                class="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors"
                :class="{ 'animate-fade-in': true }"
                :style="{ animationDelay: `${packIndex * 0.1}s` }"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3
                    class="text-lg font-semibold text-gray-800 flex items-center"
                  >
                    <span
                      :class="
                        pack.items.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                      "
                      class="w-2 h-2 rounded-full mr-2"
                    ></span>
                    Pack {{ packIndex + 1 }}
                  </h3>
                  <span class="text-sm text-gray-500"
                    >{{ pack.items.length }} items</span
                  >
                </div>

                <div
                  v-for="(item, itemIndex) in pack.items"
                  :key="item.id"
                  class="flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-xl transition-colors animate-slide-in"
                  :style="{
                    animationDelay: `${packIndex * 0.1 + itemIndex * 0.05}s`,
                  }"
                >
                  <div class="flex items-center">
                    <div
                      class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <!-- <img :src="getMealImage(item.mealId)" :alt="item.name" class="w-full h-full object-cover" /> -->
                      <img
                        src="@/assets/img/meal1.jpg"
                        :alt="item.name"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="ml-4">
                      <h4 class="font-medium text-gray-800">{{ item.name }}</h4>
                      <p class="text-sm text-gray-600">
                        ₦{{ formatPrice(item.price) }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center">
                    <div
                      class="flex items-center bg-gray-100 rounded-xl overflow-hidden"
                    >
                      <button
                        @click="decrementItemQuantity(packIndex, itemIndex)"
                        class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <MinusIcon class="h-4 w-4" />
                      </button>
                      <div class="w-10 text-center">
                        {{ item.quantity }}
                      </div>
                      <button
                        @click="incrementItemQuantity(packIndex, itemIndex)"
                        class="w-8 h-8 flex items-center justify-center bg-orange-400 text-white hover:bg-orange-500 transition-colors"
                      >
                        <PlusIcon class="h-4 w-4" />
                      </button>
                    </div>

                    <div class="ml-4 text-right">
                      <p class="font-medium text-gray-800">
                        ₦{{ formatPrice(item.price * item.quantity) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  v-if="pack.note"
                  class="mt-2 text-sm italic text-gray-600 bg-gray-50 p-3 rounded-xl"
                >
                  <span class="font-medium">Note:</span> {{ pack.note }}
                </div>

                <button
                  @click="openPackNoteModal(packIndex)"
                  class="mt-3 text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center transform hover:translate-x-1"
                >
                  <PencilIcon class="h-3 w-3 mr-1" />
                  {{ pack.note ? "Edit" : "Add" }} note
                </button>
              </div>
            </div>
          </div>

          <!-- Order Summary for Mobile -->
          <div
            class="md:hidden mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-100"
          >
            <h3 class="font-semibold text-gray-800 mb-3">Order Summary</h3>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium"
                  >₦{{ formatPrice(cart.subtotal.value) }}</span
                >
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Delivery</span>
                <span class="font-medium">₦{{ formatPrice(deliveryFee) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Service Charge</span>
                <span class="font-medium"
                  >₦{{ formatPrice(serviceCharge) }}</span
                >
              </div>
              <div
                class="flex justify-between mt-4 pt-4 border-t border-gray-200"
              >
                <span class="text-lg font-semibold">Grand Total</span>
                <span class="text-lg font-bold text-orange-600"
                  >₦{{ formatPrice(calculateGrandTotal()) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Details Section -->
        <div class="w-full md:w-1/3">
          <div
            class="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100"
          >
            <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <TruckIcon class="h-5 w-5 mr-2 text-orange-500" />
              Delivery Details
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Customer Name <span class="text-red-500">*</span></label
                >
                <input
                  v-model="customerName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Name"
                />
                <p
                  v-if="validationErrors.customerName"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.customerName}}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Phone Number <span class="text-red-500">*</span></label
                >
                <input
                  v-model="phoneNumber"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Phone Number"
                />
                <p
                  v-if="validationErrors.phoneNumber"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.phoneNumber }}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Location <span class="text-red-500">*</span></label
                >
                <div class="relative">
                  <select
                    v-model="location"
                    class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Location</option>
                    <option value="Oluwo">Oluwo</option>
                    <option value="Harmony">Harmony</option>
                    <option value="Isolu">Isolu</option>
                    <option value="FUNAAB">FUNAAB</option>
                  </select>
                  <ChevronDownIcon
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                  />
                </div>
                <p
                  v-if="validationErrors.location"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.location }}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Delivery Method <span class="text-red-500">*</span></label
                >
                <div class="grid grid-cols-2 gap-3 mt-2">
                  <div
                    @click="deliveryMethod = 'pickup'"
                    class="border rounded-xl p-3 cursor-pointer transition-all duration-300 flex flex-col items-center"
                    :class="
                      deliveryMethod === 'pickup'
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    "
                  >
                    <ShoppingBagIcon
                      class="h-6 w-6 mb-1"
                      :class="
                        deliveryMethod === 'pickup'
                          ? 'text-orange-500'
                          : 'text-gray-400'
                      "
                    />
                    <span
                      class="text-sm font-medium"
                      :class="
                        deliveryMethod === 'pickup'
                          ? 'text-orange-800'
                          : 'text-gray-600'
                      "
                      >Pickup</span
                    >
                    <span class="text-xs text-green-600 mt-1">Free</span>
                  </div>

                  <div
                    @click="deliveryMethod = 'delivery'"
                    class="border rounded-xl p-3 cursor-pointer transition-all duration-300 flex flex-col items-center"
                    :class="
                      deliveryMethod === 'delivery'
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    "
                  >
                    <TruckIcon
                      class="h-6 w-6 mb-1"
                      :class="
                        deliveryMethod === 'delivery'
                          ? 'text-orange-500'
                          : 'text-gray-400'
                      "
                    />
                    <span
                      class="text-sm font-medium"
                      :class="
                        deliveryMethod === 'delivery'
                          ? 'text-orange-800'
                          : 'text-gray-600'
                      "
                      >Delivery</span
                    >
                    <span class="text-xs text-gray-500 mt-1">₦700</span>
                  </div>
                </div>
              </div>

              <div v-if="deliveryMethod === 'delivery'">
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Delivery Address <span class="text-red-500">*</span></label
                >
                <textarea
                  v-model="deliveryAddress"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="A proper description of your address"
                ></textarea>
                <p
                  v-if="validationErrors.deliveryAddress"
                  class="mt-1 text-xs text-red-500"
                >
                  {{ validationErrors.deliveryAddress }}
                </p>
              </div>

              <div>
                <label class="block text-gray-600 mb-1 text-sm font-medium"
                  >Additional Notes</label
                >
                <textarea
                  v-model="additionalNotes"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  placeholder="Any additional instructions..."
                ></textarea>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="mt-8 border-t border-gray-200 pt-4 hidden md:block">
              <h3 class="font-semibold text-gray-800 mb-3">Order Summary</h3>

              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(cart.subtotal.value) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Delivery</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(deliveryFee) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">Service Charge</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(serviceCharge) }}</span
                  >
                </div>
                <div
                  class="flex justify-between mt-4 pt-4 border-t border-gray-200"
                >
                  <span class="text-lg font-semibold">Grand Total</span>
                  <span
                    class="text-lg font-bold text-orange-600 animate-pulse-slow"
                    >₦{{ formatPrice(calculateGrandTotal()) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div class="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="save-order"
                  v-model="saveOrder"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500"
                />
                <label for="save-order" class="ml-2 text-gray-600 text-sm"
                  >Save this order combination for future orders.</label
                >
              </div>

              <div class="flex gap-3">
                <button
                  @click="cancelOrder"
                  class="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 flex items-center justify-center transform hover:scale-98"
                >
                  <XCircleIcon class="h-5 w-5 mr-1" />
                  Cancel Order
                </button>
                <button
                  @click="submitOrder"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
                  :disabled="!isFormValid || orderLoading"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      !isFormValid || orderLoading,
                  }"
                >
                  <span v-if="orderLoading" class="flex items-center">
                    <span
                      class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    ></span>
                    Processing...
                  </span>
                  <template v-else>
                    <CheckIcon class="h-5 w-5 mr-1" />
                    Place Order
                  </template>
                </button>
              </div>

              <div
                v-if="error"
                class="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm"
              >
                <AlertTriangleIcon class="h-4 w-4 inline-block mr-1" />
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pack Note Modal -->
    <Teleport to="body">
      <div
        v-if="showPackNoteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closePackNoteModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ClipboardEditIcon class="h-5 w-5 mr-2 text-blue-500" />
              Add Note to Pack
            </h2>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Special Instructions:</label
              >
              <textarea
                v-model="packNote"
                rows="3"
                placeholder="E.g., Make it spicy, serve hot, etc."
                class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closePackNoteModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="savePackNote"
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Order Success Modal -->
    <Teleport to="body">
      <div
        v-if="showOrderSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6 text-center">
            <div
              class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-success-pop"
            >
              <CheckIcon class="h-10 w-10 text-green-500" />
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p class="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a
              confirmation shortly.
            </p>

      <div class="flex flex-col gap-3">
        <button
          @click="chatWithVendor"
          class="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Chat with Vendor
        </button>
        <button
          @click="goToHome"
          class="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
</div>
</Teleport>

    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useCart } from "~/composables/useCart";
import { useToast } from "~/composables/useToast";
import { useCreateOrder } from "@/composables/modules/order/useCreateOrder";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
  XCircleIcon,
  CheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  PencilIcon,
  ClipboardEditIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";
import ToastContainer from "~/components/ToastContainer.vue";
import { useCustomToast } from "@/composables/core/useCustomToast";

// Composables
const { showToast } = useCustomToast();
const router = useRouter();
const cart = useCart();
const toast = useToast();
const { createOrder, loading: orderLoading, error } = useCreateOrder();
const route = useRoute()

// State
const phoneNumber = ref("");
const customerName = ref("");
const location = ref("");
const deliveryAddress = ref("");
const deliveryMethod = ref("pickup");
const additionalNotes = ref("");
const saveOrder = ref(false);
const showPackNoteModal = ref(false);
const showOrderSuccessModal = ref(false);
const packNoteIndex = ref(0);
const packNote = ref("");
const validationErrors = ref({
  phoneNumber: "",
  customerName: "",
  location: "",
  deliveryAddress: "",
});
const orderSuccess = ref(false);
const orderIds = ref<string[]>([]);

// Constants
const serviceCharge = 50;
const deliveryFee = computed(() =>
  deliveryMethod.value === "delivery" ? 700 : 0
);

// Computed
const isFormValid = computed(() => {
  return (
    phoneNumber.value.trim() !== "" && customerName.value.trim() !== "" &&
    location.value !== "" &&
    (deliveryMethod.value === "pickup" ||
      deliveryAddress.value.trim() !== "") &&
    cart.totalItems.value > 0
  );
});

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

const calculateGrandTotal = (): number => {
  return cart.subtotal.value + deliveryFee.value + serviceCharge;
};

const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
  cart.incrementItemQuantity(packIndex, itemIndex);
};

const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
  cart.decrementItemQuantity(packIndex, itemIndex);
};

const openPackNoteModal = (index: number) => {
  packNoteIndex.value = index;
  packNote.value = cart.packs.value[index].note;
  showPackNoteModal.value = true;
};

const closePackNoteModal = () => {
  showPackNoteModal.value = false;
};

const savePackNote = () => {
  const success = cart.updatePackNote(packNoteIndex.value, packNote.value);
  if (success) {
    showToast({
      title: "Success",
      message: "Note saved successfully",
      toastType: "success",
      duration: 3000,
    });
    closePackNoteModal();
  }
};

const goBack = () => {
  router.push("/");
};

const goToHome = () => {
  showOrderSuccessModal.value = false;
  router.push("/");
};

const cancelOrder = () => {
  if (confirm("Are you sure you want to cancel your order?")) {
    cart.clearCart();
    router.push("/");
    showToast({
      title: "Success",
      message: "Order cancelled",
      toastType: "success",
      duration: 3000,
    });
  }
};

const validateForm = () => {
  let isValid = true;
  validationErrors.value = {
    phoneNumber: "",
    customerName: "",
    location: "",
    deliveryAddress: "",
  };

  if (!phoneNumber.value.trim()) {
    validationErrors.value.phoneNumber = "Phone number is required";
    isValid = false;
  } else if (!/^\+?[0-9]{10,15}$/.test(phoneNumber.value.trim())) {
    validationErrors.value.phoneNumber = "Please enter a valid phone number";
    isValid = false;
  }

  if (!location.value) {
    validationErrors.value.location = "Please select a location";
    isValid = false;
  }

  if (!customerName.value) {
    validationErrors.value.customerName = "Please Customer Name is required";
    isValid = false;
  }

  if (deliveryMethod.value === "delivery" && !deliveryAddress.value.trim()) {
    validationErrors.value.deliveryAddress = "Delivery address is required";
    isValid = false;
  }

  return isValid;
};

const submitOrder = async () => {
if (!validateForm()) {
  showToast({
    title: "Warning",
    message: "Please fill in all required fields correctly",
    toastType: "warning",
    duration: 3000,
  });
  return;
}

if (cart.totalItems.value === 0) {
  showToast({
    title: "Warning",
    message: "Your cart is empty",
    toastType: "warning",
    duration: 3000,
  });
  return;
}

try {
  // Create a single order with all packs
  const orderData = {
    vendorId: route.params.id,
    customerName: customerName.value,
    phoneNumber: phoneNumber.value,
    deliveryType: deliveryMethod.value as "delivery" | "pickup",
    location: location.value,
    address: deliveryMethod.value === "delivery" ? deliveryAddress.value : "",
    // Transform cart packs to match the new structure
    packs: cart.packs.value
      .filter(pack => pack.items.length > 0)
      .map(pack => ({
        items: pack.items.map(item => ({
          menuItemId: item.mealId,
          quantity: item.quantity
        })),
        // Add pack quantity if it exists, otherwise it defaults to 1
        ...(pack.quantity && pack.quantity > 1 ? { quantity: pack.quantity } : {})
      })),
    // Add general notes if provided
    notes: additionalNotes.value.trim()
  };

  // Add pack-specific notes if needed (you might need to adjust this based on your requirements)
  // This is just one approach - you might need to handle pack notes differently
  const packsWithNotes = cart.packs.value.filter(pack => pack.items.length > 0 && pack.note);
  if (packsWithNotes.length > 0) {
    const packNotes = packsWithNotes.map(pack => pack.note).join('. ');
    orderData.notes = orderData.notes
      ? `${orderData.notes}. ${packNotes}`
      : packNotes;
  }

  console.log(orderData, 'Order payload');
  
  // Submit the single order with all packs
  const response = await createOrder(orderData);
  if (response && response._id) {
    orderIds.value = [response._id];
  }

  // Show success message with animation
  orderSuccess.value = true;
  showOrderSuccessModal.value = true;

  // Clear cart
  cart.clearCart();

  // If save order is checked, we would save it to the user's profile
  if (saveOrder.value) {
    console.log("Saving order for future use");
  }
} catch (err) {
  console.error("Error submitting order:", err);
  showToast({
    title: "Error",
    message: "Failed to submit order. Please try again.",
    toastType: "error",
    duration: 3000,
  });
}
};

// const submitOrder = async () => {
//   if (!validateForm()) {
//     showToast({
//       title: "Warning",
//       message: "Please fill in all required fields correctly",
//       toastType: "warning",
//       duration: 3000,
//     });
//     return;
//   }

//   if (cart.totalItems.value === 0) {
//     showToast({
//       title: "Warning",
//       message: "Your cart is empty",
//       toastType: "warning",
//       duration: 3000,
//     });
//     return;
//   }

//   try {
//     // Process each pack as a separate order
//     orderIds.value = [];
    
//     // For each pack in the cart, create a separate order
//     for (let packIndex = 0; packIndex < cart.packs.value.length; packIndex++) {
//       const pack = cart.packs.value[packIndex];
      
//       // Skip empty packs
//       if (pack.items.length === 0) continue;
      
//       // Create order data for this specific pack
//       const orderData = {
//         phoneNumber: phoneNumber.value,
//         deliveryType: deliveryMethod.value as "delivery" | "pickup",
//         location: location.value,
//         address: deliveryMethod.value === "delivery" ? deliveryAddress.value : "",
//         vendorId: route.params.id, // This would come from your app state in a real app
//         items: pack.items.map(item => ({
//           menuItemId: item.mealId,
//           quantity: item.quantity,
//           // price: item.price,
//           // name: item.name
//         })),
//         // Add the pack-specific note if it exists
//         notes: pack.note || ""
//       };
      
//       // Add additional notes to the order if provided
//       if (additionalNotes.value.trim()) {
//         orderData.notes = orderData.notes
//           ? `${orderData.notes}. ${additionalNotes.value}`
//           : additionalNotes.value;
//       }
      
//       console.log(orderData, 'hello worlds')
//       // Submit this pack as an order
//       const response = await createOrder(orderData);
//       if (response && response._id) {
//         orderIds.value.push(response._id);
//       }
//     }

//     // Show success message with animation
//     orderSuccess.value = true;
//     showOrderSuccessModal.value = true;

//     // Clear cart
//     cart.clearCart();

//     // If save order is checked, we would save it to the user's profile
//     // In a real app, you would send this to an API
//     if (saveOrder.value) {
//       console.log("Saving order for future use");
//     }
//   } catch (err) {
//     console.error("Error submitting order:", err);
//     showToast({
//       title: "Error",
//       message: "Failed to submit order. Please try again.",
//       toastType: "error",
//       duration: 3000,
//     });
//   }
// };

// Watch for delivery method changes to reset validation errors
watch(deliveryMethod, () => {
  if (deliveryMethod.value === "pickup") {
    validationErrors.value.deliveryAddress = "";
  }
});

// Lifecycle
onMounted(() => {
  // Initialize cart from localStorage
  cart.initCart();

  // Redirect to home if no order exists
  if (cart.totalItems.value === 0) {
    router.push("/");
    showToast({
      title: "Warning",
      message: "Your cart is empty",
      toastType: "warning",
      duration: 3000,
    });
  }
});

const chatWithVendor = () => {
// Construct order details message
let message = "Hello, I would like to place an order:\n\n";

// Add items from each pack
cart.packs.value.forEach((pack, packIndex) => {
  if (pack.items.length > 0) {
    message += `Pack ${packIndex + 1}:\n`;
    
    pack.items.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (₦${formatPrice(item.price * item.quantity)})\n`;
    });
    
    if (pack.note) {
      message += `Note: ${pack.note}\n`;
    }
    
    message += "\n";
  }
});

// Add delivery details
message += `Delivery Method: ${deliveryMethod.value === 'delivery' ? 'Delivery' : 'Pickup'}\n`;
message += `Location: ${location.value}\n`;

if (deliveryMethod.value === 'delivery' && deliveryAddress.value) {
  message += `Address: ${deliveryAddress.value}\n`;
}

if (additionalNotes.value) {
  message += `Additional Notes: ${additionalNotes.value}\n`;
}

// Add contact info
message += `\nContact: ${phoneNumber.value}\n`;

// Encode the message for WhatsApp URL
const encodedMessage = encodeURIComponent(message);

// Open WhatsApp with the message
// Note: In a real app, you would replace this with the vendor's actual phone number
window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
};
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulseSlow 2s ease-in-out infinite;
}

.animate-success-pop {
  animation: successPop 0.5s ease-out;
}

.animate-slide-in {
  animation: slideIn 0.4s ease-out;
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulseSlow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes successPop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.transform.hover\:scale-98:hover {
  transform: scale(0.98);
}
</style>