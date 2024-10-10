<script setup>
import { ref, onMounted } from 'vue';

// defineProps allows passing values to component
const props = defineProps({
    title: {
        type: String,
        //default: '' // optional default can be added
    },
    country: {
        type: String,
    },
    from_date: {
        type: String,
    },
    until_date: {
        type: String,
    },
    image: { //TODO
        type: String,
    }
})

const formattedFromDate = ref(null);
const formattedUntilDate = ref(null);

onMounted(() => {
  if (props.from_date) {
    const dateParts = props.from_date.split('-');
    formattedFromDate.value = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
  }
  if (props.until_date) {
    const dateParts = props.until_date.split('-');
    formattedUntilDate.value = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
  }
});

</script>

<template>
    <a href="">
        <div class="relative my-2 sm:my-3 max-w-80 to-xs:w-52 to-xs:h-44 sm:w-60 sm:h-52 md:w-72 md:h-64 lg:w-60 lg:h-52 xl:w-72 xl:h-64 rounded-lg overflow-hidden shadow-card-shadow transition-shadow duration-300 hover:shadow-card-shadow-hover ">
            <img src="https://flowbite.com/docs/images/blog/image-1.jpg" class="w-full h-full object-cover">
            
            <!-- Overlay and text -->
            <div class="absolute bottom-0 left-0 right-0 h-1/2.5 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
            <div class="text-white">
                <h2 class="text-3xl font-bold line-clamp-2 drop-shadow-lg">{{ title }}</h2>
                <p class="text-lg drop-shadow-md">{{ country }}</p>
                <p class="drop-shadow-sm">{{  formattedFromDate }} - {{ formattedUntilDate }}</p>
            </div>
            </div>
        </div>
    </a>
</template>