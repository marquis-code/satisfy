import { ref } from "vue"
import { vendor_api } from "@/api_factory/modules/vendor"

export const useCloseStore = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const closeStore = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await vendor_api.$_close_store()) as any
      if (res.type !== "ERROR") {
        result.value = res.data
        return res
      } else {
        error.value = res.message || "Failed to close store"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { closeStore, result, loading, error }
}