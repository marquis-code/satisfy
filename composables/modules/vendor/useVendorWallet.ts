import { ref } from "vue"
import { vendor_api } from "@/api_factory/modules/vendor"

export const useVendorWallet = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const wallet = ref(null)

  const fetchWallet = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await vendor_api.$_fetch_wallet()) as any
      if (res.type !== "ERROR") {
        wallet.value = res.data
        return res
      } else {
        error.value = res.message || "Failed to fetch wallet"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchWallet()
  })

  return { fetchWallet, wallet, loading, error }
}