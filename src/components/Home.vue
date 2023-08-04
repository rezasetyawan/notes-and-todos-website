<script setup lang="ts">
import TheHeader from "./TheHeader.vue";
// import AddItem from "./AddItem.vue";
// import AddNoteForm from "./AddNoteForm.vue";
// import AddTodoForm from "./AddTodoForm.vue";
import NotesTodosContainer from "./NotesTodosContainer.vue";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getUserSession } from "../vuetils/useAuth";
// import ConfirmationModal from "./ConfirmationModal.vue";

const router = useRouter();
const userSession = ref();


// const showNoteForm = ref<boolean>(false);
// const showTodoForm = ref<boolean>(false);
const searchKeyword = ref<string>("");

// const showConfirmationModal = ref<boolean>(true)



onBeforeMount(async () => {
  userSession.value = await getUserSession();
  console.log(userSession.value)
  if (!userSession.value) {
    router.push("/auth/signin");
  }
});
// const updateShowNoteForm = (showForm: boolean) => {
//   showNoteForm.value = showForm;
// };

// const updateShowTodoForm = (showForm: boolean) => {
//   showTodoForm.value = showForm;
// };
</script>
<template>
  <main class="font-open-sans box-border">
    <TheHeader
      :searchKeyword="searchKeyword"
      @updateSearchKeyword="(searchKey) => (searchKeyword = searchKey)"
    />
    <section class="px-10">
      <Suspense>
        <NotesTodosContainer :searchKeyword="searchKeyword" />
      </Suspense>
    </section>
    tas tas
    <!-- <ConfirmationModal :showConfirmationModal="showConfirmationModal"></ConfirmationModal> -->
  </main>
</template>
