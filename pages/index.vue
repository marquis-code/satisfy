<template>
  <div class="min-h-screen overflow-hidden bg-white">
    <WelcomeOverlay />
    <!-- <Header /> -->
    <!-- Food Particles Background -->
    <!-- <div class="fixed inset-0 pointer-events-none z-0">
      <div v-for="i in 12" :key="i" 
        class="absolute food-particle"
        :class="`food-${(i % 6) + 1}`"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${15 + Math.random() * 15}s`
        }"
      ></div>
    </div> -->
    

    <div class="relative z-10 min-h-screen flex flex-col">

      <header class="py-6 px-6 md:px-10 bg-white shadow-sm">
        <div class="container mx-auto flex justify-between items-center">
          <div class="flex items-center">
            <img src="@/assets/img/satisfy-logo-coloured.png" alt="CTTaste" class="h-10 animate-bounce-subtle" />
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
      
<!-- 
      <div class="flex-1 flex flex-col items-center justify-center px-6 py-10 md:py-0">
        <div class="container px-4 w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          <div class="flex flex-col justify-center order-2 lg:order-1 animate-fade-in">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-800 mb-6 animate-slide-up">
              <span class="text-primary">Delicious</span> food,<br />
              <span class="text-secondary">delivered</span> to<br />
              your doorstep
            </h1>
            
            <p class="text-xl text-gray-600 mb-8 animate-slide-up animation-delay-200">
              Order your favorite meals from any food vendor on campus with just a few taps.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
              <button 
                @click="navigateTo('/register')"
                class="group relative flex items-center justify-center py-3 px-6 rounded-full text-white font-medium overflow-hidden bg-primary hover:bg-primary-dark transition-colors"
              >
                <span class="relative z-10">Get Started</span>
                <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                @click="navigateTo('/register')"
                class="group relative flex items-center justify-center py-3 px-6 rounded-full border-2 border-secondary text-secondary font-medium overflow-hidden hover:bg-secondary/10 transition-colors"
              >
                <span class="relative z-10">Learn More</span>
                <Info class="w-5 h-5 ml-2" />
              </button>
            </div>
            

            <div class="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in animation-delay-600">
              <div class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div class="p-3 rounded-full inline-flex items-center justify-center mb-3 bg-primary/10">
                  <Utensils class="w-6 h-6 text-primary" />
                </div>
                <h3 class="font-semibold text-gray-800">Wide Selection</h3>
                <p class="text-gray-600 text-sm">Choose from hundreds of restaurants</p>
              </div>
              
              <div class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div class="p-3 rounded-full inline-flex items-center justify-center mb-3 bg-secondary/10">
                  <Clock class="w-6 h-6 text-secondary" />
                </div>
                <h3 class="font-semibold text-gray-800">Fast Delivery</h3>
                <p class="text-gray-600 text-sm">Get your food delivered quickly</p>
              </div>
              
              <div class="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div class="p-3 rounded-full inline-flex items-center justify-center mb-3 bg-accent/10">
                  <BadgePercent class="w-6 h-6 text-accent" />
                </div>
                <h3 class="font-semibold text-gray-800">Special Offers</h3>
                <p class="text-gray-600 text-sm">Exclusive deals for students</p>
              </div>
            </div>
          </div>
          

          <div class="flex items-center justify-center order-1 lg:order-2">
            <div class="relative w-full max-w-md">

              <div class="relative z-20 animate-float animation-delay-300">

                <div class="absolute inset-0 flex flex-col items-center justify-center p-10">
                  <div class="w-full space-y-3 animate-pulse-slow">
                    <div class="h-2 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
                    <div class="h-2 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
                    <div class="h-8 bg-primary/20 rounded-lg w-full mx-auto mt-4"></div>
                  </div>
                </div>
              </div>
              

              <div class="absolute top-0 -right-16 z-10 animate-float animation-delay-100">
              </div>
              
              <div class="absolute bottom-20 -left-16 z-10 animate-float animation-delay-500">
              </div>
              
              <div class="absolute top-1/4 -left-12 z-10 animate-float animation-delay-700">
              </div>
          
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full filter blur-xl animate-pulse-slow"></div>
              <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full filter blur-xl animate-pulse-slow animation-delay-500"></div>
            </div>
          </div>
        </div>
      </div> -->

      <main class="container mx-auto px-4 pb-10">
        <!-- {{vendors}} -->
      <PromotedVendors />
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
          
          <!-- App Stores -->
          <!-- <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <p class="text-gray-700 font-medium">Download our mobile app:</p>
            <button class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src="/images/app-store.svg" alt="App Store" class="h-8" />
            </button>
            <button class="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <img src="/images/play-store.svg" alt="Play Store" class="h-8" />
            </button>
          </div> -->
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