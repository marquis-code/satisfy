import { ref } from "vue"
import { menu_api } from "@/api_factory/modules/menu"

export const useDisableMenu = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)

  const disableMenu = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const res = (await menu_api.$_disable_menu(id)) as any
      if (res.type !== "ERROR") {
        result.value = res.data
        return res
      } else {
        error.value = res.message || "Failed to disable menu"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { disableMenu, result, loading, error }
}