<script setup>
import { watch } from 'vue';
import { defineProps, defineEmits } from 'vue';

// Definuj props a emit
const props = defineProps({
  showModal: Boolean,
  text: String
});

const emit = defineEmits(['update:showModal', 'confirm', 'cancel']);

watch(() => props.showModal, (newVal) => {
  if (!newVal) {
    // closes modal
    emit('update:showModal', false);
  }
});

const closeModal = () => {
    emit('update:showModal', false);
    emit('cancel');
};

const confirmAction = () => {
    emit('confirm');
    // closes dialog
    emit('update:showModal', false);
};
</script>

<template>
    <!-- Modál je zobrazen jen tehdy, když je showModal true -->
    <div v-if="showModal" class="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-lg font-normal text-gray-500 mb-4">{{ text }}</h3>
            <div class="flex justify-between">
              <button @click="closeModal" class="bg-gray-300 text-black px-4 py-2 rounded-md">Ne</button>
              <button @click="confirmAction" class="ml-2 bg-red-600 text-white px-4 py-2 rounded-md">Ano</button>
            </div>
        </div>
    </div>
</template>
