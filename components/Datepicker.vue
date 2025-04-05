<template>
    <div class="bg-white border border-gray-300 rounded-md shadow-lg p-4 w-64">
      <div class="flex justify-between items-center mb-2">
        <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded">
          <ChevronLeftIcon class="h-5 w-5 text-gray-600" />
        </button>
        <div class="text-gray-700 font-medium">
          {{ currentMonthName }} {{ currentYear }}
        </div>
        <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
          <ChevronRightIcon class="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div class="grid grid-cols-7 gap-1 text-center mb-2">
        <div v-for="day in weekDays" :key="day" class="text-xs text-gray-500 font-medium py-1">
          {{ day }}
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-1 text-center">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="text-sm py-1 rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer"
          :class="getDayClasses(day)"
          @click="selectDate(day)"
        >
          {{ day.getDate() }}
        </div>
      </div>
      
      <div class="mt-4 flex justify-end">
        <button 
          @click="$emit('close')" 
          class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Close
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'
  
  const props = defineProps<{
    modelValue: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
    (e: 'close'): void
  }>()
  
  // State
  const currentDate = ref(props.modelValue ? new Date(props.modelValue) : new Date())
  const currentMonth = ref(currentDate.value.getMonth())
  const currentYear = ref(currentDate.value.getFullYear())
  
  // Computed
  const weekDays = computed(() => ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'])
  
  const currentMonthName = computed(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[currentMonth.value]
  })
  
  const calendarDays = computed(() => {
    const days = []
    const firstDay = new Date(currentYear.value, currentMonth.value, 1)
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
    
    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay()
    if (firstDayOfWeek > 0) {
      const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(currentYear.value, currentMonth.value - 1, prevMonthLastDay - i)
        days.push(day)
      }
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(currentYear.value, currentMonth.value, i)
      days.push(day)
    }
    
    // Add days from next month to complete the last week
    const lastDayOfWeek = lastDay.getDay()
    if (lastDayOfWeek < 6) {
      for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
        const day = new Date(currentYear.value, currentMonth.value + 1, i)
        days.push(day)
      }
    }
    
    return days
  })
  
  // Methods
  const prevMonth = () => {
    if (currentMonth.value === 0) {
      currentMonth.value = 11
      currentYear.value--
    } else {
      currentMonth.value--
    }
  }
  
  const nextMonth = () => {
    if (currentMonth.value === 11) {
      currentMonth.value = 0
      currentYear.value++
    } else {
      currentMonth.value++
    }
  }
  
  const selectDate = (day: Date) => {
    const formattedDate = `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`
    emit('update:modelValue', formattedDate)
    emit('close')
  }
  
  const getDayClasses = (day: Date) => {
    const isCurrentMonth = day.getMonth() === currentMonth.value
    const isToday = isSameDay(day, new Date())
    const isSelected = props.modelValue && isSameDay(day, new Date(props.modelValue))
    
    return {
      'text-gray-400': !isCurrentMonth,
      'text-gray-700': isCurrentMonth && !isToday && !isSelected,
      'bg-gray-200': isToday && !isSelected,
      'bg-orange-500 text-white': isSelected
    }
  }
  
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }
  
  // Watch for external changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      const date = new Date(newValue)
      currentMonth.value = date.getMonth()
      currentYear.value = date.getFullYear()
    }
  })
  </script>