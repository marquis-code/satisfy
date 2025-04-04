<template>
  <div class="p-3 lg:p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
    <!-- Header with animated gradient -->
    <div class="relative overflow-hidden bg-white rounded-xl shadow-lg p-6 mb-8 border border-orange-100">
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full opacity-70 blur-xl"></div>
      <div class="absolute -bottom-16 -left-16 w-32 h-32 bg-orange-200 rounded-full opacity-50 blur-xl"></div>
      
      <div class="flex flex-col md:flex-row justify-between items-center relative z-10">
        <div class="mb-4 md:mb-0">
          <h1 class="text-xl font-bold text-gray-800 flex items-center">
            <Utensils class="w-6 h-6 mr-2 text-orange-500" />
            <span>Menu List</span>
          </h1>
          <p class="text-gray-500 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          @click="openCreateModal"
          class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center group"
          :disabled="creating"
        >
          <span v-if="creating" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <PlusCircle v-else class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
          <span>Add Menu</span>
        </button>
      </div>
    </div>

    <!-- {{meals}} -->

    <!-- Filters and Search with animated appearance -->
    <div 
      class="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { delay: 200 } }"
    >
      <div class="flex flex-col md:flex-row justify-between gap-4">
        <div class="flex items-center">
          <label class="mr-2 text-gray-600 font-medium">Show</label>
          <select
            v-model="perPage"
            @change="changePage(1)"
            class="border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          >
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          <span class="ml-2 text-gray-600">entries</span>
        </div>
        <div class="relative flex-1 md:max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            placeholder="Search meals by name, category or price..."
            @input="changePage(1)"
          />
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading menu items...</p>
      </div>
    </div>

    <!-- Card Grid View -->
    <div 
      v-else-if="viewMode === 'grid'"
      class="mb-8"
    >
      <TransitionGroup
        name="meal-card"
        tag="div"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      >
        <div
          v-for="meal in paginatedMeals"
          :key="meal.id"
          class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }"
        >
          <div class="relative h-48 w-full overflow-hidden">
            <img
              :src="meal.image || defaultMeal"
              :alt="meal.name"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div class="absolute top-2 right-2 flex space-x-1">
              <button
                @click.stop="toggleVisibility(meal)"
                class="p-1.5 rounded-full transition-all duration-200 bg-white/80 backdrop-blur-sm hover:bg-white"
                :class="meal.isEnabled ? 'text-orange-500' : 'text-gray-400'"
                :disabled="enabling || disabling"
              >
                <div v-if="enabling && selectedMeal?.id === meal.id || disabling && selectedMeal?.id === meal.id" class="w-4 h-4">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <Eye v-else-if="meal.isEnabled" class="w-4 h-4" />
                <EyeOff v-else class="w-4 h-4" />
              </button>
            </div>
            <div 
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-3"
            >
              <div class="font-bold text-lg">{{ meal.name }}</div>
              <div class="text-orange-300 font-medium">
                ₦{{ formatPrice(meal.price) }}
              </div>
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <Tag class="w-4 h-4 mr-1" />
              <span class="capitalize">{{ meal?.category?.name }}</span>
            </div>
            <div class="flex justify-between items-center">
              <button
                @click.stop="openEditModal(meal)"
                class="px-3 py-1.5 bg-orange-100 text-orange-600 rounded-xl hover:bg-orange-200 transition-colors duration-200 flex items-center"
                :disabled="editing"
              >
                <div v-if="editing && selectedMeal?.id === meal.id" class="w-4 h-4 mr-1">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <Pencil v-else class="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                @click.stop="openDeleteModal(meal)"
                class="px-3 py-1.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200 flex items-center"
                :disabled="deleting"
              >
                <div v-if="deleting && selectedMeal?.id === meal.id" class="w-4 h-4 mr-1">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <Trash2 v-else class="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
      
      <!-- Empty State -->
      <div 
        v-if="paginatedMeals?.length === 0" 
        class="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-200"
      >
        <SearchX class="w-16 h-16 text-gray-300 mb-4" />
        <h3 class="text-lg font-medium text-gray-700">No meals found</h3>
        <p class="text-gray-500 mt-1">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Table View -->
    <div 
      v-else-if="viewMode === 'table' && !loading"
      class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8"
      v-motion
      :initial="{ opacity: 0, scale: 0.95 }"
      :enter="{ opacity: 1, scale: 1, transition: { delay: 300 } }"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name & Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visibility
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="meal in paginatedMeals"
              :key="meal.id"
              class="hover:bg-orange-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-16 h-16 rounded-xl overflow-hidden">
                  <img
                    :src="meal.image || defaultMeal"
                    :alt="meal.name"
                    class="w-full h-full object-cover"
                  />
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">{{ meal.name }}</div>
                <div class="text-orange-500 font-medium">
                  ₦{{ formatPrice(meal.price) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full capitalize" 
                  :class="{
                    'bg-green-100 text-green-800': meal.category === 'rice',
                    'bg-blue-100 text-blue-800': meal.category === 'protein',
                    'bg-purple-100 text-purple-800': meal.category === 'salad',
                    'bg-yellow-100 text-yellow-800': meal.category === 'snacks',
                    'bg-pink-100 text-pink-800': meal.category === 'dessert',
                  }"
                >
                  {{ meal.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="relative">
                  <button
                    @click="toggleVisibility(meal)"
                    class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    :class="meal.isEnabled ? 'bg-orange-500' : 'bg-gray-200'"
                    :disabled="enabling || disabling"
                  >
                    <span
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      :class="meal.isEnabled ? 'translate-x-5' : 'translate-x-0'"
                    ></span>
                  </button>
                  <div v-if="(enabling || disabling) && selectedMeal?.id === meal.id" class="absolute inset-0 flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="openEditModal(meal)"
                    class="p-1.5 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors duration-200"
                    :disabled="editing"
                  >
                    <div v-if="editing && selectedMeal?.id === meal.id" class="w-4 h-4">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <Pencil v-else class="w-4 h-4" />
                  </button>
                  <button
                    @click="openDeleteModal(meal)"
                    class="p-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                    :disabled="deleting"
                  >
                    <div v-if="deleting && selectedMeal?.id === meal.id" class="w-4 h-4">
                      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <Trash2 v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedMeals?.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                <SearchX class="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No meals found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Toggle and Pagination -->
    <div v-if="!loading" class="bg-white rounded-xl shadow-md p-4 mb-8 border border-gray-100">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-2">
          <button
            @click="viewMode = 'grid'"
            class="p-2 rounded-xl transition-all duration-200"
            :class="viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <Grid class="w-5 h-5" />
          </button>
          <button
            @click="viewMode = 'table'"
            class="p-2 rounded-xl transition-all duration-200"
            :class="viewMode === 'table' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            <List class="w-5 h-5" />
          </button>
          <span class="text-sm text-gray-500 ml-2">
            Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of
            {{ filteredMeals?.length }} entries
          </span>
        </div>
        
        <div class="flex space-x-1">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center"
            :class="
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-orange-500'
            "
          >
            <ChevronLeft class="w-4 h-4 mr-1" />
            Prev
          </button>
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="typeof page === 'number' ? changePage(page) : null"
            class="px-3 py-1.5 rounded-xl border transition-all duration-200"
            :class="[
              typeof page !== 'number' ? 'bg-white text-gray-400' : 
              currentPage === page
                ? 'bg-orange-500 text-white border-orange-500'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-orange-500'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 rounded-xl border transition-all duration-200 flex items-center"
            :class="
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-orange-500'
            "
          >
            Next
            <ChevronRight class="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click="closeModal"
        ></div>
        <div
          class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="relative p-6">
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-orange-100 rounded-tr-full opacity-50"></div>
            
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X class="w-6 h-6" />
            </button>
            
            <div class="relative z-10">
              <h2 class="text-xl font-bold text-center text-gray-800 mb-2">
                {{ isEditing ? "Edit Menu" : "Create Menu" }}
              </h2>
              <p class="text-center text-sm text-gray-600 mb-6">
                If you need more info, please check out
                <a href="#" class="text-orange-500 hover:underline">FAQ Page</a>.
              </p>

              <form @submit.prevent="submitForm" class="space-y-5">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g fried rice, full chicken, chocolate cake"
                    required
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Price(₦)</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span class="text-gray-500">₦</span>
                    </div>
                    <input
                      v-model="formattedPrice"
                      type="text"
                      class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Input Food Price"
                      required
                      @input="handlePriceInput"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Choose Category</label>
                  <div class="relative">
                    <select
                      v-model="formData.category"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 appearance-none"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option v-for="item in categories" :value="item._id">{{item.name}}</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown class="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">Image</label>
                  <div class="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors duration-200">
                    <div v-if="formData.image" class="mb-4">
                      <img
                        :src="formData.image"
                        alt="Preview"
                        class="h-40 mx-auto object-contain rounded-md"
                      />
                    </div>
                    <div v-else class="py-8">
                      <Upload class="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p class="text-gray-500">Drag and drop or click to upload</p>
                    </div>
                    <input
                      type="file"
                      class="hidden"
                      ref="fileInput"
                      accept="image/*"
                      @change="handleFileUpload"
                    />
                    <button
                      type="button"
                      @click="$refs.fileInput.click()"
                      class="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      {{ formData.image ? 'Change Image' : 'Choose File' }}
                    </button>
                  </div>
                </div>

                <div class="flex justify-center w-full space-x-4 pt-4">
                  <button
                    type="button"
                    @click="closeModal"
                    class="px-6 py-2.5 w-full bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    class="px-6 py-2.5 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                    :disabled="creating || editing"
                  >
                    <span v-if="creating || editing" class="mr-2">
                      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click="closeDeleteModal"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <button
            @click="closeDeleteModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X class="w-6 h-6" />
          </button>
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle class="w-10 h-10 text-red-500" />
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Confirm Delete
            </h2>
            <p class="text-gray-600 text-sm mb-6">
              Are you sure you want to delete "{{ selectedMeal?.name }}"? This
              action cannot be undone.
            </p>
            <div class="flex justify-center space-x-4">
              <button
                @click="closeDeleteModal"
                class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                @click="deleteMeal"
                class="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                :disabled="deleting"
              >
                <span v-if="deleting" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toggle Visibility Confirmation Modal -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="showToggleModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          @click="closeToggleModal"
        ></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <button
            @click="closeToggleModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X class="w-6 h-6" />
          </button>
          <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Eye
                v-if="!selectedMeal?.isEnabled"
                class="w-10 h-10 text-orange-500"
              />
              <EyeOff
                v-else
                class="w-10 h-10 text-orange-500"
              />
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">
              Confirm Visibility Change
            </h2>
            <p class="text-gray-600 mb-6">
              Are you sure you want to make "{{ selectedMeal?.name }}"
              {{ selectedMeal?.isEnabled ? "hidden" : "visible" }} to users?
            </p>
            <div class="flex justify-center space-x-4">
              <button
                @click="closeToggleModal"
                class="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                @click="confirmToggleVisibility"
                class="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                :disabled="enabling || disabling"
              >
                <span v-if="enabling || disabling" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 backdrop-blur-sm"
        :class="{
          'bg-green-500/90 text-white': toast.type === 'success',
          'bg-red-500/90 text-white': toast.type === 'error',
          'bg-orange-500/90 text-white': toast.type === 'warning',
          'bg-blue-500/90 text-white': toast.type === 'info',
        }"
      >
        <div class="p-1 bg-white rounded-full">
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 text-green-500" />
          <AlertCircle v-if="toast.type === 'error'" class="w-5 h-5 text-red-500" />
          <AlertTriangle v-if="toast.type === 'warning'" class="w-5 h-5 text-orange-500" />
          <Info v-if="toast.type === 'info'" class="w-5 h-5 text-blue-500" />
        </div>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Grid,
  List,
  Upload,
  Tag,
  Utensils,
  PlusCircle,
  SearchX
} from 'lucide-vue-next';
import { useFetchCategory } from '@/composables/modules/category/useFetchCategory'
import { useCreateMenu } from '@/composables/modules/menu/useCreateMenu'
import { useFetchMenu } from '@/composables/modules/menu/useFetchMenu'
import { useEditMenu } from '@/composables/modules/menu/useEditMenu'
import { useDeleteMenu } from '@/composables/modules/menu/useDeleteMenu'
import { useEnableMenu } from '@/composables/modules/menu/useEnableMenu'
import { useDisableMenu } from '@/composables/modules/menu/useDisableMenu'
import defaultMeal from '@/assets/img/meal.jpg'

const { createMenu, loading: creating } = useCreateMenu()
const { menus: meals,loading } = useFetchMenu()
const { editMenu, loading: editing } = useEditMenu()
const { deleteMenu, loading: deleting } = useDeleteMenu()
const { enableMenu, loading: enabling } = useEnableMenu()
const { disableMenu, loading: disabling } = useDisableMenu()
const { categories,  loading: fetching } = useFetchCategory()

// Types
interface Meal {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isEnabled: boolean;
}

// State
// const meals = ref<Meal[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const perPage = ref(50);
const showModal = ref(false);
const showDeleteModal = ref(false);
const showToggleModal = ref(false);
const isEditing = ref(false);
const selectedMeal = ref<Meal | null>(null);
const fileName = ref('');
const viewMode = ref<'grid' | 'table'>('grid');
const fileInput = ref<HTMLInputElement | null>(null);
const formattedPrice = ref('');

const formData = ref({
  id: 0,
  name: '',
  price: 0,
  category: '',
  image: ''
});

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning' | 'info'
});

