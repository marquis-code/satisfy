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

// import { ref, onMounted } from 'vue'

// interface MenuItem {
//   _id: string
//   name: string
//   price: number
//   categoryId: string
//   isEnabled: boolean
//   vendorId: string
//   isDeleted: boolean
//   createdAt: string
//   updatedAt: string
//   __v: number
// }

// export function useFetchVendorMenu() {
//   const menus = ref<MenuItem[]>([])
//   const loading = ref(false)
//   const error = ref<string | null>(null)
  
//   const fetchMenus = async () => {
//     loading.value = true
//     error.value = null
    
//     try {
//       // In a real app, this would be an API call
//       // For demo purposes, we'll use mock data
//       await new Promise(resolve => setTimeout(resolve, 1000))
      
//       // Mock data based on the provided structure
//       menus.value = [
//         {
//           "_id": "67e9c5d1e4ca7f8d6e4fdbf4",
//           "name": "Meat Pie",
//           "price": 800,
//           "categoryId": "67e99c7c75fd1edfe06f2630",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": false,
//           "createdAt": "2025-03-30T22:29:37.738Z",
//           "updatedAt": "2025-03-30T22:29:37.738Z",
//           "__v": 0
//         },
//         {
//           "_id": "67e9c875738bd34efb8e3c3b",
//           "name": "Chocolate Caramel",
//           "price": 1000,
//           "categoryId": "67e9c304fde3d0cadc7e1c49",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": true,
//           "createdAt": "2025-03-30T22:40:53.750Z",
//           "updatedAt": "2025-03-30T23:26:54.046Z",
//           "__v": 0
//         },
//         {
//           "_id": "67e9d20e95896a435cac3b43",
//           "name": "Candy floss",
//           "price": 800,
//           "categoryId": "67e99c7c75fd1edfe06f2630",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": false,
//           "createdAt": "2025-03-30T23:21:50.778Z",
//           "updatedAt": "2025-03-30T23:35:45.495Z",
//           "__v": 0
//         },
//         {
//           "_id": "67e9d30e95896a435cac3b44",
//           "name": "Jollof Rice",
//           "price": 1500,
//           "categoryId": "67e99c7c75fd1edfe06f2630",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": false,
//           "createdAt": "2025-03-30T23:21:50.778Z",
//           "updatedAt": "2025-03-30T23:35:45.495Z",
//           "__v": 0
//         },
//         {
//           "_id": "67e9d40e95896a435cac3b45",
//           "name": "Fried Rice",
//           "price": 1500,
//           "categoryId": "67e99c7c75fd1edfe06f2630",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": false,
//           "createdAt": "2025-03-30T23:21:50.778Z",
//           "updatedAt": "2025-03-30T23:35:45.495Z",
//           "__v": 0
//         },
//         {
//           "_id": "67e9d50e95896a435cac3b46",
//           "name": "Chicken",
//           "price": 2000,
//           "categoryId": "67e99c7c75fd1edfe06f2630",
//           "isEnabled": true,
//           "vendorId": "67e9779ec95d6d2f34e0e324",
//           "isDeleted": false,
//           "createdAt": "2025-03-30T23:21:50.778Z",
//           "updatedAt": "2025-03-30T23:35:45.495Z",
//           "__v": 0
//         }
//       ]
//     } catch (err) {
//       console.error('Error fetching menus:', err)
//       error.value = err instanceof Error ? err.message : 'Failed to fetch menus'
//     } finally {
//       loading.value = false
//     }
//   }
  
//   onMounted(() => {
//     fetchMenus()
//   })
  
//   return {
//     menus,
//     loading,
//     error,
//     fetchMenus
//   }
// }