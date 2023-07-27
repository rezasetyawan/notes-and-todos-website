<script setup lang="ts">
const { note } = defineProps(["note"]);

const emit = defineEmits(["openNoteDetail"]);

const openNoteDetailModal = () => {
  emit("openNoteDetail", true);
};
</script>
<template>
  <router-link :to="'/note/' + note.id">
    <div
      class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid"
      @click="openNoteDetailModal"
    >
      <h3 class="text-lg font-semibold">{{ note.title }}</h3>
      <p>{{ note.text }}</p>
    </div>
  </router-link>
</template>

<!-- <template>
    <router-link :to="'/note/' + note.id">
      <div class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid">
        <h3 class="text-lg font-semibold">{{ note.title }}</h3>
        <p>{{ note.text }}</p>
      </div>
    </router-link>
  </template>
  
  <script setup lang="ts">
  
  const { note } = defineProps(['note']);
  </script>
   -->
