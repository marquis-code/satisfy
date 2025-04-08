<template>
  <div class="min-h-screen">
    <!-- Hero Banner with Restaurant Info -->
    <div class="relative">
      <div
        class="w-full h-40 md:h-64 bg-gradient-to-r from-red-800 to-red-600 overflow-hidden"
      >
        <img
          src="@/assets/img/meal.jpg"
          alt="Nigerian Food"
          class="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"
        ></div>
      </div>

      <!-- Restaurant Logo -->
      <div class="absolute top-6 left-6 md:top-8 md:left-8 z-10">
        <h1
          class="text-5xl md:text-7xl font-bold text-yellow-300 font-cursive logo-text drop-shadow-lg animate-float"
        >
          {{ vendor?.restaurantName ?? "Nil" }}
        </h1>
      </div>

      <!-- Restaurant Info Card -->
      <div class="card-container">
        <div
          class="relative mx-4 -mt-10 md:-mt-16 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl shadow-xl p-6 z-10 border border-orange-200 restaurant-card"
        >
          <!-- Decorative elements -->
          <div
            class="absolute -top-2 -right-2 w-20 h-20 bg-orange-400 rounded-full opacity-10 animate-pulse"
          ></div>
          <div
            class="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-10 animate-pulse delay-300"
          ></div>

          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div class="restaurant-info">
              <h1
                class="text-2xl md:text-3xl font-bold text-gray-800 restaurant-name"
              >
                {{ vendor?.restaurantName ?? "Nil" }}
              </h1>
              <div class="flex items-center mt-1">
                <p class="text-gray-600 location">
                  {{ vendor?.locationName ?? "Nil" }}
                </p>
                <div class="flex ml-2 stars-container">
                  <div v-for="i in 5" :key="i" class="star-wrapper">
                    <StarIcon class="h-4 w-4 text-yellow-500 star-icon" />
                  </div>
                </div>
              </div>
            </div>

            <button
              class="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 flex items-center review-button"
              @click="showReviewModal = true"
            >
              <StarIcon class="h-4 w-4 mr-1 animate-spin-slow" />
              <span class="relative">
                Leave A Review
                <span
                  class="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </button>
          </div>

          <div class="mt-4 flex items-center category-badge">
            <span
              class="px-2 py-1 bg-orange-200 text-orange-700 rounded-lg text-xs font-medium"
            >
              {{ vendor?.category ?? "Restaurant" }}
            </span>
          </div>

          <p class="mt-3 text-gray-700 italic quote-text">
            "Am proud of you, Dr Ben." -
            <span class="font-medium">{{ vendor?.phoneNumber ?? "Nil" }}</span>
          </p>

          <div
            class="mt-4 pt-3 border-t border-orange-200 flex justify-between items-center footer"
          >
            <div class="flex items-center">
              <div
                class="w-3 h-3 rounded-full"
                :class="vendor?.isStoreOpen ? 'bg-green-500' : 'bg-red-500'"
              ></div>
              <span
                class="ml-2 text-sm"
                :class="vendor?.isStoreOpen ? 'text-green-600' : 'text-red-600'"
              >
                {{ vendor?.isStoreOpen ? "Open Now" : "Closed" }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              {{ formatDate(vendor?.createdAt) }}
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="relative mx-4 -mt-10 md:-mt-16 bg-gradient-to-r from-orange-100 to-yellow-50 rounded-xl shadow-xl p-6 z-10 animate-fade-in-up border border-orange-200">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800">{{vendor?.restaurantName ?? 'Nil'}}</h1>
              <div class="flex items-center mt-1">
                <p class="text-gray-600">{{vendor?.locationName ?? 'Nil'}}</p>
                <div class="flex ml-2">
                  <StarIcon v-for="i in 5" :key="i" class="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            <button 
              class="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
              @click="showReviewModal = true"
            >
              <StarIcon class="h-4 w-4 mr-1" />
              Leave A Review
            </button>
          </div>
          <p class="mt-4 text-gray-700 italic">Am proud of you, Dr Ben. - {{vendor?.phoneNumber ?? 'Nil'}}</p>
        </div> -->
    </div>

    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Menu List Section -->
        <div class="w-full lg:w-2/3">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Menu List</h2>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search menu..."
                class="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              />
            </div>
          </div>

          <div
            v-if="fetchingMenu"
            class="flex justify-center items-center py-12"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"
            ></div>
          </div>

          <div
            v-else-if="filteredMeals.length === 0"
            class="bg-white rounded-xl shadow-md p-8 text-center"
          >
            <SearchXIcon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p class="text-gray-600">No meals found matching your search.</p>
            <button
              @click="searchQuery = ''"
              class="mt-4 px-4 py-2 bg-orange-400 text-white rounded-xl hover:bg-orange-500 transition-colors"
            >
              Clear Search
            </button>
          </div>

          <!-- <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="meal in filteredMeals" 
                :key="meal._id"
                class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in"
              >
                <div class="flex h-full">
                  <div class="w-1/3 overflow-hidden">
                    <img :src="getMealImage(meal._id)" :alt="meal.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <h3 class="font-semibold text-gray-800 text-lg">{{ meal.name }}</h3>
                      <p class="text-sm font-semibold text-green-600 mt-1">₦{{ formatPrice(meal.price) }}</p>
                    </div>
                    <button 
                      @click="openAddToPackModal(meal)"
                      class="self-end mt-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                      <PlusIcon class="h-4 w-4 mr-1" />
                      Add to Pack
                    </button>
                  </div>
                </div>
              </div>
            </div> -->

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(meal, index) in filteredMeals"
              :key="meal._id"
              class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              :class="{ 'animate-fade-in': true }"
              :style="{ animationDelay: `${index * 0.05}s` }"
            >
              <div class="flex h-full">
                <div class="w-1/3 overflow-hidden">
                  <!-- <img :src="getMealImage(meal._id)" :alt="meal.name" class="w-full h-full object-cover" /> -->
                  <img
                    src="@/assets/img/food1.jpg"
                    :alt="meal.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 class="font-semibold text-gray-800 text-lg">
                      {{ meal.name }}
                    </h3>
                    <p class="text-sm font-semibold text-green-600 mt-1">
                      ₦{{ formatPrice(meal.price) }}
                    </p>
                  </div>
                  <button
                    @click="openAddToPackModal(meal)"
                    class="self-end mt-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl flex items-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                    <PlusIcon class="h-4 w-4 mr-1" />
                    Add to Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Section -->
        <div class="w-full lg:w-1/3">
          <div
            class="bg-white rounded-xl shadow-md p-6 sticky top-4 border border-gray-100"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-base font-bold text-gray-800 flex items-center">
                <ShoppingBagIcon class="h-5 w-5 mr-2 text-orange-500" />
                Your Orders
                <span
                  v-if="cart.totalItems.value > 0"
                  class="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded-full animate-pulse"
                >
                  {{ cart.totalItems.value }}
                </span>
              </h2>
              <div class="flex space-x-2">
                <button
                  @click="addNewPack"
                  class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm flex items-center transition-all duration-300 transform hover:scale-105"
                >
                  <PlusIcon class="h-4 w-4 mr-1" /> Add Pack
                </button>
                <button
                  @click="openDuplicatePackModal"
                  class="px-2 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm flex items-center transition-all duration-300 transform hover:scale-105"
                >
                  <CopyIcon class="h-4 w-4 mr-1" /> Duplicate
                </button>
              </div>
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
              <p class="text-sm text-gray-400">
                Add items from the menu to get started
              </p>
            </div>

            <div
              v-else
              class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
            >
              <div
                v-for="(pack, index) in cart.packs.value"
                :key="pack.id"
                class="border border-gray-100 rounded-xl p-3 hover:border-orange-200 transition-colors animate-fade-in"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div
                      :class="
                        pack.items.length > 0 ? 'bg-orange-500' : 'bg-gray-300'
                      "
                      class="w-2 h-2 rounded-full mr-2"
                    ></div>
                    <h3 class="font-medium text-gray-800">
                      Pack {{ index + 1 }}
                      <span class="text-gray-500 text-sm"
                        >( {{ pack.items.length }} items )</span
                      >
                    </h3>
                  </div>
                  <button
                    v-if="cart.packs.value.length > 1"
                    @click="removePack(index)"
                    class="text-xs px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors transform hover:scale-105"
                  >
                    <TrashIcon class="h-3 w-3 inline-block" /> Remove
                  </button>
                </div>

                <div v-if="pack.items.length > 0" class="mt-3 space-y-3">
                  <div
                    v-for="(item, itemIndex) in pack.items"
                    :key="`${pack.id}-${itemIndex}`"
                    class="flex justify-between items-center bg-gray-50 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  >
                    <div class="flex items-center rounded-lg">
                      <div
                        class="w-8 h-8 rounded-lg overflow-hidden bg-gray-200"
                      >
                        <img
                          src="@/assets/img/meal2.jpg"
                          :alt="item.name"
                          class="w-full h-full object-cover"
                        />
                        <!-- <img 
                            :src="getMealImage(item.mealId)" 
                            :alt="item.name" 
                            class="w-full h-full object-cover" 
                          /> -->
                      </div>
                      <div class="ml-2">
                        <p class="text-sm font-medium text-gray-800">
                          {{ item.name }}
                        </p>
                        <p class="text-xs text-gray-500">
                          ₦{{ formatPrice(item.price) }} × {{ item.quantity }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <button
                        @click="decrementItemQuantity(index, itemIndex)"
                        class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-l-md flex items-center justify-center transition-colors"
                      >
                        <MinusIcon class="h-3 w-3" />
                      </button>
                      <span class="w-8 text-center text-sm">{{
                        item.quantity
                      }}</span>
                      <button
                        @click="incrementItemQuantity(index, itemIndex)"
                        class="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-r-md flex items-center justify-center transition-colors"
                      >
                        <PlusIcon class="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div
                    v-if="pack.note"
                    class="text-xs italic text-gray-500 bg-gray-50 p-2 rounded-xl"
                  >
                    <span class="font-medium">Note:</span> {{ pack.note }}
                  </div>

                  <button
                    @click="openPackNoteModal(index)"
                    class="text-xs text-blue-500 hover:text-blue-700 transition-colors flex items-center transform hover:translate-x-1"
                  >
                    <PencilIcon class="h-3 w-3 mr-1" />
                    {{ pack.note ? "Edit" : "Add" }} note
                  </button>
                </div>

                <div v-else class="mt-3 text-center py-3 bg-gray-50 rounded-xl">
                  <p class="text-sm text-gray-400">This pack is empty</p>
                </div>
              </div>
            </div>

            <div class="mt-6 border-t border-gray-100 pt-4">
              <div v-if="cart.totalItems.value > 0" class="mb-4">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Subtotal:</span>
                  <span class="font-medium"
                    >₦{{ formatPrice(cart.subtotal.value) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Service Charge:</span>
                  <span class="font-medium">₦50</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee:</span>
                  <span class="font-medium">From ₦700</span>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  @click="confirmEmptyCart"
                  class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 flex items-center justify-center transform hover:scale-98"
                  :disabled="cart.totalItems.value === 0"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      cart.totalItems.value === 0,
                  }"
                >
                  <TrashIcon class="h-4 w-4 mr-2" />
                  Empty Cart
                </button>
                <button
                  @click="proceedToCheckout"
                  :disabled="cart.totalItems.value === 0"
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      cart.totalItems.value === 0,
                    'hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5':
                      cart.totalItems.value > 0,
                  }"
                  class="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl shadow-md transition-all duration-300 flex items-center justify-center"
                >
                  <ShoppingCartIcon class="h-4 w-4 mr-2" />
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add to Pack Modal -->
    <Teleport to="body">
      <div
        v-if="showAddToPackModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closeAddToPackModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ShoppingBagIcon class="h-5 w-5 mr-2 text-green-500" />
              Add to Pack
            </h2>

            <div class="flex items-center mb-6 bg-gray-50 p-3 rounded-xl">
              <div class="w-20 h-20 rounded-xl overflow-hidden">
                <img
                  src="@/assets/img/meal.jpg"
                  :alt="selectedMeal?.name"
                  class="w-full h-full object-cover"
                />
                <!-- <img 
                    :src="getMealImage(selectedMeal?._id || '')" 
                    :alt="selectedMeal?.name" 
                    class="w-full h-full object-cover" 
                  /> -->
              </div>
              <div class="ml-4">
                <h3 class="font-medium text-gray-800 text-lg">
                  {{ selectedMeal?.name }}
                </h3>
                <p class="text-sm font-semibold text-green-600">
                  ₦{{ formatPrice(selectedMeal?.price || 0) }}
                </p>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Select Pack:</label
              >
              <div class="relative">
                <select
                  v-model="selectedPackIndex"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option
                    v-for="(pack, index) in cart.packs.value"
                    :key="pack.id"
                    :value="index"
                  >
                    Pack {{ index + 1 }} ({{ pack.items.length }} items)
                  </option>
                </select>
                <ChevronDownIcon
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Quantity:</label
              >
              <div class="flex items-center">
                <button
                  @click="decrementQuantity"
                  class="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-l-lg flex items-center justify-center transition-colors"
                >
                  <MinusIcon class="h-5 w-5" />
                </button>
                <input
                  type="number"
                  v-model="quantity"
                  min="1"
                  class="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                />
                <button
                  @click="incrementQuantity"
                  class="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-r-lg flex items-center justify-center transition-colors"
                >
                  <PlusIcon class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeAddToPackModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="addToPack"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Add to Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Duplicate Pack Modal -->
    <Teleport to="body">
      <div
        v-if="showDuplicatePackModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closeDuplicatePackModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CopyIcon class="h-5 w-5 mr-2 text-green-500" />
              Duplicate Pack
            </h2>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Select Pack to Duplicate:</label
              >
              <div class="relative">
                <select
                  v-model="packToDuplicateIndex"
                  class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                >
                  <option
                    v-for="(pack, index) in cart.packs.value"
                    :key="pack.id"
                    :value="index"
                  >
                    Pack {{ index + 1 }} ({{ pack.items.length }} items)
                  </option>
                </select>
                <ChevronDownIcon
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeDuplicatePackModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="duplicateSelectedPack"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Duplicate Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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

    <!-- Review Modal -->
    <Teleport to="body">
      <div
        v-if="showReviewModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="closeReviewModal"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <StarIcon class="h-5 w-5 mr-2 text-yellow-500" />
              Leave a Review
            </h2>

            <div class="mb-4">
              <label class="block text-gray-700 mb-2 font-medium"
                >Rating:</label
              >
              <div class="flex space-x-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  @click="reviewRating = star"
                  class="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  <StarIcon
                    class="h-8 w-8"
                    :class="
                      star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                    "
                  />
                </button>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-gray-700 mb-2 font-medium"
                >Your Review:</label
              >
              <textarea
                v-model="reviewText"
                rows="4"
                placeholder="Share your experience..."
                class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3">
              <button
                @click="closeReviewModal"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="submitReview"
                class="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Confirm Empty Cart Modal -->
    <Teleport to="body">
      <div
        v-if="showConfirmEmptyCartModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        @click="showConfirmEmptyCartModal = false"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up"
          @click.stop
        >
          <div class="p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Empty Your Cart?
            </h2>
            <p class="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </p>

            <div class="flex justify-end gap-3">
              <button
                @click="showConfirmEmptyCartModal = false"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="emptyCart"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300"
              >
                Empty Cart
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
import { useFetchVendorById } from "@/composables/modules/vendor/useFetchVendorById";
import { useFetchVendorMenu } from "@/composables/modules/menu/useFetchVendorMenu";
import {
  PlusIcon,
  MinusIcon,
  XIcon,
  StarIcon,
  CopyIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TrashIcon,
  SearchIcon,
  SearchXIcon,
  ChevronDownIcon,
  PencilIcon,
  ClipboardEditIcon,
  MessageCircleIcon,
  AlertCircleIcon,
} from "lucide-vue-next";
// import ToastContainer from '~/components/ToastContainer.vue'
import { useCustomToast } from "@/composables/core/useCustomToast";
const { vendor, loading, error } = useFetchVendorById();
const { showToast } = useCustomToast();
  const route = useRoute()

// Types
interface Meal {
  _id: string;
  name: string;
  price: number;
  categoryId: string;
  isEnabled: boolean;
  vendorId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Router
const router = useRouter();

// Composables
const cart = useCart();
// const toast = useToast()
const { menus, loading: fetchingMenu } = useFetchVendorMenu();

// State
const searchQuery = ref("");
const filteredMeals = computed(() => {
  if (!menus.value || menus.value.length === 0) return [];

  if (!searchQuery.value)
    return menus.value.filter((meal) => !meal.isDeleted && meal.isEnabled);

  const query = searchQuery.value.toLowerCase();
  return menus.value.filter(
    (meal) =>
      !meal.isDeleted &&
      meal.isEnabled &&
      meal.name.toLowerCase().includes(query)
  );
});

// Modal states
const showAddToPackModal = ref(false);
const showDuplicatePackModal = ref(false);
const showPackNoteModal = ref(false);
const showReviewModal = ref(false);
const showConfirmEmptyCartModal = ref(false);

// Form states
const selectedMeal = ref<Meal | null>(null);
const selectedPackIndex = ref(0);
const packToDuplicateIndex = ref(0);
const quantity = ref(1);
const packNoteIndex = ref(0);
const packNote = ref("");
const reviewRating = ref(5);
const reviewText = ref("");

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString();
};

const getMealImage = (mealId: string): string => {
  // In a real app, you would get this from your API or have image URLs in your meal data
  // For now, we'll use a mapping or default images
  const mealImages: Record<string, string> = {
    "67e9c5d1e4ca7f8d6e4fdbf4": "/images/abacha.jpg",
    "67e9c875738bd34efb8e3c3b": "/images/nkwobi.jpg",
    "67e9d20e95896a435cac3b43": "/images/plantain-egg.jpg",
    // Add more mappings as needed
  };

  return mealImages[mealId] || "/images/placeholder.jpg";
};

const openAddToPackModal = (meal: Meal) => {
  selectedMeal.value = meal;
  selectedPackIndex.value = cart.packs.value.length - 1; // Select the last pack by default
  quantity.value = 1;
  showAddToPackModal.value = true;
};

const closeAddToPackModal = () => {
  showAddToPackModal.value = false;
  selectedMeal.value = null;
};

// const openDuplicatePackModal = () => {
//   if (cart.packs.value.length === 1) {
//     // If there's only one pack, duplicate it directly
//     duplicatePack(0)
//     return
//   }

//   packToDuplicateIndex.value = cart.packs.value.length - 1 // Default to last pack
//   showDuplicatePackModal.value = true
// }

const openDuplicatePackModal = () => {
  if (cart.packs.value.length === 1) {
    // If there's only one pack, duplicate it directly
    duplicatePack(0);
    // toast.success('Pack duplicated successfully')
    showToast({
      title: "Success",
      message: "Pack duplicated successfully",
      toastType: "success",
      duration: 3000,
    });
    return;
  }

  packToDuplicateIndex.value = 0; // Default to first pack
  showDuplicatePackModal.value = true;
};

const closeDuplicatePackModal = () => {
  showDuplicatePackModal.value = false;
};

const duplicateSelectedPack = () => {
  duplicatePack(packToDuplicateIndex.value);
  closeDuplicatePackModal();
};

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// const addToPack = () => {
//   if (!selectedMeal.value) return

//   const packIndex = selectedPackIndex.value
//   const meal = selectedMeal.value

//   const success = cart.addItemToPack(packIndex, {
//     mealId: meal._id,
//     name: meal.name,
//     price: meal.price,
//     image: getMealImage(meal._id)
//   }, quantity.value)

//   if (success) {
//     toast.success(`Added ${quantity.value} ${meal.name} to Pack ${packIndex + 1}`)
//     closeAddToPackModal()
//   } else {
//     toast.error('Failed to add item to pack')
//   }
// }

const addToPack = () => {
  if (!selectedMeal.value) return;

  const packIndex = selectedPackIndex.value;
  const meal = selectedMeal.value;

  const success = cart.addItemToPack(
    packIndex,
    {
      mealId: meal._id,
      name: meal.name,
      price: meal.price,
      image: getMealImage(meal._id),
    },
    quantity.value
  );

  if (success) {
    // toast.success(`Added ${quantity.value} ${meal.name} to Pack ${packIndex + 1}`)
    showToast({
      title: "Success",
      message: `Added ${quantity.value} ${meal.name} to Pack ${packIndex + 1}`,
      toastType: "success",
      duration: 3000,
    });
    showAddToPackModal.value = false; // Fix: Close the modal after adding to pack
    selectedMeal.value = null;
  } else {
    // toast.error('Failed to add item to pack')
    showToast({
      title: "Error",
      message: "Failed to add item to pack",
      toastType: "error",
      duration: 3000,
    });
  }
};

const addNewPack = () => {
  const success = cart.addNewPack();
  if (success) {
    // toast.success('New pack added')
    showToast({
      title: "Success",
      message: "New pack added",
      toastType: "success",
      duration: 3000,
    });
  }
};

const duplicatePack = (index: number) => {
  if (cart.packs.value.length > 0) {
    const success = cart.duplicatePack(index);
    if (success) {
      showToast({
        title: "Success",
        message: `Pack ${index + 1} duplicated successfully`,
        toastType: "success",
        duration: 3000,
      });
      // toast.success(`Pack ${index + 1} duplicated successfully`)
    }
  }
};

const removePack = (index: number) => {
  const success = cart.removePack(index);
  if (success) {
    // toast.info('Pack removed')
    // `Pack ${index + 1} duplicated successfully`
    showToast({
      title: "Success",
      message: `Pack ${index + 1} duplicated successfully`,
      toastType: "success",
      duration: 3000,
    });
  }
};

const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
  const success = cart.incrementItemQuantity(packIndex, itemIndex);
  if (success) {
    // No toast needed for small quantity changes
  }
};

const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
  const success = cart.decrementItemQuantity(packIndex, itemIndex);
  if (success) {
    // No toast needed for small quantity changes
  }
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
    // toast.success('Note saved successfully')
    showToast({
      title: "Success",
      message: "Note saved successfully",
      toastType: "success",
      duration: 3000,
    });
    closePackNoteModal();
  }
};

