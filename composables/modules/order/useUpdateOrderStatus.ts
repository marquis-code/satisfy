import { ref } from "vue"
import { order_api } from "@/api_factory/modules/order"

export const useUpdateOrderStatus = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateOrderStatus = async (id: string, payload: any) => {
    loading.value = true
    error.value = null

    try {
      const res = (await order_api.$_update_order_status(id, payload)) as any
      if (res.type !== "ERROR") {
        return res
      } else {
        error.value = res.message || "Failed to update order status"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { updateOrderStatus, loading, error }
}