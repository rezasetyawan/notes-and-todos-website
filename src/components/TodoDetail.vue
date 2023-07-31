<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { GetTodo } from "../../global/types";
import { onMounted, ref, watch } from "vue";
import { getTodoById } from "../vuetils/useTodo";

const route = useRoute();
const router = useRouter();

const { showModal } = defineProps(["showModal"]);

const emit = defineEmits(["closeTodoDetail"]);

const closeTodoDetail = () => {
  emit("closeTodoDetail");
  router.push('/')
};

const todoId = ref<string>(route.params.id as string);
const todo = ref<GetTodo | null>(null);

const fetchTodoData = async () => {
  todo.value = await getTodoById(todoId.value);
};

onMounted(async () => {
  fetchTodoData();
  watch(
    () => route.params.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        todoId.value = newId as string;
        fetchTodoData();
      }
    }
  );
});
</script>

<!-- <template>
  <div class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid">
    <h3 class="text-lg font-semibold">{{ todo?.title }}</h3>
    <div v-for="(todoItem, index) in todo?.todo_items" :key="index">
      <div v-if="todoItem.isActive" class="my-2">
        <input type="checkbox" :checked="!todoItem.isActive" class="mr-2" />
        <span class="w-full" :class="{ 'line-through': !todoItem.isActive }">{{
          todoItem.text
        }}</span>
      </div>
    </div>
    <div v-for="(todoItem, index) in todo?.todo_items" :key="index">
      <div v-if="!todoItem.isActive" class="my-2">
        <input type="checkbox" :checked="!todoItem.isActive" class="mr-2" />
        <span
          class="w-full text-gray-500"
          :class="{ 'line-through': !todoItem.isActive }"
          >{{ todoItem.text }}</span
        >
      </div>
    </div>
  </div>
</template> -->

<template>
  <section v-if="todo && showModal">
    <div
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-[100] w-full overflow-hidden h-screen p-5 bg-black/80"
    >
      <div
        class="relative w-full max-w-sm max-h-full mx-auto top-[30%] md:top-[25%]"
        :class="{'open':showModal, 'close':!showModal}"
      >
        <div class="p-3 rounded-lg break-inside-avoid bg-white">
          <h3 class="text-lg font-semibold">{{ todo?.title }}</h3>
          <div v-for="(todoItem, index) in todo?.todo_items" :key="index">
            <div v-if="todoItem.isActive" class="my-2">
              <input
                type="checkbox"
                :checked="!todoItem.isActive"
                class="mr-2"
              />
              <span
                class="w-full"
                :class="{ 'line-through': !todoItem.isActive }"
                >{{ todoItem.text }}</span
              >
            </div>
          </div>
          <div v-for="(todoItem, index) in todo?.todo_items" :key="index">
            <div v-if="!todoItem.isActive" class="my-2">
              <input
                type="checkbox"
                :checked="!todoItem.isActive"
                class="mr-2"
              />
              <span
                class="w-full text-gray-500"
                :class="{ 'line-through': !todoItem.isActive }"
                >{{ todoItem.text }}</span
              >
            </div>
          </div>
          <button
            class="px-2 py-1 bg-slate-100 rounded-lg"
            @click="closeTodoDetail"
          >
            Close
          </button>
        </div>
        <div v-if="!todo">Loading...</div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.open {
  animation: fadeup 250ms;
}

.close {
    animation: fadedown 250ms
}

@keyframes fadedown {
  from {
    opacity: 1;
    top: 30%;
  }
  to {
    opacity: 0;
    top: 35%;
  }
}

@keyframes fadeup {
  from {
    opacity: 0;
    top: 35%;
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
      top: 30%;
    }
    to {
      opacity: 1;
      top: 25%;
    }
  }

  @keyframes fadedown {
  from {
    opacity: 1;
    top: 25%;
  }
  to {
    opacity: 0;
    top: 30%;
  }
}
}
</style>
