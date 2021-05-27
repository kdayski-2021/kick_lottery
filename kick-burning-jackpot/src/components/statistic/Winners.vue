<template>
  <v-container>
    <v-row>
      <v-col>Last winners</v-col>
    </v-row>
    <v-row>
      <v-col cols="2">Data</v-col>
      <v-col cols="7">Player</v-col>
      <v-col cols="3">Jackpot</v-col>
    </v-row>
    <v-row v-for="(winner, index) in winners" :key="index" v-model="records">
      <v-col cols="2" v-if="index < records">
        {{ JSON.parse(winner).RunAt }}
      </v-col>
      <v-col cols="7" v-if="index < records">
        {{ JSON.parse(winner).Player }}
      </v-col>
      <v-col cols="3" v-if="index < records">
        {{ JSON.parse(winner).Jackpot }}
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
    winners: {
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
        this.records = this.winners.length;
      }
    },
  },
  watch: {
    $props: {
      handler() {
        if (this.show) {
          this.records = this.winners.length;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
