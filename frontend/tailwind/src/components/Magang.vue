<script setup>
import { ref, onMounted } from 'vue';
import { useWebSocket } from '../composables/useWebSocket';

const { connectWebSocket, sendMessage } = useWebSocket();

const slides = ref([
  {
    type: 'video',
    source: '/konten/konten_1.mp4',
    title: 'Osidea Sunglasses',
    subtitle: 'Made in Italy'
  },
  {
    type: 'video',
    source: '/konten/konten_2.mp4',
    title: 'Summer Collection',
    subtitle: 'New Arrival'
  },
  {
    type: 'video',
    source: '/konten/konten_3.mp4',
    title: 'Osidea Sunglasses',
    subtitle: 'Made in Italy'
  },
  {
    type: 'video',
    source: '/konten/konten_4.mp4',
    title: 'Konten 4',
    subtitle: 'Mantap'
  },
]);

const currentSlide = ref(0);

onMounted(() => {
  connectWebSocket();
});

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 
    ? slides.value.length - 1 
    : currentSlide.value - 1;
};

const setSlide = (index) => {
  currentSlide.value = index;
};

const handleChoose = (slideIndex) => {
  playClip(1, slideIndex + 1);
  setOpacity(1, 0.8);
};

const playClip = (layer, clip) => {
  sendMessage({ type: "playClip", layer, clip });
};

const setOpacity = (layer, opacity) => {
  sendMessage({ type: "setOpacity", layer, opacity });
};
</script>

<template>
  <div class="slider-container relative overflow-hidden w-full  rounded-[2rem] shadow-2xl bg-gradient-to-b from-gray-900 to-black">
    <!-- Navigation dots -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
      <div class="nav-dots">
        <span 
          v-for="(slide, index) in slides" 
          :key="index"
          :class="['dot', { active: currentSlide === index }]"
          @click="setSlide(index)"
        ></span>
      </div>
    </div>
    

    <!-- Slider content -->
    <div 
  class="flex h-full transition-transform duration-700 ease-in-out"
  :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
>

      <div 
        v-for="(slide, index) in slides" 
        :key="index" 
        class="min-w-full relative group"
      >
        <!-- Media container with overlay gradient -->
        <div class="relative w-full h-full">
          <video 
            v-if="slide.type === 'video'" 
            :src="slide.source" 
            autoplay 
            loop 
            muted 
            class="w-full h-full object-cover"
          ></video>
          <img 
            v-else 
            :src="slide.source" 
            alt="Slide image" 
            class="w-full h-full object-cover"
          >
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>
        
        <!-- Content overlay -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-6 sm:px-12 md:px-16">
          <h2 class="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 sm:mb-4 md:mb-6 text-white tracking-tight">
            {{ slide.title }}
          </h2>
          <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 md:mb-10 text-white/90 font-light">
            {{ slide.subtitle }}
          </p>
          <button 
            @click="handleChoose(index)"
            class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg md:text-xl 
                   bg-white text-black rounded-full font-medium
                   transform transition-all duration-300 ease-out
                   hover:scale-105 hover:bg-opacity-90 hover:shadow-lg
                   active:scale-95"
          >
            Choose This
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation arrows -->
    <button @click="prevSlide" class="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-white bg-opacity-20 ext-gray-700 p-4 rounded-full shadow-lg hover:bg-gray-200">
      ⬅
    </button>
    <button @click="nextSlide" class="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-white bg-opacity-20 text-gray-700 p-4 rounded-full shadow-lg hover:bg-gray-200">
      ➡
    </button>
  </div>

   
 
</template>

<style>
  .nav-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: white;
}
.rd-label {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
}

</style>