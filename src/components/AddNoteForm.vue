<script setup lang="ts">
import { onMounted, ref } from "vue";
import { nanoid } from "nanoid";
import { addNote } from "../vuetils/useNote.ts";
import { AddNote } from "../../global/types";
import { getUserSession } from "../vuetils/useAuth";
import { showSuccessToast, showErrorToast } from "../vuetils/toast";

const { showNoteForm, noteData } = defineProps(["showNoteForm", "noteData"]);
const emit = defineEmits(["updateShowNoteForm", "firstInput"]);

const textAreaRef = ref<HTMLTextAreaElement | null>(null);

const toggleNoteForm = () => {
  emit("updateShowNoteForm", !showNoteForm);
};

const userSession = ref();
const fetchUserSession = async () => {
  userSession.value = await getUserSession();
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
    author: userSession.value?.user.id,
  };

  if (noteData.text) {
    await addNote(note)
      .then(() => {
        resetForm();
        showSuccessToast("Note added !");
      })
      .catch((error) => {
        showErrorToast(`Failed to add note ${error.message}`);
      });
  }
  toggleNoteForm();
};

const resizeTextArea = () => {
  const textarea = textAreaRef.value;
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

onMounted(async () => {
  if (showNoteForm) {
    textAreaRef.value?.focus();
  }
  await fetchUserSession();
});
</script>

<template>
  <section class="flex justify-center items-center my-5">
    <form
      class="bg-white p-5 min-w-[576px] max-w-[576px] h-full rounded-lg shadow-lg font-open-sans"
      @submit.prevent="onSubmitHandler"
    >
      <input
        v-model="noteData.title"
        class="block w-full text-lg focus:outline-none p-1 my-2 text-slate-600 placeholder:text-slate-600"
        placeholder="Title"
      />
      <textarea
        v-model="noteData.text"
        class="block w-full focus:outline-none p-1 my-2 text-slate-600 placeholder:text-slate-600"
        placeholder="Write your note here"
        spellcheck="false"
        ref="textAreaRef"
        @input="resizeTextArea"
      ></textarea>
      <button type="submit" class="px-2 py-1 font-semibold float-right">
        Close
      </button>
    </form>
  </section>
</template>

<style scoped>
textarea::selection {
  background-color: black;
  color: white;
}
</style>
