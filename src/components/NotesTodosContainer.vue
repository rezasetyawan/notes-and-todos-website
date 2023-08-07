<script setup lang="ts">
import AddItem from "./AddItem.vue";
import AddNoteForm from "./AddNoteForm.vue";
import AddTodoForm from "./AddTodoForm.vue";
import NoteItem from "./NoteItem.vue";
import NoteDetail from "./NoteDetail.vue";
import TodoContainer from "./TodoContainer.vue";
import TodoDetail from "./TodoDetail.vue";
import ConfirmationModal from "./ConfirmationModal.vue";
import { computed, ref, onMounted, watch, onBeforeMount } from "vue";
import { GetNote, GetTodo } from "../../global/types";
import { deleteNoteById, getNotes } from "../vuetils/useNote";
import { deleteTodoById, getTodos } from "../vuetils/useTodo";
import { useRoute, useRouter } from "vue-router";
import { getUserSession } from "../vuetils/useAuth";
import { showSuccessToast, showErrorToast } from "../vuetils/toast";

const route = useRoute();
const router = useRouter();
const showModal = ref<boolean>(false);
const showNoteForm = ref<boolean>(false);
const showTodoForm = ref<boolean>(false);

const deleteDataFunction = ref<Function>(() => {});

const props = defineProps(["searchKeyword"]);
const showConfirmationModal = ref<boolean>(false);
let modalMessage: string;

interface NoteData {
  title?: string;
  text: string;
}
const noteData = ref<NoteData>({
  title: "",
  text: "",
});

const notes = ref<GetNote[]>([]);
const todos = ref<GetTodo[]>([]);
const loading = ref<boolean>(true);
const userSession = ref();

userSession.value = await getUserSession();

onBeforeMount(async () => {
  userSession.value = await getUserSession();
  if (!userSession.value) {
    router.push("/auth/signin");
  }
});

onMounted(async () => {
  try {
    if (!notes.value.length || !todos.value.length) {
      const fetchedNotes = await getNotes(userSession.value.user.id);
      notes.value = fetchedNotes || [];
      const fetchedTodos = await getTodos(userSession.value.user.id);
      todos.value = fetchedTodos || [];
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

const filteredTodos = computed(() => {
  let { searchKeyword } = props;
  return todos.value.filter(
    (todo) => todo.title?.toLowerCase().includes(searchKeyword.toLowerCase())
  );
});
const checkModal = () => {
  showModal.value = !!route.params.id; // Set showModal based on the presence of route.params.id
};

watch(
  route,
  () => {
    checkModal();
  },
  { immediate: true }
);

watch(
  showModal,
  (to) => {
    if (!to && route.params.id) {
      router.push("/");
    }
  },
  { immediate: true }
);

const updateShowNoteForm = (showForm: boolean) => {
  showNoteForm.value = showForm;
};

const updateShowTodoForm = (showForm: boolean) => {
  showTodoForm.value = showForm;
};

const onDeleteNoteHandler = (noteId: string, noteTitle: string) => {
  deleteDataFunction.value = async () => {
    await deleteNoteById(noteId)
      .then(() => {
        router.replace({ path: "/" });
        showSuccessToast("Note deleted");
      })
      .catch((error) => showErrorToast(error.message));

    notes.value = await getNotes(userSession.value.user.id);
  };
  modalMessage = `Are you sure want to delete "${noteTitle}" ?`;
  showConfirmationModal.value = true;
};

const onDeleteTodoHandler = (todoId: string, todoTitle: string) => {
  deleteDataFunction.value = async () => {
    await deleteTodoById(todoId)
      .then(() => {
        router.replace({ path: "/" });
        showSuccessToast("Todo deleted");
      })
      .catch((error) => showErrorToast(error.message));

    todos.value = await getTodos(userSession.value.user.id);
  };

  modalMessage = `Are you sure want to delete "${todoTitle}" ?`;
  showConfirmationModal.value = true;
};
</script>

<template>
  <section>
    <AddNoteForm
      v-if="showNoteForm"
      :showNoteForm="showNoteForm"
      @updateShowNoteForm="updateShowNoteForm"
      :noteData="noteData"
      @addTodo="
        async () => {
          notes = await getNotes(userSession.user.id);
          console.log('update note');
          console.log(notes);
        }
      "
    />
    <AddTodoForm
      v-else-if="showTodoForm"
      :showTodoForm="showTodoForm"
      @updateShowTodoForm="updateShowTodoForm"
      @addTodo="
        async () => {
          todos = await getTodos(userSession.user.id);
        }
      "
    />

    <AddItem
      v-else
      :showNoteForm="showNoteForm"
      @updateShowNoteForm="updateShowNoteForm"
      :noteData="noteData"
      :showTodoForm="showTodoForm"
      @updateShowTodoForm="updateShowTodoForm"
    />
  </section>

  <section class="relative">
    <h3 v-if="loading" class="text-center my-5">Loading...</h3>

    <article
      v-else-if="filteredNotes.length || filteredTodos.length"
      class="gap-1 columns-2 space-y-1 sm:gap-2 sm:space-y-2 md:columns-3 lg:columns-4"
    >
      <div v-for="(note, index) in filteredNotes" :key="index">
        <NoteItem
          :note="note"
          @openModal="showModal = true"
          @deleteNote="
            (noteId, noteTitle) => onDeleteNoteHandler(noteId, noteTitle)
          "
        />
      </div>

      <div v-for="todo in filteredTodos" :key="todo.id">
        <TodoContainer
          :todo="todo"
          @openModal="showModal = true"
          @deleteTodo="
            (todoId, todoTitle) => {
              onDeleteTodoHandler(todoId, todoTitle);
            }
          "
        />
      </div>
    </article>

    <NoteDetail
      :showModal="showModal"
      @closeNoteDetail="showModal = false"
      @showSuccessToast="(message) => showSuccessToast(message)"
      @showErrorToast="(message) => showErrorToast(message)"
      @noteUpdate="
        async () => {
          notes = await getNotes(userSession.user.id);
          console.log('update note');
          console.log(notes);
        }
      "
    />

    <TodoDetail
      :showModal="showModal"
      @closeTodoDetail="showModal = false"
      @showSuccessToast="(message) => showSuccessToast(message)"
      @showErrorToast="(message) => showErrorToast(message)"
      @todoUpdate="
        async () => {
          todos = await getTodos(userSession.user.id);
        }
      "
    />

    <h3
      v-if="
        !filteredNotes.length &&
        !filteredTodos.length &&
        notes.length &&
        todos.length
      "
      class="text-lg text-center my-5"
    >
      Not Found
    </h3>

    <h3 v-if="!notes.length && !todos.length" class="text-lg text-center my-5">
      You dont have any notes
    </h3>
  </section>
  <ConfirmationModal
    :showConfirmationModal="showConfirmationModal"
    :actionFunction="deleteDataFunction"
    @closeModal="showConfirmationModal = false"
    >{{ modalMessage }}</ConfirmationModal
  >
</template>
