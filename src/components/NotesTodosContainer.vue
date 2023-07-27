<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getNotes } from "../vuetils/useNote";
import { GetNote } from "../../global/types";
import NoteItem from "./NoteItem.vue";
import NoteDetail from "./NoteDetail.vue";

const props = defineProps(["searchKeyword"]);

const notes = ref<GetNote[]>([]);
const loading = ref<boolean>(true);
const isNoteDetailShown = ref<boolean>(false);

onMounted(async () => {
  try {
    if (!notes.value.length) {
      const fetchedNotes = await getNotes();
      notes.value = fetchedNotes || [];
      console.log(notes.value);
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const filteredNotes = computed(() => {
  let { searchKeyword } = props;
  return notes.value.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      note.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );
});

// const openNoteDetailHandler = () => {
//   selectedNote.value = note;
// }
</script>

<template>
  <section>
    <article v-if="loading" class="text-center my-5">Loading...</article>
    <article
      v-else-if="filteredNotes.length > 0"
      class="gap-2 columns-1 space-y-2 md:columns-3 lg:columns-4"
    >
      <div v-for="(note, index) in filteredNotes" :key="index">
        <NoteItem
          :note="note"
          @openNoteDetailModal="
            (showNoteDetail: boolean) => (isNoteDetailShown = showNoteDetail)
          "
        />
      </div>
    </article>
    <NoteDetail v-if="isNoteDetailShown" />
    <h3
      v-if="!filteredNotes.length && notes.length > 0"
      class="text-lg text-center my-5"
    >
      Not Found
    </h3>
    <h3 v-if="!notes.length" class="text-lg text-center my-5">
      You dont have any notes
    </h3>
  </section>
</template>
