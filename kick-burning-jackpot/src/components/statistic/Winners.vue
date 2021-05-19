<template>
  <v-container>
    <v-row>
      <v-col>Псоледние победители</v-col>
    </v-row>
    <v-row v-for="(winner, index) in winners" :key="index" v-model="records">
      <v-col cols="12" v-if="index < records">
        {{ winner.date }} {{ winner.address }}
        {{ winner.bet }}
      </v-col>
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
    winners: [],
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
    sortWinners() {
      for (this.participant of this.participants) {
        if (this.participant.result === 'win') {
          this.winners.push(this.participant);
        }
      }
    },
  },
  beforeMount() {
    this.sortWinners();
  },
};
</script>

<style scoped></style>
