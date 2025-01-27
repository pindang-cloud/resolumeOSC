<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useWebSocket } from "../composables/useWebSocket";
 
const { connectWebSocket, sendMessage } = useWebSocket();

const slides = ref([
  {
    type: "video",
    source: "/konten/konten_1.mp4",
    title: "berbunga-bunga",
    subtitle: "by : ",
  },
  {
    type: "image",
    source: "/konten/konten_2.jpg",
    title: "Summer Collection",
    subtitle: "New Arrival",
  },
  {
    type: "image",
    source: "/konten/konten_3.jpg",
    title: "Osidea Sunglasses",
    subtitle: "Made in Italy",
  },
  {
    type: "video",
    source: "/konten/konten_4.mp4",
    title: "Konten 4",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_5.mp4",
    title: "Konten 5",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_6.mp4",
    title: "Konten 6",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_7.mp4",
    title: "Konten 7",
    subtitle: "Mantap",
  },
  {
    type: "image",
    source: "/konten/konten_8.jpg",
    title: "Konten 8",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_9.mp4",
    title: "Konten 9",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_10.mp4",
    title: "Konten 10",
    subtitle: "Mantap",
  },
  {
    type: "video",
    source: "/konten/konten_11.mp4",
    title: "Konten 11",
    subtitle: "Mantap",
  },
]);

const currentSlide = ref(0);
const touchStart = ref({ x: 0, y: 0 });
const touchEnd = ref({ x: 0, y: 0 });

onMounted(() => {
  connectWebSocket();
  // Add touch event listeners
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  // Remove event listeners to prevent memory leaks
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
});

const handleTouchStart = (e) => {
  touchStart.value.x = e.touches[0].clientX;
  touchStart.value.y = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  touchEnd.value.x = e.touches[0].clientX;
  touchEnd.value.y = e.touches[0].clientY;
};

const handleTouchEnd = () => {
  const diffX = touchStart.value.x - touchEnd.value.x;
  const diffY = Math.abs(touchStart.value.y - touchEnd.value.y);

  // Check if horizontal swipe is more significant than vertical movement
  if (Math.abs(diffX) > 50 && diffY < 100) {
    if (diffX > 0) {
      // Swiped left, go to next slide
      nextSlide();
    } else {
      // Swiped right, go to previous slide
      prevSlide();
    }
  }

  // Reset touch coordinates
  touchStart.value = { x: 0, y: 0 };
  touchEnd.value = { x: 0, y: 0 };
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1;
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
// const setOpacity = (layer, opacity) => {
//   sendMessage({ type: "setOpacity", layer, opacity });
// };

// New method for hitting deck
const hitDeck = () => {
  sendOSCMessage("/composition/decks/2/select", 1);
};

</script>

<template>
   <div
    class="slider-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[90%] rounded-[2rem] shadow-2xl overflow-hidden touch-pan-y"
  >
    <!-- Navigation dots -->
    <div
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20"
    >
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
        class="min-w-full h-full relative group"
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
          />
          <!-- Gradient overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"
          ></div>
        </div>

        <!-- Content overlay -->
        <div
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4"
        >
          <h2
            class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-white tracking-tight"
          >
            {{ slide.title }}
          </h2>
          <p
            class="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 text-white/90 font-light"
          >
            {{ slide.subtitle }}
          </p>
          <button
            @click="handleChoose(index)"
            class="px-6 py-3 text-base bg-white text-black rounded-full font-medium transform transition-all duration-300 ease-out hover:scale-105 hover:bg-opacity-90 hover:shadow-lg active:scale-95"
          >
            Choose This
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation arrows -->
    <button
      @click="prevSlide"
      class="absolute left-2 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-white bg-opacity-20 text-white p-3 rounded-full shadow-lg hover:bg-black"
    >
      Previous  
    </button>
    <button
      @click="nextSlide"
      class="absolute right-2 top-1/2 -translate-y-1/2 backdrop-blur-sm bg-white bg-opacity-20 text-white p-3 rounded-full shadow-lg hover:bg-black"
    >
      Next
    </button>
  </div>
</template>

<style>
.nav-dots {
  display: flex;
  gap: 0.75rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.dot.active {
  background: white;
}
</style>