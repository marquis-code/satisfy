<template>
  <div class="min-h-screen overflow-hidden bg-white">
    <WelcomeOverlay />

    <div class="relative z-10 min-h-screen flex flex-col">

      <header class="py-6 px-6 md:px-10 bg-white shadow-sm">
        <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center">
            <img src="@/assets/img/satisfy-logo-coloured.png" alt="Satisfy" class="h-10 animate-bounce-subtle" />
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/login" class="text-gray-700 hover:text-primary transition-colors">
              Already have an account?
            </NuxtLink>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 pb-10">
      <FoodBannerCarousel />
     </div>
      <main class="container mx-auto px-4 pb-10">
        <!-- {{vendors}} -->
      <!-- <PromotedVendors /> -->
      <VendorsInFunaab />
    </main>
      
      <!-- Bottom Section -->
      <div class="py-8 px-6 bg-gray-50">
        <div class="container mx-auto">
          <!-- Testimonials Carousel -->
          <div class="max-w-4xl mx-auto overflow-hidden">
            <div class="animate-marquee whitespace-nowrap">
              <div v-for="i in 5" :key="i" class="inline-block mx-4 px-6 py-4 bg-white rounded-lg shadow-md">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z"></path></svg>
                    <!-- <img :src="`/images/avatar-${i}.png`" alt="User" class="w-10 h-10 rounded-full" /> -->
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-600 text-sm">"The food arrived hot and fresh. Great service!"</p>
                    <p class="text-gray-800 font-medium text-sm mt-1">Student, {{ ['FUTA', 'OAU', 'UI', 'UNILAG', 'UNIBEN'][i-1] }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFetchVendors } from '@/composables/modules/vendor/useFetchVendors'
import { ArrowRight, Info, Utensils, Clock, BadgePercent, Pizza,  } from 'lucide-vue-next';
const { vendors, loading } = useFetchVendors()
</script>

<style scoped>
.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.8s ease-out forwards;
}

@keyframes bounce-subtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>