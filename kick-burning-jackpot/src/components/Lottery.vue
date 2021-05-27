<template>
  <v-container>
    <v-row>
      <v-col class="title">Kick token lottery</v-col>
    </v-row>
    <v-row>
      <v-col class="best-lottery">
        Best lottery of all time:
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">Date</v-col>
      <v-col cols="6">Player</v-col>
      <v-col cols="2">Bet</v-col>
      <v-col cols="2">Jackpot</v-col>
    </v-row>
    <v-row>
      <v-col cols="2">{{ bestLottery.RunAt }}</v-col>
      <v-col cols="6">{{ bestLottery.Player }}</v-col>
      <v-col cols="2">{{ bestLottery.Bet }}</v-col>
      <v-col cols="2">{{ bestLottery.Jackpot }}</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Lottery',
  props: {
    bestLottery: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped></style>