// Computed properties
const filteredMeals = computed(() => {
  if (!searchQuery.value) return meals.value;
  
  const query = searchQuery.value.toLowerCase();
  return meals.value.filter(meal => 
    meal.name.toLowerCase().includes(query) || 
    meal.category.toLowerCase().includes(query) ||
    meal.price.toString().includes(query)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredMeals.value?.length / perPage.value);
});

const paginatedMeals = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredMeals?.value?.slice(start, end);
});

const paginationInfo = computed(() => {
  const total = filteredMeals.value?.length;
  if (total === 0) {
    return { from: 0, to: 0 };
  }
  
  const from = (currentPage.value - 1) * perPage.value + 1;
  const to = Math.min(from + perPage.value - 1, total);
  
  return { from, to };
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;
  
  if (totalPages.value <= maxPagesToShow) {
    // Show all pages if there are fewer than maxPagesToShow
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always include first page
    pages.push(1);
    
    // Calculate start and end of page range
    let start = Math.max(2, currentPage.value - 1);
    let end = Math.min(totalPages.value - 1, currentPage.value + 1);
    
    // Adjust if at the beginning or end
    if (currentPage.value <= 2) {
      end = Math.min(totalPages.value - 1, 4);
    } else if (currentPage.value >= totalPages.value - 1) {
      start = Math.max(2, totalPages.value - 3);
    }
    
    // Add ellipsis if needed
    if (start > 2) {
      pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (end < totalPages.value - 1) {
      pages.push('...');
    }
    
    // Always include last page
    pages.push(totalPages.value);
  }
  
  return pages;
});

// Methods
function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function openCreateModal() {
  isEditing.value = false;
  formData.value = {
    id: 0,
    name: '',
    price: 0,
    category: '',
    image: ''
  };
  formattedPrice.value = '';
  fileName.value = '';
  showModal.value = true;
}

function openEditModal(meal: Meal) {
  isEditing.value = true;
  selectedMeal.value = meal;
  formData.value = {
    id: meal._id,
    name: meal.name,
    price: meal.price,
    category: meal.category,
    image: meal.image || defaultMeal
  };
  formattedPrice.value = formatPrice(meal.price);
  fileName.value = meal?.image?.split('/').pop() || '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openDeleteModal(meal: Meal) {
  selectedMeal.value = meal;
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

function toggleVisibility(meal: Meal) {
  selectedMeal.value = meal;
  showToggleModal.value = true;
}

function closeToggleModal() {
  showToggleModal.value = false;
}

async function confirmToggleVisibility() {
  if (!selectedMeal.value) return;
  
  try {
    if (selectedMeal.value.isEnabled) {
      await disableMenu(selectedMeal.value._id);
    } else {
      await enableMenu(selectedMeal.value._id);
    }
    
    // Update local state after API call succeeds
    const index = meals.value.findIndex(m => m.id === selectedMeal.value!.id);
    if (index !== -1) {
      meals.value[index].isEnabled = !meals.value[index].isEnabled;
      
      showToast(
        `${meals.value[index].name} is now ${meals.value[index].isEnabled ? 'visible' : 'hidden'} to users`,
        'success'
      );
    }
  } catch (error) {
    showToast(`Failed to update visibility: ${error}`, 'error');
  }
  
  closeToggleModal();
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files?.length === 0) return;
  
  const file = input.files[0];
  fileName.value = file.name;
  
  // In a real app, you would upload the file to a server
  // For this demo, we'll create a data URL
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.image = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handlePriceInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value.replace(/[^\d]/g, ''); // Remove all non-digits
  
  // Convert to number and format
  if (value) {
    const numValue = parseInt(value, 10);
    formData.value.price = numValue;
    formattedPrice.value = formatPrice(numValue);
  } else {
    formData.value.price = 0;
    formattedPrice.value = '';
  }
}

async function submitForm() {
  try {
    if (isEditing.value) {
      console.log(formData.value, 'here updatd')
      const updatePayload = {
        // id: formData.value._id,
        name: formData.value.name,
        price: formData.value.price,
        category_id: formData.value.category,
        // image: formData.value.image
      }
      // Update existing meal
      await editMenu(formData.value.id, updatePayload);
      
      // // Update local state after API call succeeds
      // const index = meals.value.findIndex(m => m.id === formData.value.id);
      // if (index !== -1) {
      //   meals.value[index] = {
      //     ...meals.value[index],
      //     name: formData.value.name,
      //     price: formData.value.price,
      //     category: formData.value.category,
      //     image: formData.value.image || meals.value[index].image
      //   };
      // }
      
      showToast('Menu updated successfully', 'success');
    } else {
      // Create new meal
      const newMenuId = await createMenu({
        name: formData.value.name,
        price: formData.value.price,
        categoryId: formData.value.category,
        // image: formData.value.image || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(formData.value.name)}`
      });
      
      // Add to local state after API call succeeds
      const newMeal: Meal = {
        id: newMenuId,
        name: formData.value.name,
        price: formData.value.price,
        category: formData.value.category,
        image: formData.value.image || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(formData.value.name)}`,
        isEnabled: true
      };
      
      // meals.value.unshift(newMeal);
      showToast('Menu created successfully', 'success');
    }
  } catch (error) {
    showToast(`Failed to ${isEditing.value ? 'update' : 'create'} menu: ${error}`, 'error');
  }
  
  closeModal();
}

async function deleteMeal() {
  console.log(selectedMeal.value, 'here ooo')
  // if (!selectedMeal.value) return;
  
  try {
    await deleteMenu(selectedMeal.value._id).then(() => {
      const mealName = selectedMeal.value.name;
      showToast(`${mealName} has been deleted`, 'success');
    })
    
  } catch (error) {
    showToast(`Failed to delete menu: ${error}`, 'error');
  }
  
  closeDeleteModal();
}

function showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
  toast.value = {
    show: true,
    message,
    type
  };
  
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
}

function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// // Initialize with data from API
// onMounted(async () => {
//   try {
//     await fetchMenu();
//     // Map API response to our local state format
//     meals.value = menus.value.map(menu => ({
//       id: menu.id,
//       name: menu.name,
//       price: menu.price,
//       category: menu.category,
//       image: menu.image,
//       isEnabled: menu.isEnabled
//     }));
//   } catch (error) {
//     showToast(`Failed to fetch menus: ${error}`, 'error');
//   }
// });

// Reset to page 1 when search query or per page changes
watch([searchQuery, perPage], () => {
  currentPage.value = 1;
});

definePageMeta({
    layout: 'dashboard'
})
</script>

<style scoped>
.meal-card-enter-active,
.meal-card-leave-active {
  transition: all 0.3s ease;
}
.meal-card-enter-from,
.meal-card-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Ensure smooth transitions for all interactive elements */
button, a, input, select {
  transition: all 0.2s ease;
}

/* Add a subtle hover effect to all cards */
.meal-card-move {
  transition: transform 0.5s ease;
}
</style>