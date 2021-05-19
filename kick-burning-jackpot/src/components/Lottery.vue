<template>
  <v-container>
    <div class="title">KiK token lottery</div>
    <div class="best-lottery">Best lottery of all time {{ bestLottery }}</div>
  </v-container>
</template>

<script>
export default {
  name: 'Lottery',
  props: {
    bestLottery: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped></style>
