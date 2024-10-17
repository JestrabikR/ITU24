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
    <div ref="galleryRef" class="gallery flex gap-4 overflow-x-auto flex-nowrap">
      <a v-for="(image, index) in props.images" :key="index" :href="image" :data-lg-size="image.size" :data-src="image" class="shrink-0">
        <TripPhoto :imageSrc="image"/>
      </a>
    </div>
  </div>
</template>
