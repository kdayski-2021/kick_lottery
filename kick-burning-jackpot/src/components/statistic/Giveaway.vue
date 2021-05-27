<template>
  <v-container>
    <v-row>
      <v-col>Last participants</v-col>
    </v-row>
    <v-row>
      <v-col cols="2">Data</v-col>
      <v-col cols="6">Player</v-col>
      <v-col cols="2">Bet</v-col>
      <v-col cols="2">Result</v-col>
    </v-row>
    <v-row v-for="(participant, index) in history" :key="index">
      <v-col cols="2" v-if="index < records">{{
        JSON.parse(participant).RunAt
      }}</v-col>
      <v-col cols="6" v-if="index < records">{{
        JSON.parse(participant).Player
      }}</v-col>
      <v-col cols="2" v-if="index < records">{{
        JSON.parse(participant).Bet
      }}</v-col>
      <v-col cols="2" v-if="index < records"
        >{{ JSON.parse(participant).IsWinner ? 'win' : 'lose' }}
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn class="mr-4" @click="showRecords">
          {{ text }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Winners',
  data: () => ({
    records: 2,
    text: 'Show all',
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
        this.text = 'Show all';
        this.records = 2;
      } else {
        this.text = 'Hide';
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
