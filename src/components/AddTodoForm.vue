<script setup lang="ts">
import { ref, nextTick, onMounted, computed, onBeforeMount } from "vue";
import { nanoid } from "nanoid";
import { addTodo } from "../vuetils/useTodo";
import { addTodoItem } from "../vuetils/useTodoItem";
import { getUserSession } from "../vuetils/useAuth";
import { showSuccessToast, showErrorToast } from "../vuetils/toast";

const { showTodoForm } = defineProps(["showTodoForm"]);

const emit = defineEmits(["updateShowTodoForm","addTodo"]);

const toggleTodoForm = () => {
  emit("updateShowTodoForm", !showTodoForm);
};

const userSession = ref();
const fetchUserSession = async () => {
  userSession.value = await getUserSession();
};

const todoId: string = `todo-${nanoid(16)}`;

const todoData = ref({
  id: todoId,
  title: "",
  created_at: Date.now().toString(),
  updated_at: Date.now().toString(),
  todo_items: [
    {
      id: `todo_item-${nanoid(16)}`,
      text: "",
      is_complete: false,
      todo_id: todoId,
    },
  ],
});

let currentIndex = ref<number>(0);
const inputRefs = ref<HTMLInputElement[]>([]);

const addTodoItemInputElement = () => {
  currentIndex.value += 1;
  todoData.value.todo_items.push({
    id: `todo_item-${nanoid(16)}`,
    text: "",
    is_complete: false,
    todo_id: todoId,
  });
};

const handleInput = (index: number) => {
  if (index === currentIndex.value) {
    addTodoItemInputElement();
  }
};

const handleEnter = (index: number) => {
  if (index === currentIndex.value - 1) {
    inputRefs.value[currentIndex.value]?.focus();
  }
};

const handleDelete = (index: number) => {
  if (
    todoData.value.todo_items[index].text === "" &&
    todoData.value.todo_items.length > 1
  ) {
    nextTick(() => {
      const prevInput = inputRefs.value[index - 1];
      prevInput && prevInput.focus();
    });

    todoData.value.todo_items.splice(index, 1);
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  }
};

const filteredTodoItems = computed(() => {
  return todoData.value.todo_items.filter((todo) => {
    return todo.text !== "";
  });
});

const onSubmitHandler = async () => {
  if (todoData.value.title || filteredTodoItems.value.length > 0) {
    try {
      await addTodo({
        id: todoData.value.id,
        title: todoData.value.title,
        created_at: todoData.value.created_at,
        updated_at: todoData.value.updated_at,
        author: userSession.value.user.id,
      });

      await addTodoItem(filteredTodoItems.value);
      showSuccessToast("Todo added!");
      emit("addTodo")
    } catch (error: any) {
      showErrorToast(`Failed to add todo ${error.message}`);
    }
  }
  toggleTodoForm();
};

onBeforeMount(async () => {
  await fetchUserSession();
});

onMounted(async () => {
  if (showTodoForm) {
    inputRefs.value[0]?.focus();
  }
});
</script>

<template>
  <section class="flex justify-center items-center my-5">
    <article
      class="bg-white h-full rounded-lg shadow-lg font-open-sans pb-2 min-w-[90%] sm:min-w-[70%] lg:min-w-[50%]"
    >
      <input
        class="block w-full text-lg p-2 focus:outline-none my-2 text-slate-600 placeholder:text-slate-600"
        placeholder="Title"
        v-model="todoData.title"
      />
      <div
        v-for="(todoItem, index) in todoData.todo_items"
        :key="index"
        class="flex items-center gap-2 focus-within:border-y-[1px] focus-within:border-slate-500"
      >
        <input
          type="checkbox"
          v-model="todoItem.is_complete"
          class="block sm:w-4 sm:h-4 p-1 ml-3 accent-accent-color2"
        />
        <input
          type="text"
          v-model="todoItem.text"
          @input="handleInput(index)"
          @keydown.enter="handleEnter(index)"
          @keyup.delete="handleDelete(index)"
          ref="inputRefs"
          class="block focus:outline-none w-full p-1 mr-3 max-sm:text-sm"
        />
      </div>
      <button
        @click="onSubmitHandler"
        class="px-2 py-1 font-semibold float-right m-2"
      >
        Save
      </button>
    </article>
  </section>
</template>

<style>
.todo-item:focus-within {
  border: 2px solid blue; /* You can customize the border style */
}
</style>
