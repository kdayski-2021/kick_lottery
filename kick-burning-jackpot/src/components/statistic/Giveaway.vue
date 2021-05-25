<template>
  <v-container>
    <v-row>
      <v-col>Псоледние победители</v-col>
    </v-row>
    <v-row>
      <v-col cols="3">Дата</v-col>
      <v-col cols="3">Адрес</v-col>
      <v-col cols="3">Ставка</v-col>
      <v-col cols="3">Итог</v-col>
    </v-row>
    <v-row v-for="(participant, index) in history" :key="index">
      <v-col cols="3" v-if="index < records">{{
        JSON.parse(participant).EndDate
      }}</v-col>
      <v-col cols="3" v-if="index < records">{{
        JSON.parse(participant).Winner
      }}</v-col>
      <v-col cols="3" v-if="index < records"></v-col>
      <!-- <v-col v-if="index < records">{{ JSON.parse(participant).Bet }}</v-col> -->
      <v-col cols="3" v-if="index < records">{{
        JSON.parse(participant).Jackpot
      }}</v-col>
    </v-row>
    <v-row>
      <v-col @click="showRecords">{{ text }}</v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Winners',
  data: () => ({
    records: 2,
    text: 'Все',
    show: false,
  }),
  props: {
    history: {
      type: Array,
      default: () => [{}],
    },
  },
  methods: {
    showRecords() {
      this.show = !this.show;
      if (!this.show) {
        this.text = 'Все';
        this.records = 2;
      } else {
        this.text = 'Скрыть';
        this.records = this.history.length;
      }
    },
  },
  watch: {
    $props: {
      handler() {
        if (this.show) {
          this.records = this.history.length;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
