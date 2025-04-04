import { ref } from "vue"
import { menu_api } from "@/api_factory/modules/menu"
import { useFetchMenu } from '@/composables/modules/menu/useFetchMenu'

export const useDeleteMenu = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)
  const { fetchMenu } = useFetchMenu()

  const deleteMenu = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const res = (await menu_api.$_delete_menu(id)) as any
      if (res.type !== "ERROR") {
        result.value = res.data
        fetchMenu()
        return res
      } else {
        error.value = res.message || "Failed to delete menu"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { deleteMenu, result, loading, error }
}