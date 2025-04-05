import { ref } from "vue"
import { vendor_api } from "@/api_factory/modules/vendor"

export const useFetchVendorById = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const vendor = ref(null)
  const route  = useRoute()

  const fetchVendorById = async () => {
    loading.value = true
    error.value = null
    const user = JSON.parse(localStorage.getItem('user'))
    const id = route?.params?.id || user._id  as string

    try {
      const res = (await vendor_api.$_fetch_vendor_by_id(id)) as any
      if (res.type !== "ERROR") {
        vendor.value = res.data
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
    fetchVendorById()
  })

  return { fetchVendorById, vendor, loading, error }
}