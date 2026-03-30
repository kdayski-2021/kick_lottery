<template>
  <v-container>
    <v-row>
      <v-col class="title">Kick token lottery</v-col>
    </v-row>
    <v-row>
      <v-col class="best-lottery">
        Просмотр Текущего раунда:
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">размер текущего джекпота</v-col>
      <v-col cols="4"
        >Время до окончания раунда/до окончания приема ставок</v-col
      >
      <v-col cols="4">Количество участников</v-col>
    </v-row>
    <v-row>
      <v-col cols="4">{{ currentLottery.jackpot }}</v-col>
      <v-col cols="4">{{ currentLottery.endBets }}</v-col>
      <v-col cols="4">{{ currentLottery.members }}</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Lottery',
  props: ['currentLottery'],
};
</script>

<style scoped></style>
