import { ref, reactive, computed } from 'vue'

export interface PackItem {
  id: string
  mealId: string
  name: string
  price: number
  quantity: number
}

export interface Pack {
  id: string
  items: PackItem[]
  note: string
}

// Create a reactive state that will be shared across components
const packs = ref<Pack[]>([])

export function useOrder() {
  // Initialize with data from localStorage if available
  const initializeOrder = () => {
    try {
      const savedOrder = localStorage.getItem('restaurantOrder')
      if (savedOrder) {
        packs.value = JSON.parse(savedOrder)
      }
      
      // If no saved order or empty array, create a default pack
      if (!packs.value || packs.value.length === 0) {
        packs.value = [{
          id: generateId(),
          items: [],
          note: ''
        }]
      }
    } catch (error) {
      console.error('Error loading saved order:', error)
      // Initialize with empty pack if there's an error
      packs.value = [{
        id: generateId(),
        items: [],
        note: ''
      }]
    }
  }
  
  // Save current order to localStorage
  const saveOrder = () => {
    try {
      localStorage.setItem('restaurantOrder', JSON.stringify(packs.value))
    } catch (error) {
      console.error('Error saving order:', error)
    }
  }
  
  // Set order data (used when navigating between pages)
  const setOrder = (newPacks: Pack[]) => {
    packs.value = JSON.parse(JSON.stringify(newPacks)) // Deep copy
    saveOrder()
  }
  
  // Clear the order
  const clearOrder = () => {
    packs.value = [{
      id: generateId(),
      items: [],
      note: ''
    }]
    saveOrder()
  }
  
  // Increment item quantity
  const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
    if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
      packs.value[packIndex].items[itemIndex].quantity++
      saveOrder()
    }
  }
  
  // Decrement item quantity
  const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
    if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
      const item = packs.value[packIndex].items[itemIndex]
      
      if (item.quantity > 1) {
        item.quantity--
      } else {
        // Remove item if quantity would be 0
        packs.value[packIndex].items.splice(itemIndex, 1)
        
        // If pack becomes empty and there are other packs, remove this pack
        if (packs.value[packIndex].items.length === 0 && packs.value.length > 1) {
          packs.value.splice(packIndex, 1)
        }
      }
      saveOrder()
    }
  }
  
  // Helper function to generate unique IDs
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
  
  // Calculate total items in order
  const totalItems = computed(() => {
    return packs.value.reduce((total, pack) => {
      return total + pack.items.reduce((packTotal, item) => packTotal + item.quantity, 0)
    }, 0)
  })
  
  // Initialize on first use
  if (packs.value.length === 0) {
    initializeOrder()
  }
  
  return {
    packs,
    totalItems,
    setOrder,
    clearOrder,
    incrementItemQuantity,
    decrementItemQuantity,
    initializeOrder
  }
}