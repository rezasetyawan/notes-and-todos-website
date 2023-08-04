<script setup lang="ts">
import ConfirmationModal from "./ConfirmationModal.vue";
import { useRoute, useRouter } from "vue-router";
import { GetTodo, GetTodoItem } from "../../global/types";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import {
  getTodoById,
  updateTodoById,
  deleteTodoById,
} from "../vuetils/useTodo";
import { nanoid } from "nanoid";
import {
  addTodoItem,
  updateTodoItemById,
  deleteTodoItemById,
} from "../vuetils/useTodoItem";

const route = useRoute();
const router = useRouter();

const { showModal } = defineProps(["showModal"]);
const emit = defineEmits([
  "closeTodoDetail",
  "todoNotFound",
  "showSuccessToast",
  "showErrorToast",
]);

const closeTodoDetail = () => {
  emit("closeTodoDetail");
  router.push("/");
};

const todoId = ref<string>(route.params.id as string);
const todo = ref<GetTodo | null>(null);
const currentTodoData = ref<GetTodo>({
  id: "",
  title: "",
  updated_at: "",
  todo_items: [
    {
      id: "",
      text: "",
      is_complete: false,
      todo_id: "",
    },
  ],
});

const fetchTodoData = async () => {
  await getTodoById(todoId.value).then((data) => {
    todo.value = data;
  });

  if (todo.value) {
    currentTodoData.value = JSON.parse(JSON.stringify(todo.value));
  }

  nextTick(() => {
    inputRefs.value[inputRefs.value.length - 1]?.focus();
  });
};

const currentActiveTodoItems = ref<GetTodoItem[]>([]);
const currentIndex = ref<number>(currentActiveTodoItems.value.length - 1);
const inputRefs = ref<HTMLInputElement[]>([]);

const addTodoItemInputElement = () => {
  currentIndex.value += 1;
  const newTodoItem = {
    id: `todo_item-${nanoid(16)}`,
    text: "",
    is_complete: false,
    todo_id: currentTodoData.value.id,
  };
  currentTodoData.value.todo_items.push(newTodoItem);
  currentActiveTodoItems.value = [...currentTodoData.value.todo_items].filter(
    (todo) => !todo.is_complete
  );
};

const handleInput = (todoItem: GetTodoItem) => {
  currentIndex.value = inputRefs.value.length - 1;

  const index = currentActiveTodoItems.value.findIndex(
    (item) => item.id === todoItem.id
  );
  if (index === currentIndex.value) {
    addTodoItemInputElement();
  }
};

const handleEnterButton = (todoItem: GetTodoItem) => {
  const index = currentActiveTodoItems.value.findIndex(
    (item) => item.id === todoItem.id
  );
  currentIndex.value = inputRefs.value.length - 1;
  // currentIndex.value = currentActiveTodoItems.value.length-1

  if (index === currentIndex.value - 1) {
    inputRefs.value[currentIndex.value]?.focus();
  }

  if (index === currentIndex.value) {
    addTodoItemInputElement();
    inputRefs.value[currentIndex.value]?.focus();
  }
};

const handleBackspaceButton = (todoItem: GetTodoItem) => {
  const originalIndex = currentActiveTodoItems.value.findIndex(
    (item) => item.id === todoItem.id
  );

  if (todoItem.text === "" && currentTodoData.value.todo_items.length > 1) {
    nextTick(() => {
      const prevInput =
        inputRefs.value[currentActiveTodoItems.value.length - 1];
      if (prevInput) {
        prevInput.focus();
      } else if (!prevInput) {
        console.log("yntkts");
        inputRefs.value[inputRefs.value.length - 1].focus();
      } else {
        console.log("lah");
      }
    });

    currentTodoData.value.todo_items.splice(
      currentTodoData.value.todo_items.indexOf(todoItem),
      1
    );

    currentActiveTodoItems.value.splice(originalIndex, 1);
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  }
};

watch(
  currentTodoData,
  (newValue) => {
    currentActiveTodoItems.value = newValue.todo_items.filter((todo) => {
      return !todo.is_complete;
    });
    currentIndex.value = currentActiveTodoItems.value.length - 1;
  },
  { immediate: true, deep: true }
);

const filteredTodoItems = computed(() => {
  return currentTodoData.value.todo_items.filter((todo) => {
    return todo.text !== "";
  });
});

const closeButtonHandler = async () => {
  if (currentTodoData.value.title || filteredTodoItems.value.length) {
    try {
      const newTodoItems = currentTodoData.value.todo_items.filter(
        (newItem) =>
          todo.value?.todo_items.findIndex(
            (oldItem) => oldItem.id === newItem.id
          ) === -1 && newItem.text !== ""
      );

      const oldTodoItems = currentTodoData.value.todo_items.filter(
        (newItem) =>
          todo.value?.todo_items.findIndex(
            (oldItem) => oldItem.id === newItem.id
          ) !== -1
      );

      const updatedTodoItems = oldTodoItems.filter(
        (newItem) =>
          todo.value?.todo_items.findIndex(
            (oldItem) =>
              oldItem.text === newItem.text &&
              oldItem.is_complete === newItem.is_complete
          ) === -1
      );

      if (todo.value?.title !== currentTodoData.value?.title) {
        await updateTodoById(currentTodoData.value.id, {
          title: currentTodoData.value.title,
          updated_at: Date.now().toString(),
        });
      }

      if (updatedTodoItems.length) {
        updatedTodoItems.forEach(async (todoItem) => {
          await updateTodoItemById(todoItem.id, {
            text: todoItem.text,
            is_complete: todoItem.is_complete,
          });
        });
      }

      if (newTodoItems.length) {
        await addTodoItem(newTodoItems);
      }

      if (newTodoItems.length || updatedTodoItems.length || newTodoItems.length) {
        emit("showSuccessToast", "Todo updated");
        setTimeout(closeTodoDetail, 1000);
      } else {
        closeTodoDetail()
      }
      
    } catch (error: any) {
      emit(
        "showErrorToast",
        `Failed to update todo ${error.message ? error.message : error}`
      );
    }
  }
};

