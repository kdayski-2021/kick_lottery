<template>
  <v-container>
    <v-row>
      <v-col>
        Информация о завершенном раунде:
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1">Дата завершения</v-col>
      <v-col cols="1">номер раунда</v-col>
      <v-col cols="1">сожжено</v-col>
      <v-col cols="1">роздано</v-col>
      <v-col cols="1">ушло в след раунд</v-col>
      <v-col cols="1">Количество победителей</v-col>
      <v-col cols="3">список победителей с размерами выигрыша</v-col>
      <v-col cols="3"
        >список участников с размерами ставок и шансами на победу</v-col
      >
    </v-row>
    <v-row>
      <v-col cols="1">{{ formatDate(completedRoundHistory.endDate) }}</v-col>
      <v-col cols="1">{{ completedRoundHistory.roundNumber }}</v-col>
      <v-col cols="1">{{ completedRoundHistory.burned }}</v-col>
      <v-col cols="1">{{ completedRoundHistory.given }}</v-col>
      <v-col cols="1">{{ completedRoundHistory.leftToNextRound }}</v-col>
      <v-col cols="1">{{ completedRoundHistory.numwinners }}</v-col>
      <v-col cols="3">
        <div
          v-for="(winner, index) in completedRoundHistory.winners"
          :key="index"
        >
          <div>address: {{ winner.address }}</div>
          <div>amount: {{ winner.amount }}</div>
        </div>
      </v-col>
      <v-col cols="3">
        <div
          v-for="(participant, index) in completedRoundHistory.participants"
          :key="index"
        >
          <div>address: {{ participant.address }}</div>
          <div>bet: {{ participant.bid }}</div>
          <div>chance: {{ participant.chance }}</div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CompletedRoundHistory',
  props: ['completedRoundHistory'],
};
</script>

<style scoped></style>
