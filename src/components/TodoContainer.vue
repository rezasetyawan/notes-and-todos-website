<script setup lang="ts">
import { useRouter } from "vue-router";
import { updateTodoItemById } from "../vuetils/useTodoItem";
// import { GetTodoItem } from "../../global/types";
// import { ref } from "vue";

const { todo } = defineProps(["todo"]);
const emit = defineEmits(["openModal"]);

const router = useRouter();

// console.log(todo)

// const todoItems = ref<GetTodoItem[]>(todo.todo_items.map(todoItem => ({ ...todoItem })));

// console.log(todoItems)
const openModal = () => {
  emit("openModal");
};

const onChangeTodoStatusHandler = async (
  todoItemId: string,
  todoItemStatus: boolean
) => {
  console.log('clicked')
  await updateTodoItemById(todoItemId, {
    isActive: !todoItemStatus,
  })
    .then(() => {
      console.log("todo item status updated");
    })
    .catch((error) => {
      console.error("failed to updated todo item status: " + error);
    });
};

const isChecked = (index: number) => {
  return !todo.todo_items[index].isActive;
  
};

const redirectToDetail = (name: string, id: string) => {
  router.push(`${name}/${id}`);
};
</script>
<template>
  <div class="p-3 border-2 border-slate-600 rounded-lg break-inside-avoid">
    <h3
      class="text-lg font-semibold"
      @click="
        () => {
          redirectToDetail('todo', todo.id);
          openModal();
        }
      "
    >
      {{ todo.title }}
    </h3>
    <div v-for="(todoItem, index) in todo.todo_items" :key="index">
      <div v-if="todoItem.isActive" class="my-2">
        <input
          type="checkbox"
          :checked="isChecked(index)"
          class="mr-2"
          @click="onChangeTodoStatusHandler(todoItem.id, todoItem.isActive)"
        />
        <span class="w-full" :class="{ 'line-through': !todoItem.isActive }">{{
          todoItem.text
        }}</span>
      </div>
    </div>
    <div v-for="(todoItem, index) in todo.todo_items" :key="index">
      <div v-if="!todoItem.isActive" class="my-2">
        <input type="checkbox" class="mr-2" :checked="isChecked(index)" @click="onChangeTodoStatusHandler(todoItem.id, todoItem.isActive)"/>
        <span
          class="w-full text-gray-500"
          :class="{ 'line-through': !todoItem.isActive }"
          >{{ todoItem.text }}</span
        >
      </div>
    </div>
  </div>
</template>
