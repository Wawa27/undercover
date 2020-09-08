<template>
  <button class="w-64 px-8 py-2 rounded-lg font-semibold text-white" :class="color" @click="$emit('click')">
    {{ text }}
  </button>
</template>

<script>
export default {
name: "Button",
  props: ['text', 'color']
}
</script>

<style scoped>

</style>