const confirmEmptyCart = () => {
  if (cart.totalItems.value > 0) {
    showConfirmEmptyCartModal.value = true;
  }
};

const emptyCart = () => {
  const success = cart.clearCart();
  if (success) {
    // toast.info('Cart emptied successfully')
    showToast({
      title: "Success",
      message: "Cart emptied successfully",
      toastType: "info",
      duration: 3000,
    });
    showConfirmEmptyCartModal.value = false;
  }
};

const proceedToCheckout = () => {
  if (cart.totalItems.value > 0) {
    // Navigate to checkout page
    router.push(`/vendors/${route.params.id}/checkout`);
  } else {
    showToast({
      title: "Warning",
      message: "Your cart is empty",
      toastType: "warning",
      duration: 3000,
    });
    // toast.warning('Your cart is empty')
  }
};

const closeReviewModal = () => {
  showReviewModal.value = false;
  reviewRating.value = 5;
  reviewText.value = "";
};

const submitReview = () => {
  // In a real app, you would send this to an API
  console.log("Review submitted:", {
    rating: reviewRating.value,
    text: reviewText.value,
  });

  // toast.success('Thank you for your review!')
  showToast({
    title: "Warning",
    message: "Thank you for your review!",
    toastType: "warning",
    duration: 3000,
  });
  closeReviewModal();
};

