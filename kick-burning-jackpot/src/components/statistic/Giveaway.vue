<template>
  <v-container>
    <v-row>
      <v-col>Псоледние победители</v-col>
    </v-row>
    <v-row>
      <v-col>Дата</v-col>
      <v-col>Адрес</v-col>
      <v-col>Ставка</v-col>
      <v-col>Итог</v-col>
    </v-row>
    <v-row v-for="(participant, index) in participants" :key="index">
      <v-col v-if="index < records">{{ participant.date }}</v-col>
      <v-col v-if="index < records">{{ participant.address }}</v-col>
      <v-col v-if="index < records">{{ participant.bet }}</v-col>
      <v-col v-if="index < records">{{ participant.result }}</v-col>
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
    participants: {
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
        this.records = this.participants.length;
      }
    },
  },
};
</script>

<style scoped></style>
