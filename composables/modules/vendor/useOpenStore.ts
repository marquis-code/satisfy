import { ref } from "vue"
import { vendor_api } from "@/api_factory/modules/vendor"

export const useOpenStore = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const openStore = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await vendor_api.$_open_store()) as any
      if (res.type !== "ERROR") {
        result.value = res.data
        return res
      } else {
        error.value = res.message || "Failed to open store"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { openStore, result, loading, error }
}