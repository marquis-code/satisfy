import { ref } from "vue"
import { order_api } from "@/api_factory/modules/order"

export const useFetchVendorTodaysOrder = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const ordersList = ref(null)

  const fetchVendorTodaysOrder = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await order_api.$_get_vendor_todays_order()) as any
      console.log(res.data.data, 'res here again')
      if (res.type !== "ERROR") {
        ordersList.value = res.data.data
        return res.data.data
      } else {
        error.value = res.message || "Failed to fetch todays orders"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchVendorTodaysOrder()
  })

  return { fetchVendorTodaysOrder, ordersList, loading, error }
}