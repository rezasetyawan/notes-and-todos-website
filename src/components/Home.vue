<script setup lang="ts">
import TheHeader from "./TheHeader.vue";
import NotesTodosContainer from "./NotesTodosContainer.vue";
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { getUserSession } from "../vuetils/useAuth";

const router = useRouter();
const userSession = ref();
const searchKeyword = ref<string>("");

onBeforeMount(async () => {
  userSession.value = await getUserSession();
  if (!userSession.value) {
    router.push("/auth/signin");
  }
});

</script>
<template>
  <main class="font-open-sans box-border">
    <TheHeader
      :searchKeyword="searchKeyword"
      @updateSearchKeyword="(searchKey) => (searchKeyword = searchKey)"
    />
    <section class="px-2 sm:px-10">
      <Suspense>
        <NotesTodosContainer :searchKeyword="searchKeyword" />
      </Suspense>
    </section>
  </main>
</template>
