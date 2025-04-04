import { ref } from "vue"
import { category_api } from "@/api_factory/modules/category"
import { useFetchCategory } from '@/composables/modules/category/useFetchCategory'

export const useDeleteCategory = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const result = ref(null)
  const { fetchCategory } = useFetchCategory()

  const deleteCategory = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const res = (await category_api.$_delete_category(id)) as any
      if (res.type !== "ERROR") {
        result.value = res.data
        await fetchCategory()
        return res
      } else {
        error.value = res.message || "Failed to delete category"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { deleteCategory, result, loading, error }
}