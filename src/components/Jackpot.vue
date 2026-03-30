<template>
  <v-container>
    <div>Jackpot: {{ jackpot }} Kick</div>
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

<style scoped></style>
