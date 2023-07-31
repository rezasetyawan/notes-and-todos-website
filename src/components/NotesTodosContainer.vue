<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import { GetNote, GetTodo } from "../../global/types";
// import { getNotes } from "../vuetils/useNote";
// import NoteItem from "./NoteItem.vue";
// import NoteDetail from "./NoteDetail.vue";
import TodoContainer from "./TodoContainer.vue";
import TodoDetail from "./TodoDetail.vue";
import { useRoute, useRouter } from "vue-router";
import { getTodos } from "../vuetils/useTodo";

const route = useRoute();
const router = useRouter();
const showModal = ref<boolean>(false);

const props = defineProps(["searchKeyword"]);

const notes = ref<GetNote[]>([]);
const todos = ref<GetTodo[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    if (!todos.value.length) {
      //    if (!notes.value.length && !todos.value.length
      // const fetchedNotes = await getNotes();
      // notes.value = fetchedNotes || [];
      const fetchedTodos = await getTodos();
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

const checkModal = () => {
  showModal.value = !!route.params.id; // Set showModal based on the presence of route.params.id
};

watch(route, checkModal);

watch(showModal, (to) => {
  if (!to && route.params.id) {
    router.push("/");
  }
});
</script>

// v-else-if="filteredNotes.length"
<template>
  <section class="relative">
    <h3 v-if="loading" class="text-center my-5">Loading...</h3>

    <article
      v-else-if="!filteredNotes.length"
      class="gap-2 columns-1 space-y-2 md:columns-3 lg:columns-4"
    >
      <!-- <div v-for="(note, index) in filteredNotes" :key="index">
        <NoteItem :note="note" @openModal="showModal = true" />
      </div> -->

      <div v-for="todo in todos" :key="todo.id">
        <TodoContainer
          :todo="todo"
          @openModal="showModal = true"
        ></TodoContainer>
      </div>
    </article>

    <!-- <NoteDetail
      :showModal="showModal"
      @closeNoteDetail="showModal = false"
    ></NoteDetail> -->

    <TodoDetail :showModal="showModal" @closeTodoDetail="showModal = false" />

      <!-- <h3
        v-if="!filteredNotes.length && notes.length > 0"
        class="text-lg text-center my-5"
      >
        Not Found
      </h3>

      <h3 v-if="!notes.length" class="text-lg text-center my-5">
        You dont have any notes
      </h3> -->
  </section>
</template>
