<template>
  <div class="min-h-screen">
    <!-- Background decorative elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute top-1/3 -left-24 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
    </div>

    <!-- {{categoriesList}} -->

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Header with animated gradient -->
      <div class="relative overflow-hidden bg-white rounded-t-2xl shadow-md p-6 mb-1">
        <div class="absolute inset-0 bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 opacity-50"></div>
        <div class="relative z-10">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center">
              <div class="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-xl shadow-lg mr-4 transform transition-transform hover:scale-105">
                <UtensilsCrossedIcon class="w-6 h-6 text-white" />
              </div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                All Categories List
              </h1>
            </div>
            <button 
              @click="openCreateModal" 
              class="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center"
              :disabled="creating"
            >
              <span v-if="creating" class="mr-2">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              <span class="relative" v-else>
                <PlusIcon class="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              </span>
              <span>Add Category</span>
              <span class="absolute inset-0 rounded-xl overflow-hidden">
                <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-b-2xl shadow-lg p-6 flex justify-center items-center py-20">
        <div class="flex flex-col items-center">
          <svg class="animate-spin h-12 w-12 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading categories...</p>
        </div>
      </div>

      <!-- Main content card with subtle animation -->
      <div 
        v-else
        class="bg-white rounded-b-2xl shadow-lg p-6 transform transition-all duration-500"
        :class="{ 'scale-100 opacity-100': contentLoaded, 'scale-95 opacity-0': !contentLoaded }"
      >
        <div class="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div class="flex items-center bg-gray-50 rounded-xl p-2 shadow-sm">
            <label class="text-gray-600 mr-2">Show</label>
            <select 
              v-model="perPage" 
              class="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              @change="currentPage = 1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span class="ml-2 text-gray-600">entries</span>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="pl-10 pr-4 py-2 w-full md:w-64 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="Search categories..."
            />
            <Transition name="fade">
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XIcon class="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </Transition>
          </div>
        </div>

        <!-- Table with hover animations -->
        <div class="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Menu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr 
                  v-for="category in paginatedCategories" 
                  :key="category.id" 
                  class="hover:bg-orange-50 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-orange-100 text-lg font-medium text-red-500">
                      {{ category.name.charAt(0) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-800">{{ category.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ category.menuItemCount }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex space-x-3">
                      <button 
                        @click="editCategoryItem(category)" 
                        class="group relative p-2 rounded-full hover:bg-orange-100 transition-colors duration-200"
                        :disabled="editing"
                      >
                        <div v-if="editing && selectedCategory?.id === category.id" class="w-5 h-5">
                          <svg class="animate-spin h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <PencilIcon v-else class="w-5 h-5 text-orange-500 group-hover:text-orange-600 transition-colors duration-200" />
                        <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Edit
                        </span>
                      </button>
                      <button 
                        @click="confirmDelete(category)" 
                        class="group relative p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                        :disabled="deleting"
                      >
                        <div v-if="deleting && categoryToDelete?.id === category.id" class="w-5 h-5">
                          <svg class="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                        <TrashIcon v-else class="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors duration-200" />
                        <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="paginatedCategories?.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <SearchXIcon class="w-12 h-12 text-gray-300 mb-3" />
                      <p class="text-gray-500 text-lg">No categories found</p>
                      <p class="text-gray-400 text-sm mt-1">Try adjusting your search</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination with animated buttons -->
        <div v-if="!loading" class="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          <div class="text-sm text-gray-600">
            Showing <span class="font-medium text-gray-800">{{ startIndex + 1 }}</span> to 
            <span class="font-medium text-gray-800">{{ Math.min(endIndex, filteredCategories?.length) }}</span> of 
            <span class="font-medium text-gray-800">{{ filteredCategories?.length }}</span> entries
          </div>
          <div class="flex space-x-2">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1" 
              class="flex items-center px-4 py-2 border border-gray-200 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
            >
              <ChevronLeftIcon class="w-4 h-4 mr-1" />
              Previous
            </button>
            <div class="flex items-center space-x-1">
              <template v-for="page in displayedPages" :key="page">
                <button 
                  v-if="page !== '...'" 
                  @click="goToPage(page)" 
                  class="w-9 h-9 flex items-center justify-center rounded-md transition-all duration-200"
                  :class="currentPage === page 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'"
                >
                  {{ page }}
                </button>
                <span v-else class="w-9 h-9 flex items-center justify-center text-gray-500">...</span>
              </template>
            </div>
            <button 
              @click="nextPage" 
              :disabled="currentPage >= totalPages" 
              class="flex items-center px-4 py-2 border border-gray-200 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="currentPage >= totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50 hover:border-gray-300'"
            >
              Next
              <ChevronRightIcon class="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal with enhanced animations -->
    <Transition name="modal-fancy">
      <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModalWithAnimation">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"></div>
          
          <div 
            class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 overflow-hidden transform transition-all duration-500"
            :class="{ 'translate-y-0 opacity-100': modalReady, 'translate-y-8 opacity-0': !modalReady }"
          >
            <!-- Decorative elements -->
            <div class="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full opacity-50 -z-10"></div>
            <div class="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-tr-full opacity-50 -z-10"></div>
            
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {{ isEditing ? 'Edit Category' : 'Create Category' }}
              </h2>
              <button 
                @click="closeModalWithAnimation" 
                class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <XIcon class="w-6 h-6" />
              </button>
            </div>
            
            <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-6">
              <p class="text-gray-600">
                If you need more info, please check out 
                <a href="#" class="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-200 underline">
                  FAQ Page
                </a>.
              </p>
            </div>
            
            <div class="mb-6">
              <label class="block text-gray-700 font-medium mb-2">Category Name</label>
              <div class="relative">
                <input 
                  v-model="categoryForm.name" 
                  type="text" 
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="E.g Drinks, Swallow, Cakes"
                  ref="categoryInput"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                />
                <div 
                  class="absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300"
                  :style="{ width: inputFocused ? '100%' : '0%' }"
                ></div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                @click="closeModalWithAnimation" 
                class="group relative px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 overflow-hidden"
                :disabled="creating || editing"
              >
                <span class="relative z-10 font-medium">Discard</span>
                <span class="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
              </button>
              <button 
                @click="saveCategory" 
                class="group relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex items-center justify-center"
                :disabled="creating || editing"
              >
                <span v-if="creating || editing" class="mr-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                <span class="relative z-10 font-medium">Submit</span>
                <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal with enhanced animations -->
    <Transition name="modal-fancy">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDeleteModalWithAnimation">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity"></div>
          
          <div 
            class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 overflow-hidden transform transition-all duration-500"
            :class="{ 'translate-y-0 opacity-100 scale-100': deleteModalReady, 'translate-y-8 opacity-0 scale-95': !deleteModalReady }"
          >
            <div class="text-center">
              <div class="relative inline-block">
                <div class="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-30"></div>
                <div class="relative bg-red-50 p-4 rounded-full mb-4 mx-auto">
                  <AlertTriangleIcon class="w-12 h-12 text-red-500" />
                </div>
              </div>
              
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Confirm Deletion</h2>
              <p class="text-gray-600 mb-6">
                Are you sure you want to delete the category "<span class="font-medium text-red-600">{{ categoryToDelete?.name }}</span>"? 
                <br>This action cannot be undone.
              </p>
              
              <div class="flex justify-center space-x-3">
                <button 
                  @click="closeDeleteModalWithAnimation" 
                  class="group relative px-6 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 overflow-hidden"
                  :disabled="deleting"
                >
                  <span class="relative z-10 font-medium">Cancel</span>
                  <span class="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200"></span>
                </button>
                <button 
                  @click="deleteCategory" 
                  class="group relative px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden flex items-center justify-center"
                  :disabled="deleting"
                >
                  <span v-if="deleting" class="mr-2">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span class="relative z-10 font-medium">Delete</span>
                  <span class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast notifications -->
    <Transition name="toast">
      <div 
        v-if="toast.show" 
        class="fixed bottom-4 right-4 z-50 max-w-md bg-white rounded-xl shadow-lg border-l-4 p-4 transform transition-all duration-500"
        :class="{
          'border-green-500': toast.type === 'success',
          'border-red-500': toast.type === 'error',
          'border-blue-500': toast.type === 'info'
        }"
      >
        <div class="flex items-start">
          <div 
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
            :class="{
              'bg-green-100 text-green-500': toast.type === 'success',
              'bg-red-100 text-red-500': toast.type === 'error',
              'bg-blue-100 text-blue-500': toast.type === 'info'
            }"
          >
            <CheckIcon v-if="toast.type === 'success'" class="w-5 h-5" />
            <XIcon v-if="toast.type === 'error'" class="w-5 h-5" />
            <InfoIcon v-if="toast.type === 'info'" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-gray-900">{{ toast.title }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
          </div>
          <button 
            @click="hideToast" 
            class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XIcon, 
  AlertTriangleIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  SearchIcon,
  SearchXIcon,
  UtensilsCrossedIcon,
  CheckIcon,
  InfoIcon
} from 'lucide-vue-next'
import { useCreateCategory } from '@/composables/modules/category/useCreateCategory'
import { useFetchCategory } from '@/composables/modules/category/useFetchCategory'
import { useEditCategory } from '@/composables/modules/category/useEditCategory'
import { useDeleteCategory } from '@/composables/modules/category/useDeleteCategory'

