<script setup>
import lightGallery from 'lightgallery'; // import LightGallery
import lgZoom from 'lightgallery/plugins/zoom'; // pokud chceš plugin zoom
import lgThumbnail from 'lightgallery/plugins/thumbnail'; // pokud chceš plugin thumbnail
import { ref, onMounted } from 'vue';
import TripPhoto from './TripPhoto.vue';

// Definuj props přímo
const props = defineProps({
  images: {
    type: Array,
    required: true
  },
  oneLineDisplay: {
    type: Boolean,
    default: true
  }
});

const galleryRef = ref(null);

onMounted(() => {
  if (galleryRef.value) {
    lightGallery(galleryRef.value, {
      plugins: [lgZoom, lgThumbnail],
      speed: 500,
    });
  }
});
</script>

<template>
  <div>
    <div v-if="oneLineDisplay" ref="galleryRef" class="gallery flex gap-4 overflow-x-auto flex-nowrap">
      <a v-for="(image, index) in props.images" :key="index" :href="image" :data-lg-size="image.size" :data-src="image" class="shrink-0">
        <TripPhoto :imageSrc="image"/>
      </a>
    </div>

    <div v-else ref="galleryRef" class="gallery grid gap-3 sm:gap-4 grid-cols-2 to-xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-4">
      <a v-for="(image, index) in props.images" :key="index" :href="image" :data-lg-size="image.size" :data-src="image" class="shrink-0">
        <img :src="image" class="rounded-lg sm:rounded-3xl aspect-square object-cover cursor-pointer"/>
      </a>
    </div>
  </div>
</template>
