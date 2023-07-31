<script setup lang="ts">
import TheHeader from "./TheHeader.vue";
import AddItem from "./AddItem.vue";
import AddNoteForm from "./AddNoteForm.vue";
import AddTodoForm from "./AddTodoForm.vue";
import NotesTodosContainer from "./NotesTodosContainer.vue";
// import NoteDetail from "./NoteDetail.vue";
import { ref } from "vue";
// import { useRoute, useRouter } from "vue-router";

// const route = useRoute();
// const router = useRouter()
// const showModal= ref<boolean>(false)

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

// const checkModal = () => {
//   if(route.params.modal) {
//     showModal.value = true
//   } else {
//     showModal.value = true
//   }
// }

// // const showModalFunction = () => {
// //   router.push()
// // }

// watch(route, checkModal);

// watch(showModal, (to, from) => {
//   if (!to && route.params.id) {
//     router.push('/');
//     console.log(from)
//   }
// });

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

      <NotesTodosContainer :searchKeyword="searchKeyword"/>

      
    </section>
  </main>
</template>
