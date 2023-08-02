<script setup lang="ts">
import { useRouter } from "vue-router";
import { updateTodoItemById } from "../vuetils/useTodoItem";


const { todo } = defineProps(["todo"]);
const emit = defineEmits(["openModal"]);

const router = useRouter();

const openModal = () => {
  emit("openModal");
};

const onChangeTodoStatusHandler = async (
  todoItemId: string,
  todoItemStatus: boolean
) => {
  console.log('clicked')
  await updateTodoItemById(todoItemId, {
    is_complete: !todoItemStatus,
  })
    .then(() => {
      console.log("todo item status updated");
    })
    .catch((error) => {
      console.error("failed to updated todo item status: " + error);
    });
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
      <div v-if="!todoItem.is_complete" class="my-2">
        <input
          type="checkbox"
          v-model="todoItem.is_complete"
          class="mr-2"
          @click="onChangeTodoStatusHandler(todoItem.id, todoItem.is_complete)"
        />
        <span class="w-full" :class="{ 'line-through': todoItem.is_complete }">{{
          todoItem.text
        }}</span>
      </div>
    </div>
    <hr>
    <div v-for="(todoItem, index) in todo.todo_items" :key="index">
      <div v-if="todoItem.is_complete" class="my-2">
        <input type="checkbox" class="mr-2" v-model="todoItem.is_complete" @click="onChangeTodoStatusHandler(todoItem.id, todoItem.is_complete)"/>
        <span
          class="w-full text-gray-500"
          :class="{ 'line-through': todoItem.is_complete }"
          >{{ todoItem.text }}</span
        >
      </div>
    </div>
  </div>
</template>
