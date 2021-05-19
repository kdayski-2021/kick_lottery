<template>
  <button class="button" @click="$emit('click')">
    <template v-if="text">
      <span>{{ text }}</span>
    </template>
    <template v-else>
      <span><slot /></span>
    </template>
  </button>
</template>

<script>
export default {
  name: 'UIButton',

  props: {
    text: String,
    outlined: Boolean,
    width: Boolean,
    route: String,
  },
};
</script>

<style scoped></style>
