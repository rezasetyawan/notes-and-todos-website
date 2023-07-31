<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getNoteById } from "../vuetils/useNote";
import { formatTimestampWithTimeZone } from "../helper/formateDate";
import { updateNoteById, deleteNoteById } from "../vuetils/useNote";
import type { GetNote } from "../../global/types";

const { showModal } = defineProps(["showModal"]);

const emit = defineEmits(["closeNoteDetail"]);

const router = useRouter();

const closeNoteDetail = () => {
  emit("closeNoteDetail");
  router.push("/");
};

const route = useRoute();
const textAreaRef = ref<HTMLTextAreaElement | null>(null);

const noteId = ref<string>(route.params.id as string);

const note = ref<GetNote | null>();
const currentNoteData = ref<{ title: string; text: string }>({
  title: "",
  text: "",
});
const isNoteDataChanged = ref<boolean>(false);

const fetchNoteData = async () => {
  note.value = await getNoteById(noteId.value);
  if (note.value) {
    currentNoteData.value.title = note.value.title || "";
    currentNoteData.value.text = note.value.text || "";
  }
  nextTick(() => {
    textAreaRef.value?.focus();
    resizeTextArea();
  });
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
    }
  );
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

  closeNoteDetail();
};

const deleteNoteHandler = async (noteId: string) => {
  const deleteConfimation = confirm("are your sure want to delete this note");
  if (deleteConfimation) {
    await deleteNoteById(noteId)
      .then(() => {
        console.log("success");
        closeNoteDetail();
      })
      .catch((error) => {
        console.log(error);
      });
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
  <!-- <section
    v-if="note && showModal"
    class="fixed top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 bg-white"
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
        class="my-5 block focus:outline-none w-full h-full"
        v-model="currentNoteData.text"
        ref="textAreaRef"
        @input="resizeTextArea"
      ></textarea>
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
  </section> -->

  <section v-if="note">
    <div
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-[100] w-full overflow-hidden h-screen p-5 bg-black/80"
    >
      <div
        class="relative w-full max-w-sm max-h-full mx-auto top-[30%] md:top-[25%]"
        :class="{ open: showModal }"
      >
        <div class="relative p-3 rounded-lg w-[448px] bg-white">
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
            class="my-5 block focus:outline-none w-full h-full"
            v-model="currentNoteData.text"
            ref="textAreaRef"
            @input="resizeTextArea"
          ></textarea>
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
      </div>
    </div>
  </section>
</template>
<style scoped>
.open {
  animation: fadeup 250ms;
}

@keyframes fadeup {
  from {
    opacity: 0;
    top: 25%;
  }
  to {
    opacity: 1;
    top: 30%;
  }
}

@media screen and (min-width: 768px) {
  @keyframes fadeup {
    from {
      opacity: 0;
      top: 20%;
    }
    to {
      opacity: 1;
      top: 25%;
    }
  }
}
</style>
