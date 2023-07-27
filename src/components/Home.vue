<script setup lang="ts">
import TheHeader from "./TheHeader.vue";
import AddItem from "./AddItem.vue";
import AddNoteForm from "./AddNoteForm.vue";
import NotesTodosContainer from "./NotesTodosContainer.vue";
import { ref } from "vue";

const showNoteForm = ref<boolean>(false);
const searchKeyword = ref<string>("");

interface NoteData {
  title?: string;
  text: string;
}
const noteData = ref<NoteData>({
  title: "",
  text: "",
});

const updateShowNoteForm = (showForm: boolean) => {
  showNoteForm.value = showForm;
};
</script>
<template>
  <main class="font-open-sans px-10 box-border">
    <TheHeader
      :searchKeyword="searchKeyword"
      @updateSearchKeyword="(searchKey) => (searchKeyword = searchKey)"
    />
    <AddNoteForm
      v-if="showNoteForm"
      :showNoteForm="showNoteForm"
      @updateShowNoteForm="updateShowNoteForm"
      :noteData="noteData"
    />
    <AddItem
      v-else
      :showNoteForm="showNoteForm"
      @updateShowNoteForm="updateShowNoteForm"
      :noteData="noteData"
    />

    <NotesTodosContainer :searchKeyword="searchKeyword" />
  </main>
</template>
