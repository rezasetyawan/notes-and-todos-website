<script setup lang="ts">
const {todo} = defineProps(['todo'])
</script>
<template>
    <p>{{ todo.text }}</p>
</template>