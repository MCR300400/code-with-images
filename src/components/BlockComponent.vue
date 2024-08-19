<template>
    <div>
      <div
        v-for="block in blocks"
        :key="block.id"
        class="placed-block"
        :style="{ paddingLeft: `${block.level * 20}px` }"
        @contextmenu.prevent="emit('removeBlock', block)"
        @click="emit('editBlock', block)"
      >
        {{ block.text }}
        <BlockComponent v-if="block.children.length" :blocks="block.children" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  // Definisci gli eventi che il componente emette
  const emit = defineEmits(['removeBlock', 'editBlock']);
  </script>
  
  <style scoped>
  .placed-block {
    width: 100%;
    padding: 1rem;
    background-color: #bada55;
    border: 1px solid #ccc;
    margin-bottom: 1rem;
    cursor: context-menu;
  }
  </style>
  