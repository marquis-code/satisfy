import { ref } from "vue"
import { category_api } from "@/api_factory/modules/category"
import type { UpdateCategory } from "@/api_factory/modules/category"
import { useFetchCategory } from '@/composables/modules/category/useFetchCategory'

export const useEditCategory = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const category = ref(null)
  const { fetchCategory } = useFetchCategory()

  const editCategory = async (id: any, payload: any) => {
    loading.value = true
    error.value = null

    try {
      const res = (await category_api.$_edit_category(id, payload)) as any
      if (res.type !== "ERROR") {
        category.value = res.data
        await fetchCategory()
        return res
      } else {
        error.value = res.message || "Failed to edit category"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { editCategory, category, loading, error }
}