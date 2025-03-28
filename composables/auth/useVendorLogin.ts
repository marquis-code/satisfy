import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import type { Login } from "@/api_factory/modules/auth"
import { useUser } from '@/composables/auth/user'

export const useVendorLogin = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()
  const { createUser } = useUser()

  const loginVendor = async (credentials: Login) => {
    loading.value = true
    error.value = null

    try {
      const res = (await auth_api.$_vendor_login(credentials)) as any
      // console.log(res, 'tes ')
      if (res.type !== "ERROR") {
        // Handle successful login
        // console.log(res, 'reshere')
        createUser(res)
        router.push('/dashboard')
        return res
      } else {
        error.value = res.data.message || "Login failed"
      }
    } catch (err: any) {
      error.value = err.message || "An unexpected error occurred"
    } finally {
      loading.value = false
    }
  }

  return { loginVendor, loading, error }
}

