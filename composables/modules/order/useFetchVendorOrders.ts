import { ref } from "vue"
import { order_api } from "@/api_factory/modules/order"

export const useFetchVendorsOrder = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const orders = ref(null)

  const fetchVendorOrder = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await order_api.$_fetch_vendor_orders()) as any
      console.log(res.data.data, 'res here again')
      if (res.type !== "ERROR") {
        orders.value = res.data.data
        return res.data.data
      } else {
        error.value = res.message || "Failed to fetch orders"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchVendorOrder()
  })

  return { fetchVendorOrder, orders, loading, error }
}