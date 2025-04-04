import { ref } from "vue"
import { menu_api } from "@/api_factory/modules/menu"

export const useFetchMenu = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const menus = ref(null)

  const fetchMenu = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await menu_api.$_fetch_menu()) as any
      if (res.type !== "ERROR") {
        menus.value = res.data.data
        return res.data.data
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
    fetchMenu()
  })

  return { fetchMenu, menus, loading, error }
}