<script setup lang="ts">
const { showNoteForm, noteData } = defineProps([
  "showNoteForm",
  "noteData",
  "isFirstTimeInput",
]);
const emit = defineEmits(["updateShowNoteForm", "firstInput"]);

const toggleNoteForm = () => {
  emit("updateShowNoteForm", !showNoteForm);
};

const triggerNoteForm = () => {
  if (!showNoteForm.value) {
    emit("updateShowNoteForm", true);
  }
};
</script>
<template>
  <section class="flex justify-center items-center my-5">
    <div class="p-5 rounded-sm shadow-lg w-[576px]" @click="toggleNoteForm">
      <input
        placeholder="Add note"
        v-model="noteData.text"
        class="focus:outline-none w-96 border-[1px] p-1 mr-5"
        @input="triggerNoteForm"
      />
      <button>add todo</button>
    </div>
  </section>
</template>
