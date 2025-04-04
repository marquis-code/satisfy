import { ref } from "vue"
import { menu_api } from "@/api_factory/modules/menu"

export const useFetchVendorMenu = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const menus = ref(null)
  const route = useRoute()

  const fetchVendorMenu = async () => {
    loading.value = true
    error.value = null
     const id = route.params.id as string
    try {
      const res = (await menu_api.$_fetch_vendor_menu(id)) as any
      if (res.type !== "ERROR") {
        menus.value = res.data
        return res.data
      } else {
        error.value = res.message || "Failed to fetch menus"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchVendorMenu()
  })

  return { fetchVendorMenu, menus, loading, error }
}