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