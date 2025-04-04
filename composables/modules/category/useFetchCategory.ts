import { ref } from "vue"
import { category_api } from "@/api_factory/modules/category"

export const useFetchCategory = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref(null)

  const fetchCategory = async () => {
    loading.value = true
    error.value = null

    try {
      const res = (await category_api.$_fetch_category()) as any
      console.log(res.data.data, 'res here again')
      if (res.type !== "ERROR") {
        categories.value = res.data.data
        return res.data.data
      } else {
        error.value = res.message || "Failed to fetch categories"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCategory()
  })

  return { fetchCategory, categories, loading, error }
}