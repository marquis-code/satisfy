import { ref } from "vue"
import { vendor_api } from "@/api_factory/modules/vendor"

export const useFetchVendors = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const vendors = ref(null)

  const fetchVendors = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await vendor_api.$_fetch_vendors()) as any
      console.log(res, 'res here')
      if (res.type !== "ERROR") {
        vendors.value = res.data
        return res.data
      } else {
        error.value = res.message || "Failed to fetch vendors"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchVendors()
  })

  return { fetchVendors, vendors, loading, error }
}