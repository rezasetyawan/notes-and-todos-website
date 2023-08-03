<script setup lang="ts">
import TheHeader from "./TheHeader.vue";
import AddItem from "./AddItem.vue";
import AddNoteForm from "./AddNoteForm.vue";
import AddTodoForm from "./AddTodoForm.vue";
import NotesTodosContainer from "./NotesTodosContainer.vue";
import { ref } from "vue";

const showNoteForm = ref<boolean>(false);
const showTodoForm = ref<boolean>(false);
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

const updateShowTodoForm = (showForm: boolean) => {
  showTodoForm.value = showForm;
};

</script>
<template>
  <main class="font-open-sans box-border">
    <TheHeader
      :searchKeyword="searchKeyword"
      @updateSearchKeyword="(searchKey) => (searchKeyword = searchKey)"
    />
    <section class="px-10">
      <AddNoteForm
        v-if="showNoteForm"
        :showNoteForm="showNoteForm"
        @updateShowNoteForm="updateShowNoteForm"
        :noteData="noteData"
      />
      <AddTodoForm
         v-else-if="showTodoForm"
        :showTodoForm="showTodoForm"
        @updateShowTodoForm="updateShowTodoForm"
      />

      <AddItem
        v-else
        :showNoteForm="showNoteForm"
        @updateShowNoteForm="updateShowNoteForm"
        :noteData="noteData"
        :showTodoForm="showTodoForm"
        @updateShowTodoForm="updateShowTodoForm"
      />

      <Suspense>
        <NotesTodosContainer :searchKeyword="searchKeyword"/>
      </Suspense>
    </section>
  </main>
</template>
