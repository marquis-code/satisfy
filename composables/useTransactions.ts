import { ref } from 'vue'

export interface Transaction {
  id: number
  title: string
  details: string
  amount: string
  before: string
  after: string
  dateTime: string
  status: 'Completed' | 'Pending' | 'Failed'
  action?: string
}

export function useTransactions() {
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTransactions = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // In a real app, you would fetch from your API
      // const response = await fetch('/api/transactions')
      // const data = await response.json()
      // transactions.value = data
      
      // For demo purposes, we'll use empty array to match the screenshot
      transactions.value = []
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err) {
      error.value = 'Failed to fetch transactions'
      // console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newId = transactions.value.length > 0 
      ? Math.max(...transactions.value.map(t => t.id)) + 1 
      : 1
      
    transactions.value.push({
      id: newId,
      ...transaction
    })
  }

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction
  }
}