// Format date function
const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Lifecycle
onMounted(() => {
  // Initialize cart from localStorage
  cart.initCart();
});
</script>

<style scoped>
.logo-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.font-cursive {
  font-family: "Brush Script MT", cursive;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

.logo-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.font-cursive {
  font-family: "Brush Script MT", cursive;
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 2s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
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

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
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

.card-container {
  perspective: 1000px;
}

.restaurant-card {
  transform-style: preserve-3d;
  animation: card-entrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  box-shadow: 0 10px 30px -5px rgba(243, 156, 18, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.restaurant-card:hover {
  box-shadow: 0 15px 35px -5px rgba(243, 156, 18, 0.3);
  transform: translateY(-5px);
}

.restaurant-name {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.2s;
  opacity: 0;
  transform: translateY(10px);
}

.location {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.3s;
  opacity: 0;
  transform: translateY(10px);
}

.stars-container {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.4s;
  opacity: 0;
}

.star-wrapper {
  display: inline-block;
  transform-origin: center;
}

.star-wrapper:hover .star-icon {
  transform: scale(1.3);
  color: #f59e0b;
}

.star-icon {
  transition: all 0.2s ease;
}

.review-button {
  position: relative;
  overflow: hidden;
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.5s;
  opacity: 0;
}

.review-button::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(45deg);
  opacity: 0;
  transition: all 0.6s ease;
}

.review-button:hover::after {
  opacity: 1;
  transform: rotate(45deg) translate(50%, 50%);
}

.category-badge {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.6s;
  opacity: 0;
}

.quote-text {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.7s;
  opacity: 0;
  position: relative;
}

.footer {
  animation: slide-in 0.6s ease forwards;
  animation-delay: 0.8s;
  opacity: 0;
}

@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(20px) rotateX(5deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
}

.delay-300 {
  animation-delay: 300ms;
}
</style>
