<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNoteById } from "../vuetils/useNote";
import { formatTimestampWithTimeZone } from "../helper/formateDate";
import { updateNoteById } from "../vuetils/useNote";
import type { GetNote } from "../../global/types";

const { showModal } = defineProps(["showModal"]);
const emit = defineEmits([
  "closeNoteDetail",
  "noteNotFound",
  "showSuccessToast",
  "showErrorToast",
  "noteUpdate",
]);

const router = useRouter();
const route = useRoute();

const noteId = ref<string>(route.params.id as string);

const closeNoteDetail = () => {
  emit("closeNoteDetail");
  router.replace({ path: "/" });
};

const textAreaRef = ref<HTMLTextAreaElement | null>(null);
const note = ref<GetNote | null>();
const currentNoteData = ref<{ title: string; text: string }>({
  title: "",
  text: "",
});
const isNoteDataChanged = ref<boolean>(false);

const fetchNoteData = async () => {
  await getNoteById(noteId.value).then((data) => {
    note.value = data;
  });
  if (note.value) {
    currentNoteData.value.title = note.value.title || "";
    currentNoteData.value.text = note.value.text || "";
  }

  const isDesktop = window.innerWidth >= 1025;

  if (isDesktop) {
    nextTick(() => {
      textAreaRef.value?.focus();
    });
  }
  nextTick(() => resizeTextArea());
};

onMounted(() => {
  fetchNoteData();
  watch(
    () => route.params.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        noteId.value = newId as string;
        fetchNoteData();
      }
    },
    { immediate: true }
  );
});

watch(
  currentNoteData.value,
  () => {
    if (note.value) {
      isNoteDataChanged.value =
        currentNoteData.value.text !== note.value.text ||
        currentNoteData.value.title !== note.value.title;
    }
  },
  { immediate: true }
);

const closeButtonHandler = async (noteId: string) => {
  const updatedAt = Date.now().toString();
  const note = {
    ...currentNoteData.value,
    updated_at: updatedAt,
  };

  if (isNoteDataChanged.value) {
    await updateNoteById(note, noteId)
      .then(() => {
        emit("showSuccessToast", "Note updated");
        emit("noteUpdate");
        setTimeout(closeNoteDetail, 1000);
      })
      .catch((error) => {
        emit("showErrorToast", `Failed to add note ${error.message} `);
        setTimeout(closeNoteDetail, 2000);
      });
  } else {
    closeNoteDetail();
  }
};

const resizeTextArea = () => {
  const textarea = textAreaRef.value;
  if (textarea) {
    textarea.style.height = "auto"; // Reset the height to auto to calculate the new height.
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scrollHeight.
  }
};
</script>
<template>
  <section v-if="note">
    <div
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-[100] w-full overflow-hidden h-screen bg-black/80 flex items-center justify-center"
    >
      <div
        class="relative w-full max-h-full mx-auto max-w-[90%] sm:max-w-[60%]"
        :class="{ open: showModal, close: !showModal }"
      >
        <div
          class="relative p-2 rounded-lg max-h-[70vh] overflow-y-scroll bg-white sm:p-3"
        >
          <input
            class="font-semibold block focus:outline-none w-full text-xl sm:text-2xl"
            placeholder="Title"
            v-model="currentNoteData.title"
          />
          <textarea
            class="my-2 block focus:outline-none w-full h-full p-1 resize-none sm:my-5 max-sm:text-sm"
            spellcheck="false"
            v-model="currentNoteData.text"
            ref="textAreaRef"
            @input="resizeTextArea"
          ></textarea>

          <div class="flex items-center justify-between">
            <button
              class="px-2 py-1 bg-slate-100 rounded-lg"
              @click="
                () => {
                  closeButtonHandler(noteId);
                }
              "
            >
              {{ isNoteDataChanged ? "Update" : "Close" }}
            </button>
            <p class="float-right font-medium text-xs sm:text-sm">
              Updated at:
              {{ formatTimestampWithTimeZone(note.updated_at, "Asia/Jakarta") }}
            </p>
          </div>
        </div>
        <div v-if="!note">Loading...</div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.open {
  animation: fadeup 250ms;
}
.close {
  animation: fadedown 250ms;
}

textarea::selection {
  background-color: black;
  color: white;
}

@keyframes fadeup {
  from {
    opacity: 0;
    top: -5%;
  }
  to {
    opacity: 1;
    top: 0%;
  }
}

@keyframes fadedown {
  from {
    opacity: 1;
    top: 0%;
  }
  to {
    opacity: 0;
    top: -5%;
  }
}
</style>
