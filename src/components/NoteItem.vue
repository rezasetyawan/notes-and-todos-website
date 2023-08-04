<script setup lang="ts">
import { useRouter } from "vue-router";

const { note } = defineProps(["note"]);
const emit = defineEmits(["openModal"]);
const router = useRouter();

const openModal = () => {
  emit("openModal");
};

const redirectToDetail = (name: string, id: string) => {
  router.replace({path: `/${name}/${id}`})
};
</script>

<template>
  <div
    class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid"
    @click="
      () => {
        redirectToDetail('note', note.id);
        openModal();
      }
    "
  >
    <h3 class="text-lg font-semibold">{{ note.title }}</h3>
    <p class="line-clamp-6">{{ note.text }}</p>
  </div>
</template>
