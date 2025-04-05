// import { ref, computed, watch } from 'vue'

// // Define types
// export interface CartItem {
//   id: string
//   mealId: string
//   name: string
//   price: number
//   quantity: number
//   image?: string
// }

// export interface Pack {
//   id: string
//   items: CartItem[]
//   note: string
// }

// // Create a state that persists between component instances
// const packs = ref<Pack[]>([])
// const initialized = ref(false)
// const loading = ref(false)

// export function useCart() {
//   // Generate a unique ID
//   const generateId = () => {
//     return Date.now().toString(36) + Math.random().toString(36).substring(2)
//   }
  
//   // Initialize cart from localStorage
//   const initCart = () => {
//     if (initialized.value) return
    
//     loading.value = true
    
//     try {
//       const savedCart = localStorage.getItem('restaurantCart')
//       if (savedCart) {
//         packs.value = JSON.parse(savedCart)
//       }
      
//       // If no saved cart or empty array, create a default pack
//       if (!packs.value || packs.value.length === 0) {
//         packs.value = [{
//           id: generateId(),
//           items: [],
//           note: ''
//         }]
//       }
      
//       initialized.value = true
//     } catch (error) {
//       console.error('Error loading saved cart:', error)
//       // Initialize with empty pack if there's an error
//       packs.value = [{
//         id: generateId(),
//         items: [],
//         note: ''
//       }]
//       initialized.value = true
//     } finally {
//       loading.value = false
//     }
//   }
  
//   // Save cart to localStorage
//   const saveCart = () => {
//     try {
//       localStorage.setItem('restaurantCart', JSON.stringify(packs.value))
//     } catch (error) {
//       console.error('Error saving cart:', error)
//     }
//   }
  
//   // Watch for changes and save to localStorage
//   watch(packs, () => {
//     saveCart()
//   }, { deep: true })
  
//   // Add item to a specific pack
//   const addItemToPack = (packIndex: number, item: { mealId: string, name: string, price: number, image?: string }, quantity: number) => {
//     // Ensure the pack exists
//     if (!packs.value[packIndex]) {
//       console.error('Pack does not exist:', packIndex)
//       return false
//     }
    
//     // Check if the item already exists in the pack
//     const existingItemIndex = packs.value[packIndex].items.findIndex(
//       i => i.mealId === item.mealId
//     )
    
//     if (existingItemIndex !== -1) {
//       // Update quantity if item exists
//       packs.value[packIndex].items[existingItemIndex].quantity += quantity
//     } else {
//       // Add new item if it doesn't exist
//       packs.value[packIndex].items.push({
//         id: generateId(),
//         mealId: item.mealId,
//         name: item.name,
//         price: item.price,
//         quantity: quantity,
//         image: item.image
//       })
//     }
    
//     saveCart()
//     return true
//   }
  
//   // Remove item from pack
//   const removeItemFromPack = (packIndex: number, itemIndex: number) => {
//     if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
//       packs.value[packIndex].items.splice(itemIndex, 1)
//       saveCart()
//       return true
//     }
//     return false
//   }
  
//   // Add a new empty pack
//   const addNewPack = () => {
//     packs.value.push({
//       id: generateId(),
//       items: [],
//       note: ''
//     })
//     saveCart()
//     return true
//   }
  
//   // Duplicate an existing pack
//   const duplicatePack = (packIndex: number) => {
//     if (packs.value[packIndex]) {
//       const packToDuplicate = packs.value[packIndex]
//       const newItems = packToDuplicate.items.map(item => ({
//         ...item,
//         id: generateId()
//       }))
      
//       packs.value.push({
//         id: generateId(),
//         items: newItems,
//         note: packToDuplicate.note
//       })
      
//       saveCart()
//       return true
//     }
//     return false
//   }
  
//   // Remove a pack
//   const removePack = (packIndex: number) => {
//     if (packs.value.length > 1 && packs.value[packIndex]) {
//       packs.value.splice(packIndex, 1)
//       saveCart()
//       return true
//     }
//     return false
//   }
  
