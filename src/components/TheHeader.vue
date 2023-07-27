<script setup lang="ts">
import { ref } from "vue";

const { searchKeyword } = defineProps(["searchKeyword"]);
const emit = defineEmits(["updateSearchKeyword"]);

const localSearchKey = ref<string>(searchKeyword);

const onInputKeywordHandler = () => {
  emit("updateSearchKeyword", localSearchKey.value);
};
</script>
<template>
  <header class="grid grid-cols-3 justify-items-center p-5">
    <h1 class="text-lg justify-self-start">Keep</h1>
    <input
      v-model="localSearchKey"
      class="focus:outline-none p-2 w-full bg-accent-color1"
      placeholder="Search your notes"
      @input="onInputKeywordHandler"
    />
  </header>
</template>
