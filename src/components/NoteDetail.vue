<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNoteById } from "../vuetils/useNote";
import { formatTimestampWithTimeZone } from "../helper/formateDate";
import { updateNoteById, deleteNoteById } from "../vuetils/useNote";
import { GetNote } from "../../global/types";
// import NotesAndTodosManager from "./NotesAndTodosManager.vue";

const route = useRoute();
const router = useRouter();

const noteId = ref<string>(route.params.id as string);
const note = ref<GetNote | null>();
const currentNoteData = ref<{ title: string; text: string }>({
  title: "",
  text: "",
});
const isNoteDataChanged = ref<boolean>(false);

onMounted(async () => {
  note.value = await getNoteById(noteId.value);
  console.log("note:", note.value);
  if (note.value) {
    currentNoteData.value.title = note.value.title || "";
    currentNoteData.value.text = note.value.text || "";
  }
});

watch(currentNoteData.value, () => {
  if (note.value) {
    isNoteDataChanged.value =
      currentNoteData.value.text !== note.value.text ||
      currentNoteData.value.title !== note.value.title;
  }
});

const closeButtonHandler = async (noteId: string) => {
  const updatedAt = Date.now().toString();
  const note = {
    ...currentNoteData.value,
    updated_at: updatedAt,
  };

  console.log(note.text);
  console.log(currentNoteData.value.text);

  if (isNoteDataChanged.value) {
    await updateNoteById(note, noteId)
      .then(() => {
        alert("note updated");
      })
      .catch((error) => {
        console.error(error);
      });
  }
  router.go(-1);
};

const deleteNoteHandler = async (noteId: string) => {
  const deleteConfimation = confirm("are your sure want to delete this note");
  if (deleteConfimation) {
    await deleteNoteById(noteId)
      .then(() => {
        console.log("success");
        router.go(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>
<template>
  <section
    v-if="note"
    class="relative w-full h-screen mx-auto flex items-center justify-center"
  >
    <div class="relative p-3 border-2 border-slate-600 rounded-lg w-[448px]">
      <div class="absolute top-1 right-1">
        <button
          class="px-2 py-1 bg-slate-200 rounded-md"
          @click="
            () => {
              deleteNoteHandler(noteId);
            }
          "
        >
          delete
        </button>
      </div>
      <input
        class="text-lg font-semibold block focus:outline-none"
        v-model="currentNoteData.title"
      />
      <textarea
        class="my-5 block focus:outline-none w-full"
        v-model="currentNoteData.text"
        >{{ currentNoteData.text }}</textarea
      >
      <p class="float-right text-sm font-medium">
        updated at:
        {{ formatTimestampWithTimeZone(note.updated_at, "Asia/Jakarta") }}
      </p>
      <button
        class="px-2 py-1 bg-slate-100 rounded-lg"
        @click="
          () => {
            closeButtonHandler(noteId);
          }
        "
      >
        close
      </button>
    </div>
    <div v-if="!note">Loading...</div>
  </section>
</template>
