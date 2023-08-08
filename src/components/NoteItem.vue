<script setup lang="ts">
import { useRouter } from "vue-router";

const { note } = defineProps(["note"]);
const emit = defineEmits(["openModal", "deleteNote"]);
const router = useRouter();

const openModal = () => {
  emit("openModal");
};

const deleteNoteHandler = () => {
  emit("deleteNote", note.id, note.title);
};

const redirectToDetail = (name: string, id: string) => {
  router.replace({ path: `/${name}/${id}` });
};
</script>

<template>
  <div
    class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid relative select-none"
  >
    <button class="absolute top-2 right-2" @click="deleteNoteHandler()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="fill-red-800 h-[1.1em]"
      >
        <path
          d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
        />
      </svg>
    </button>
    <article
      @click="
        () => {
          redirectToDetail('note', note.id);
          openModal();
        }
      "
    >
      <h3 class="font-semibold max-w-[90%] sm:text-lg">
        {{ note.title || "-" }}
      </h3>
      <p class="line-clamp-6 text-sm max-sm:text-sm">{{ note.text }}</p>
    </article>
  </div>
</template>
