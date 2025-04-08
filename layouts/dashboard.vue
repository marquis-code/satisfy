<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardSidebar />
    
    <div class="md:ml-64 transition-all duration-300">
      <header class="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between sticky top-0 z-10">
        <h1 class="text-lg font-semibold text-gray-700 ml-10 md:ml-0">WELCOME!</h1>
        
        <div class="flex items-center space-x-4">
          <button class="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <MapPin size="20" />
          </button>
          
          <!-- <button class="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <Sun size="20" />
          </button> -->
          
          <!-- <div class="relative">
            <button class="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
              <Bell size="20" />
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </button>
          </div>
           -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="@/assets/img/meal2.jpg" 
                alt="Vendor" 
                class="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div class="relative hidden lg:block">
            <div class="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
              <input
                type="text"
                placeholder="Search..."
                class="bg-transparent border-none outline-none text-sm w-40"
              />
              <Search size="16" class="text-gray-500" />
            </div>
          </div>
        </div>
      </header>
      
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bell, MapPin, Search, Sun } from 'lucide-vue-next';
</script>