import { ref } from 'vue'

export function useWallet() {
  const balance = ref(0.00)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchBalance = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real app, you would fetch from your API
      // const response = await fetch('/api/wallet/balance')
      // const data = await response.json()
      // balance.value = data.balance
      
      // For demo purposes, we'll use 0.00 to match the screenshot
      balance.value = 0.00
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err) {
      error.value = 'Failed to fetch wallet balance'
      // console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const withdraw = async (amount: number) => {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }
    
    if (amount > balance.value) {
      throw new Error('Insufficient balance')
    }
    
    isLoading.value = true
    error.value = null
    
    try {
      // In a real app, you would call your API
      // await fetch('/api/wallet/withdraw', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount })
      // })
      
      // For demo purposes, we'll just update the balance
      balance.value -= amount
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      return true
    } catch (err) {
      error.value = 'Failed to process withdrawal'
      // console.error(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    balance,
    isLoading,
    error,
    fetchBalance,
    withdraw
  }
}