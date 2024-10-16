<script setup>
import { ref } from 'vue';

defineProps({
    text: {
        type: String
    }
});

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

</script>

<template>
    <p v-if="isExpanded" class="text-lg">{{ text }}</p>
    <p v-else class="text-lg line-clamp-2">{{ text }}</p>

    <button v-if="text.length > 240" @click="toggleExpand" class="text-blue-700 hover:underline">
      {{ isExpanded ? 'Zobrazit méně...' : 'Zobrazit více...' }}
    </button>
</template>