//   // Update pack note
//   const updatePackNote = (packIndex: number, note: string) => {
//     if (packs.value[packIndex]) {
//       packs.value[packIndex].note = note
//       saveCart()
//       return true
//     }
//     return false
//   }
  
//   // Clear all packs and create a new empty one
//   const clearCart = () => {
//     packs.value = [{
//       id: generateId(),
//       items: [],
//       note: ''
//     }]
//     saveCart()
//     return true
//   }
  
//   // Increment item quantity
//   const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
//     if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
//       packs.value[packIndex].items[itemIndex].quantity++
//       saveCart()
//       return true
//     }
//     return false
//   }
  
//   // Decrement item quantity
//   const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
//     if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
//       const item = packs.value[packIndex].items[itemIndex]
      
//       if (item.quantity > 1) {
//         item.quantity--
//         saveCart()
//         return true
//       } else {
//         return removeItemFromPack(packIndex, itemIndex)
//       }
//     }
//     return false
//   }
  
//   // Calculate total items in cart
//   const totalItems = computed(() => {
//     return packs.value.reduce((total, pack) => {
//       return total + pack.items.reduce((packTotal, item) => packTotal + item.quantity, 0)
//     }, 0)
//   })
  
//   // Calculate subtotal
//   const subtotal = computed(() => {
//     return packs.value.reduce((total, pack) => {
//       return total + pack.items.reduce((packTotal, item) => packTotal + (item.price * item.quantity), 0)
//     }, 0)
//   })
  
//   // Initialize cart if not already done
//   if (!initialized.value) {
//     initCart()
//   }
  
//   return {
//     packs,
//     totalItems,
//     subtotal,
//     loading,
//     addItemToPack,
//     removeItemFromPack,
//     addNewPack,
//     duplicatePack,
//     removePack,
//     updatePackNote,
//     clearCart,
//     initCart,
//     incrementItemQuantity,
//     decrementItemQuantity
//   }
// }

import { ref, computed, watch } from 'vue'

// Define types
export interface CartItem {
  id: string
  mealId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Pack {
  id: string
  items: CartItem[]
  note: string
}

// Create a state that persists between component instances
const packs = ref<Pack[]>([])
const initialized = ref(false)
const loading = ref(false)

export function useCart() {
  // Generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
  
  // Initialize cart from localStorage
  const initCart = () => {
    if (initialized.value) return
    
    loading.value = true
    
    try {
      const savedCart = localStorage.getItem('restaurantCart')
      if (savedCart) {
        packs.value = JSON.parse(savedCart)
      }
      
      // If no saved cart or empty array, create a default pack
      if (!packs.value || packs.value.length === 0) {
        packs.value = [{
          id: generateId(),
          items: [],
          note: ''
        }]
      }
      
      initialized.value = true
    } catch (error) {
      console.error('Error loading saved cart:', error)
      // Initialize with empty pack if there's an error
      packs.value = [{
        id: generateId(),
        items: [],
        note: ''
      }]
      initialized.value = true
    } finally {
      loading.value = false
    }
  }
  
  // Save cart to localStorage
  const saveCart = () => {
    try {
      localStorage.setItem('restaurantCart', JSON.stringify(packs.value))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }
  
  // Watch for changes and save to localStorage
  watch(packs, () => {
    saveCart()
  }, { deep: true })
  
  // Add item to a specific pack
  const addItemToPack = (packIndex: number, item: { mealId: string, name: string, price: number, image?: string }, quantity: number) => {
    // Ensure the pack exists
    if (!packs.value[packIndex]) {
      console.error('Pack does not exist:', packIndex)
      return false
    }
    
    // Check if the item already exists in the pack
    const existingItemIndex = packs.value[packIndex].items.findIndex(
      i => i.mealId === item.mealId
    )
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      packs.value[packIndex].items[existingItemIndex].quantity += quantity
    } else {
      // Add new item if it doesn't exist
      packs.value[packIndex].items.push({
        id: generateId(),
        mealId: item.mealId,
        name: item.name,
        price: item.price,
        quantity: quantity,
        image: item.image
      })
    }
    
    saveCart()
    return true
  }
  
  // Remove item from pack
  const removeItemFromPack = (packIndex: number, itemIndex: number) => {
    if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
      packs.value[packIndex].items.splice(itemIndex, 1)
      saveCart()
      return true
    }
    return false
  }
  
