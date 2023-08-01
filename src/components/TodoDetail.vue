<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { GetTodo, GetTodoItem } from "../../global/types";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { getTodoById, updateTodoById , deleteTodoById} from "../vuetils/useTodo";
import { nanoid } from "nanoid";
import { addTodoItem, updateTodoItemById } from "../vuetils/useTodoItem";

const route = useRoute();
const router = useRouter();

const { showModal } = defineProps(["showModal"]);
const emit = defineEmits(["closeTodoDetail"]);

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
      isActive: true,
      todo_id: "",
    },
  ],
});

const fetchTodoData = async () => {
  todo.value = await getTodoById(todoId.value);

  if (todo.value) {
    currentTodoData.value = JSON.parse(JSON.stringify(todo.value));
    currentTodoData.value.todo_items.push({
      id: `todo_item-${nanoid(16)}`,
      text: "",
      isActive: true,
      todo_id: currentTodoData.value.id,
    });
  }

  nextTick(() => {
    inputRefs.value[inputRefs.value.length - 1]?.focus();
  });
};

const currentActiveTodoItems = ref<GetTodoItem[]>([]);
const currentIndex = ref<number>(currentActiveTodoItems.value.length - 1);
const inputRefs = ref<HTMLInputElement[]>([]);

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

// const currentActiveTodoItems = computed(() => {
//   return currentTodoData.value.todo_items.filter((todo) => {
//     return todo.isActive;
//   });
// });

// console.log(currentActiveTodoItems.value.length);

const addTodoItemInputElement = () => {
  currentIndex.value += 1;
  const newTodoItem = {
    id: `todo_item-${nanoid(16)}`,
    text: "",
    isActive: true,
    todo_id: currentTodoData.value.id,
  };
  currentTodoData.value.todo_items.push(newTodoItem);
  currentActiveTodoItems.value = [...currentTodoData.value.todo_items].filter(
    (todo) => todo.isActive
  );
};

const handleInput = (index: number) => {
  if (index === currentIndex.value) {
    addTodoItemInputElement();
  }

  console.log(currentTodoData.value);
};

const handleEnter = (index: number) => {
  if (index === currentIndex.value - 1) {
    inputRefs.value[currentIndex.value]?.focus();
  }

  if (index === currentIndex.value) {
    addTodoItemInputElement();
    inputRefs.value[currentIndex.value]?.focus();
  }
};

const handleDelete = (index: number) => {
  if (
    currentTodoData.value.todo_items[index].text === "" &&
    currentTodoData.value.todo_items.length > 1
  ) {
    nextTick(() => {
      const prevInput = inputRefs.value[index - 1];
      prevInput && prevInput.focus();
    });

    currentTodoData.value.todo_items.splice(index, 1);
    currentActiveTodoItems.value.splice(index, 1);
    currentIndex.value = Math.max(0, currentIndex.value - 1);
  }

  // if (
  //   currentActiveTodoItems.value[index].text === "" &&
  //   currentActiveTodoItems.value.length > 1
  // ) {
  //   nextTick(() => {
  //     const prevInput = inputRefs.value[index - 1];
  //     prevInput && prevInput.focus();
  //   });

  //   currentActiveTodoItems.value.splice(index, 1);
  //   currentIndex.value = Math.max(0, currentIndex.value - 1);
  // }
};

const isChecked = (index: number) => {
  return !currentTodoData.value.todo_items[index].isActive;
};

const handleCheckboxToggle = (index: number) => {
  currentTodoData.value.todo_items[index].isActive =
    !currentTodoData.value.todo_items[index].isActive;
};

watch(currentTodoData, (newValue) => {
  currentActiveTodoItems.value = newValue.todo_items.filter((todo) => {
    return todo.isActive;
  });
  currentIndex.value = currentActiveTodoItems.value.length - 1;
});

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
              oldItem.isActive === newItem.isActive
          ) === -1
      );

      if (
        todo.value?.title !== currentTodoData.value?.title
      ) {
        await updateTodoById(currentTodoData.value.id, {
          title: currentTodoData.value.title,
          updated_at: Date.now().toString(),
        }).then(()=> {
          alert("success BROOOOOOOOOOOO, GACOR KANGGGG todo data");
        }
        )
      }

      if (updatedTodoItems.length) {
        updatedTodoItems.forEach(async (todoItem) => {
          await updateTodoItemById(todoItem.id, {
            text: todoItem.text,
            isActive: todoItem.isActive,
          }).then(()=> {
          alert("success BROOOOOOOOOOOO, GACOR KANGGGG updated");
        }
        )
        });
      }

      if (newTodoItems.length) {
        await addTodoItem(newTodoItems).then(()=> {
          alert("success BROOOOOOOOOOOO, GACOR KANGGGG new");
        }
        )
      }

      console.log("new ");
      console.log(newTodoItems);
      console.log(updatedTodoItems);
      
      closeTodoDetail();
    } catch (error) {
      console.error(error);
    }
  }
};

const deleteTodoHandler = async (todoId: string) => {
  const deleteConfimation = confirm("are your sure want to delete this note");
  if (deleteConfimation) {
    await deleteTodoById(todoId)
      .then(() => {
        console.log("success");
        closeTodoDetail();
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
</script>

<template>
  <section v-if="todo && showModal">
    <div
      tabindex="-1"
      class="fixed top-0 left-0 right-0 z-[100] w-full overflow-hidden h-screen p-5 bg-black/80"
    >
      <div
        class="relative w-full max-w-sm max-h-full mx-auto top-[30%] md:top-[25%]"
        :class="{ open: showModal, close: !showModal }"
      >
        <div class="p-3 rounded-lg break-inside-avoid bg-white">
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
            class="text-lg font-semibold"
            @click="
              () => {
                console.log(todo);
              }
            "
            v-model="currentTodoData.title"
          />

          <div v-for="(todoItem, index) in currentActiveTodoItems" :key="index">
            <div v-if="todoItem.isActive" class="my-2 flex items-center gap-2">
              <input
                type="checkbox"
                :checked="
                  isChecked(
                    currentTodoData.todo_items.findIndex(
                      (item) => item.id === todoItem.id
                    )
                  )
                "
                @change="handleCheckboxToggle(index)"
                class="mr-2 block"
              />
              <input
                class="w-full block"
                :class="{ 'line-through': !todoItem.isActive }"
                type="text"
                v-model="todoItem.text"
                @input="handleInput(index)"
                @keydown.enter="handleEnter(index)"
                @keyup.delete="handleDelete(index)"
                ref="inputRefs"
              />
            </div>
          </div>

          <hr />

          <!-- UNFINISHED TODO LIST -->
          <div
            v-for="(todoItem, index) in currentTodoData.todo_items"
            :key="index"
          >
            <div v-if="!todoItem.isActive" class="my-2 flex items-center gap-2">
              <input
                type="checkbox"
                :checked="
                  isChecked(
                    currentTodoData.todo_items.findIndex(
                      (item) => item.id === todoItem.id
                    )
                  )
                "
                @change="handleCheckboxToggle(index)"
                class="mr-2 block"
              />
              <input
                class="w-full block"
                :class="{ 'line-through': !todoItem.isActive }"
                v-model="todoItem.text"
              />
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
