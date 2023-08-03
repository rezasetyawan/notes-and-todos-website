<script setup lang="ts">
import { signOutUser } from '../vuetils/useAuth';
import ConfirmationModal from './ConfirmationModal.vue'
import { ref } from "vue";

const { searchKeyword } = defineProps(["searchKeyword"]);
const emit = defineEmits(["updateSearchKeyword"]);

const localSearchKey = ref<string>(searchKeyword);

const onInputKeywordHandler = () => {
  emit("updateSearchKeyword", localSearchKey.value);
};

const showConfimationModal = ref<boolean>(false)

</script>
<template>
  <ConfirmationModal :showConfirmationModal="showConfimationModal" :actionFunction="signOutUser" @closeModal="showConfimationModal = false">Are you sure want to sign out?</ConfirmationModal>
  <header class="bg-white shadow-lg sticky top-0" :class="{'z-[100]':!showConfimationModal}" >
    <section
      class="grid grid-cols-3 place-items-center justify-items-center p-4"
    >
      <h1 class="text-2xl font-semibold justify-self-start text-slate-600">
        Keep
      </h1>

      <input
        v-model="localSearchKey"
        class="focus:outline-none p-3 py-3 w-full bg-accent-color1 rounded-lg"
        placeholder="Search your notes"
        @input="onInputKeywordHandler"
      />
      <button class="float-right justify-self-end" @click="showConfimationModal = true">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9958 3L3 3L3 21H12"
            stroke="#475569"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16.5 16.5L21 12L16.5 7.5"
            stroke="#475569"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 11.9958L21 11.9958"
            stroke="#475569"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
     
    </section>
    
  </header>
  
</template>