  // Add a new empty pack
  const addNewPack = () => {
    packs.value.push({
      id: generateId(),
      items: [],
      note: ''
    })
    saveCart()
    return true
  }
  
  // Duplicate an existing pack
  const duplicatePack = (packIndex: number) => {
    if (packs.value[packIndex]) {
      const packToDuplicate = packs.value[packIndex]
      const newItems = packToDuplicate.items.map(item => ({
        ...item,
        id: generateId()
      }))
      
      packs.value.push({
        id: generateId(),
        items: newItems,
        note: packToDuplicate.note
      })
      
      saveCart()
      return true
    }
    return false
  }
  
  // Remove a pack
  const removePack = (packIndex: number) => {
    if (packs.value.length > 1 && packs.value[packIndex]) {
      packs.value.splice(packIndex, 1)
      saveCart()
      return true
    }
    return false
  }
  
  // Update pack note
  const updatePackNote = (packIndex: number, note: string) => {
    if (packs.value[packIndex]) {
      packs.value[packIndex].note = note
      saveCart()
      return true
    }
    return false
  }
  
  // Clear all packs and create a new empty one
  const clearCart = () => {
    packs.value = [{
      id: generateId(),
      items: [],
      note: ''
    }]
    saveCart()
    return true
  }
  
  // Increment item quantity
  const incrementItemQuantity = (packIndex: number, itemIndex: number) => {
    if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
      packs.value[packIndex].items[itemIndex].quantity++
      saveCart()
      return true
    }
    return false
  }
  
  // Decrement item quantity
  const decrementItemQuantity = (packIndex: number, itemIndex: number) => {
    if (packs.value[packIndex] && packs.value[packIndex].items[itemIndex]) {
      const item = packs.value[packIndex].items[itemIndex]
      
      if (item.quantity > 1) {
        item.quantity--
        saveCart()
        return true
      } else {
        return removeItemFromPack(packIndex, itemIndex)
      }
    }
    return false
  }
  
  // Calculate total items in cart
  const totalItems = computed(() => {
    return packs.value.reduce((total, pack) => {
      return total + pack.items.reduce((packTotal, item) => packTotal + item.quantity, 0)
    }, 0)
  })
  
  // Calculate subtotal
  const subtotal = computed(() => {
    return packs.value.reduce((total, pack) => {
      return total + pack.items.reduce((packTotal, item) => packTotal + (item.price * item.quantity), 0)
    }, 0)
  })
  
  // Convert packs to API order format
  const getOrdersForAPI = (customerInfo: {
    phoneNumber: string,
    deliveryType: 'delivery' | 'pickup',
    location: string,
    address?: string,
    vendorId: string
  }) => {
    return packs.value.map(pack => {
      return {
        vendorId: customerInfo.vendorId,
        phoneNumber: customerInfo.phoneNumber,
        deliveryType: customerInfo.deliveryType,
        location: customerInfo.location,
        address: customerInfo.address || '',
        items: pack.items.map(item => ({
          menuItemId: item.mealId,
          quantity: item.quantity
        })),
        notes: pack.note
      }
    }).filter(order => order.items.length > 0); // Only include packs with items
  }
  
  // Initialize cart if not already done
  if (!initialized.value) {
    initCart()
  }
  
  return {
    packs,
    totalItems,
    subtotal,
    loading,
    addItemToPack,
    removeItemFromPack,
    addNewPack,
    duplicatePack,
    removePack,
    updatePackNote,
    clearCart,
    initCart,
    incrementItemQuantity,
    decrementItemQuantity,
    getOrdersForAPI
  }
}