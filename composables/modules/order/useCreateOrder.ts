import { ref } from "vue"
import { order_api } from "@/api_factory/modules/order"
import type { OrderPayload } from "@/api_factory/modules/order"

export const useCreateOrder = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createOrder = async (payload: OrderPayload) => {
    loading.value = true
    error.value = null

    try {
      const res = (await order_api.$_create_order(payload)) as any
      if (res.type !== "ERROR") {
        return res.data
      } else {
        error.value = res.message || "Failed to create order"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { createOrder, loading, error }
}

// import { ref } from 'vue'

// interface OrderItem {
//   menuItemId: string
//   quantity: number
// }

// interface OrderPayload {
//   vendorId: string
//   phoneNumber: string
//   deliveryType: 'delivery' | 'pickup'
//   location: string
//   address?: string
//   items: OrderItem[]
//   notes?: string
// }

// interface OrderResponse {
//   _id: string
//   vendorId: string
//   phoneNumber: string
//   deliveryType: string
//   location: string
//   address?: string
//   items: OrderItem[]
//   notes?: string
//   status: string
//   createdAt: string
//   updatedAt: string
// }

// export function useCreateOrder() {
//   const loading = ref(false)
//   const error = ref<string | null>(null)
  
//   const createOrder = async (orderData: OrderPayload): Promise<OrderResponse | null> => {
//     loading.value = true
//     error.value = null
    
//     try {
//       // In a real app, this would be an API call
//       // For demo purposes, we'll simulate an API call with a timeout
//       await new Promise(resolve => setTimeout(resolve, 1500))
      
//       // Simulate a successful response
//       const response: OrderResponse = {
//         _id: Date.now().toString(36) + Math.random().toString(36).substring(2),
//         ...orderData,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       }
      
//       return response
//     } catch (err) {
//       console.error('Error creating order:', err)
//       error.value = err instanceof Error ? err.message : 'Failed to create order'
//       return null
//     } finally {
//       loading.value = false
//     }
//   }
  
//   return {
//     createOrder,
//     loading,
//     error
//   }
// }