const { createCategory, loading: creating } = useCreateCategory()
const { categories,  loading } = useFetchCategory()
const { editCategory: updateCategory, loading: editing } = useEditCategory()
const { deleteCategory: removeCategory, loading: deleting } = useDeleteCategory()

// Types
interface Category {
  id: number
  name: string
  menuItemCount: number
}

// State
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(10)
const showModal = ref(false)
const modalReady = ref(false)
const isEditing = ref(false)
const categoryForm = ref({ id: 0, name: '' })
const categoryInput = ref<HTMLInputElement | null>(null)
const inputFocused = ref(false)
const selectedCategory = ref<Category | null>(null)

// Pagination
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(query)
  )
})

// Calculate pagination values
const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
const endIndex = computed(() => startIndex.value + perPage.value)
const totalPages = computed(() => Math.ceil(filteredCategories.value?.length / perPage.value))

// Add the missing paginatedCategories computed property
const paginatedCategories = computed(() => {
  return filteredCategories.value?.slice(startIndex.value, endIndex.value)
})

// Generate array of page numbers to display
const displayedPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  
  if (totalPages.value <= maxPagesToShow) {
    // Show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Calculate start and end of pages to show
    let startPage = Math.max(2, currentPage.value - 1)
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    // Adjust if at the beginning
    if (currentPage.value <= 3) {
      endPage = Math.min(totalPages.value - 1, 4)
    }
    
    // Adjust if at the end
    if (currentPage.value >= totalPages.value - 2) {
      startPage = Math.max(2, totalPages.value - 3)
    }
    
    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push('...')
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages.value - 1) {
      pages.push('...')
    }
    
    // Always show last page
    if (totalPages.value > 1) {
      pages.push(totalPages.value)
    }
  }
  
  return pages
})

