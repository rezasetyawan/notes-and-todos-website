<script setup lang="ts">
import { useRouter } from 'vue-router';
import { signOutUser } from '../vuetils/useAuth';
import ConfirmationModal from './ConfirmationModal.vue'
import { ref } from "vue";

const { searchKeyword } = defineProps(["searchKeyword"]);
const emit = defineEmits(["updateSearchKeyword"]);

const router = useRouter()

const localSearchKey = ref<string>(searchKeyword);

const onInputKeywordHandler = () => {
  emit("updateSearchKeyword", localSearchKey.value);
};

const showConfimationModal = ref<boolean>(false)

const signOutUserHandler = async () => {
  await signOutUser().then(()=>{
    router.push('/auth/signin')
  })
}

</script>
<template>
  <ConfirmationModal :showConfirmationModal="showConfimationModal" :actionFunction="signOutUserHandler" @closeModal="showConfimationModal = false">Are you sure want to sign out?</ConfirmationModal>
  <header class="bg-white shadow-lg sticky top-0" :class="{'z-[100]':!showConfimationModal}" >
    <section
      class="flex justify-between items-center gap-3 p-4 px-2 sm:px-4 sm:grid sm:grid-cols-3 sm:place-items-center sm:justify-items-center "
    >
      <h1 class="font-semibold justify-self-start text-slate-600 font-poppins text-xl sm:text-3xl">
        Scribblr
      </h1>

      <input
        v-model="localSearchKey"
        class="focus:outline-none w-full bg-accent-color1 rounded-lg text-sm p-1.5 sm:p-3 sm:text-base"
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
