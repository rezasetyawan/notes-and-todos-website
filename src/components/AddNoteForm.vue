<script setup lang="ts">
import { onMounted, ref } from "vue";
import { nanoid } from "nanoid";
import { addNote } from "../vuetils/useNote.ts";
import { AddNote } from "../../global/types";

const { showNoteForm, noteData } = defineProps(["showNoteForm", "noteData"]);
const emit = defineEmits(["updateShowNoteForm", "firstInput"]);

const inputRef = ref<HTMLInputElement | null>(null);

const toggleNoteForm = () => {
  emit("updateShowNoteForm", !showNoteForm);
};

const resetForm = () => {
  noteData.title = "";
  noteData.text = "";
};

const onSubmitHandler = async () => {
  const id: string = `note-${nanoid(16)}`;
  const currentTime: string = Date.now().toString();
  const note: AddNote = {
    id: id,
    ...noteData,
    created_at: currentTime,
    updated_at: currentTime,
  };

  if (noteData.text) {
    await addNote(note)
      .then(() => {
        resetForm();
      })
      .then((error) => {
        console.error(error);
      });
  }
  toggleNoteForm();
};

onMounted(() => {
  if (showNoteForm) {
    inputRef.value?.focus();
  }
});
</script>

<template>
  <section class="flex justify-center items-center my-5">
    <form
      class="bg-white p-5 w-[576px] shadow-lg"
      @submit.prevent="onSubmitHandler"
    >
      <input
        v-model="noteData.title"
        class="block w-full border-[1px] my-2 p-2"
        placeholder="Title"
      />
      <textarea
        v-model="noteData.text"
        class="block w-full resize-y min-h-[50px] border-[1px] my-2 p-2"
        placeholder="Note"
        ref="inputRef"
      ></textarea>
      <button type="submit" class="px-2 py-1 bg-slate-100">Close</button>
    </form>
  </section>
</template>
../vuetils/useNote