// Pagination controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

// Reset to first page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

// Open create modal
const openCreateModal = () => {
  isEditing.value = false
  categoryForm.value = { id: 0, name: '' }
  showModal.value = true
  
  // Animate modal in
  setTimeout(() => {
    modalReady.value = true
    nextTick(() => {
      if (categoryInput.value) {
        categoryInput.value.focus()
      }
    })
  }, 50)
}

// Edit category
const editCategoryItem = (category: Category) => {
  isEditing.value = true
  selectedCategory.value = category
  categoryForm.value = { id: category._id, name: category.name }
  showModal.value = true
  
  // Animate modal in
  setTimeout(() => {
    modalReady.value = true
    nextTick(() => {
      if (categoryInput.value) {
        categoryInput.value.focus()
      }
    })
  }, 50)
}

// Close modal with animation
const closeModalWithAnimation = () => {
  modalReady.value = false
  setTimeout(() => {
    showModal.value = false
  }, 300)
}

// Save category (create or update)
const saveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    showToast('Error', 'Category name cannot be empty', 'error')
    return
  }
  
  try {
    if (isEditing.value) {
      // console.log(categoryForm.value)
      // Update existing category
      const editPayload = {
        name: categoryForm.value.name
      }
      await updateCategory(categoryForm.value.id, editPayload)
      
      // Update local state after API call succeeds
      const index = categories.value.findIndex(c => c.id === categoryForm.value.id)
      if (index !== -1) {
        categories.value[index] = {
          ...categories.value[index],
          name: categoryForm.value.name
        }
      }
      
      // showToast('Success', `Category "${categoryForm.value.name}" has been updated`, 'success')
    } else {
      // Create new category
      const newCategoryId = await createCategory({
        name: categoryForm.value.name
      })
      
      // Add to local state after API call succeeds
      categories.value.push({
        id: newCategoryId,
        name: categoryForm.value.name,
        menuItemCount: 0
      })
      
      showToast('Success', `Category "${categoryForm.value.name}" has been created`, 'success')
    }
    
    closeModalWithAnimation()
  } catch (error) {
    showToast('Error', `Failed to ${isEditing.value ? 'update' : 'create'} category: ${error}`, 'error')
  }
}

