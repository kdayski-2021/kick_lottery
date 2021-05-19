<template>
  <v-btn elevation="2" class="button" @click="$emit('click')">
    <template v-if="text">
      <span>{{ text }}</span>
    </template>
    <template v-else>
      <span><slot /></span>
    </template>
  </v-btn>
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
