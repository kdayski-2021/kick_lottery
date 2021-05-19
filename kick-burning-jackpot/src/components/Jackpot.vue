<template>
  <v-container>
    <div>Джекпот: {{ jackpot }} KiK</div>
  </v-container>
</template>

<script>
export default {
  name: 'Jackpot',
  props: {
    jackpot: {
      type: Number,
      default: 0,
    },
  },
};
</script>
