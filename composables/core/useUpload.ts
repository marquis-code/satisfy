import { core_apis } from '@/api_factory/core/upload'
import { ref } from 'vue'

export const useUploadFile = () => {
  const loading = ref(false)
  const uploadResponse = ref({} as any)

  const { $_upload } = core_apis

  const uploadFile = async (file: File) => {
    loading.value = true
    try {
      // Create FormData and append the file
      const formData = new FormData()
      formData.append('file', file)

      // Make the API call with FormData
      const res = await $_upload(formData) as any
       console.log(res, 'res here')
      if (res.type !== 'ERROR') {
        uploadResponse.value = res.data.data.url ?? ""
        return res.data.data.url
      } else {
        throw new Error('Error in API response')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      loading.value = false
    }
  }

  return { uploadFile, loading, uploadResponse }
}