const deleteTodoHandler = async (todoId: string) => {
  const deleteConfimation = confirm("are your sure want to delete this todo");
  if (deleteConfimation) {
    await deleteTodoById(todoId)
      .then(() => {
        emit("showSuccessToast", "Todo deleted");
        setTimeout(closeTodoDetail, 1000);
      })
      .catch((error) => {
        emit("showErrorToast", `Failed to delete todo ${error.message} `);
        setTimeout(closeTodoDetail, 2000);
      });
  }
};

const deleteTodoItem = async (todoItemId: string) => {
  try {
    const index = currentTodoData.value.todo_items.findIndex(
      (item) => item.id === todoItemId
    );
    currentTodoData.value.todo_items.splice(index, 1);
    await deleteTodoItemById(todoItemId);
  } catch (error) {
    console.error(error);
  }
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
    },
    { immediate: true }
  );
});
</script>

<template>
  <section v-if="todo">
    <div
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-[100] w-full overflow-hidden h-screen bg-black/80 flex items-center justify-center"
    >
      <div
        class="relative p-4 mx-auto"
        :class="{ open: showModal, close: !showModal }"
      >
        <div
          class="p-3 min-w-[500px] max-h-[500px] overflow-scroll relative bg-white rounded-md"
        >
          <div class="absolute top-1 right-1">
            <button
              class="px-2 py-1 bg-slate-200 rounded-md"
              @click="
                () => {
                  deleteTodoHandler(currentTodoData.id);
                }
              "
            >
              delete
            </button>
          </div>
          <input
            class="text-2xl font-semibold block focus:outline-none w-full"
            :placeholder="todo.title ? '' : 'Title'"
            v-model="currentTodoData.title"
          />

          <div
            v-for="(todoItem, index) in currentTodoData.todo_items"
            :key="index"
          >
            <div
              v-if="!todoItem.is_complete"
              class="py-1 my-2 flex items-center gap-2 group rounded-sm border-y-[1px] border-y-transparent box-border focus-within:border-y-[1px] focus-within:border-slate-500"
            >
              <input
                type="checkbox"
                v-model="todoItem.is_complete"
                class="block h-5 w-5"
              />
              <input
                class="block p-1 w-[90%] focus:outline-none"
                :class="{ 'line-through': todoItem.is_complete }"
                type="text"
                v-model="todoItem.text"
                @input="handleInput(todoItem)"
                @keydown.enter="handleEnterButton(todoItem)"
                @keyup.delete="handleBackspaceButton(todoItem)"
                ref="inputRefs"
              />
              <button
                class="hidden font-semibold p-1 group-hover:block float"
                @click="
                  () => {
                    deleteTodoItem(todoItem.id);
                  }
                "
              >
                x
              </button>
            </div>
          </div>

          <hr />

          <!-- UNFINISHED TODO LIST -->
          <div
            v-for="(todoItem, index) in currentTodoData.todo_items"
            :key="index"
          >
            <div
              v-if="todoItem.is_complete"
              class="py-1 my-2 flex items-center gap-2 group rounded-sm border-y-[1px] border-y-transparent box-border focus-within:border-y-[1px] focus-within:border-slate-500"
            >
              <input
                type="checkbox"
                v-model="todoItem.is_complete"
                class="block h-5 w-5"
              />
              <input
                class="block p-1 w-[90%] focus:outline-none"
                :class="{ 'line-through': todoItem.is_complete }"
                v-model="todoItem.text"
              />
              <button
                class="hidden font-semibold p-1 group-hover:block float-right"
                @click="
                  () => {
                    deleteTodoItem(todoItem.id);
                  }
                "
              >
                x
              </button>
            </div>
          </div>
          <button
            class="px-2 py-1 bg-slate-100 rounded-lg"
            @click="closeButtonHandler"
          >
            Close
          </button>
        </div>
        <div v-if="!todo">Loading...</div>
      </div>
    </div>
    <ConfirmationModal></ConfirmationModal>
  </section>
</template>

<style scoped>
.open {
  animation: fadeup 250ms;
}
.close {
  animation: fadedown 250ms;
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
      top: -5%;
    }
    to {
      opacity: 1;
      top: 0%;
    }
  }

  @keyframes fadedown {
    from {
      opacity: 1;
      top: 0%;
    }
    to {
      opacity: 0;
      top: -5%;
    }
  }
}
</style>