// Delete confirmation modal
const showDeleteModal = ref(false)
const deleteModalReady = ref(false)
const categoryToDelete = ref<Category | null>(null)

// Open delete confirmation
const confirmDelete = (category: Category) => {
  console.log(category, 'category too delete')
  categoryToDelete.value = category
  showDeleteModal.value = true
  
  // Animate modal in
  setTimeout(() => {
    deleteModalReady.value = true
  }, 50)
}

// Close delete modal with animation
const closeDeleteModalWithAnimation = () => {
  deleteModalReady.value = false
  setTimeout(() => {
    showDeleteModal.value = false
    categoryToDelete.value = null
  }, 300)
}

// Delete category
const deleteCategory = async () => {
  if (!categoryToDelete.value) return
  
  try {
    await removeCategory(categoryToDelete.value._id)
    
    // Update local state after API call succeeds
    // categories.value = categories.value.filter(c => c.id !== categoryToDelete.value!.id)
    
    showToast('Success', `Category "${categoryToDelete.value.name}" has been deleted`, 'success')
    closeDeleteModalWithAnimation()
  } catch (error) {
    showToast('Error', `Failed to delete category: ${error}`, 'error')
  }
}

// Toast notifications
const toast = ref({
  show: false,
  type: 'success' as 'success' | 'error' | 'info',
  title: '',
  message: '',
  timeout: null as number | null
})

// Show toast notification
const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
  // Clear any existing timeout
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
  }
  
  // Set toast data
  toast.value = {
    show: true,
    type,
    title,
    message,
    timeout: null
  }
  
  // Auto hide after 5 seconds
  toast.value.timeout = setTimeout(() => {
    hideToast()
  }, 5000) as unknown as number
}

// Hide toast notification
const hideToast = () => {
  toast.value.show = false
  if (toast.value.timeout) {
    clearTimeout(toast.value.timeout)
    toast.value.timeout = null
  }
}

// Animation states
const contentLoaded = ref(false)

// Focus handling for input animation
const handleInputFocus = () => {
  inputFocused.value = true
}

const handleInputBlur = () => {
  inputFocused.value = false
}

// Set contentLoaded to true after component is mounted
onMounted(() => {
  setTimeout(() => {
    contentLoaded.value = true
  }, 100)
})

definePageMeta({
    layout: 'dashboard'
})
</script>

<style scoped>
/* Fancy modal animations */
.modal-fancy-enter-active,
.modal-fancy-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.modal-fancy-enter-from,
.modal-fancy-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}

/* Toast animation */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* List transitions for table rows */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>