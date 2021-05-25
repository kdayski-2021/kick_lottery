<template>
  <v-container>
    <v-row>
      <v-col>Псоледние победители</v-col>
    </v-row>
    <v-row v-for="(winner, index) in winners" :key="index" v-model="records">
      <v-col cols="12" v-if="index < records">
        {{ JSON.parse(winner).EndDate }} {{ JSON.parse(winner).Winner }}
        <!-- {{ JSON.parse(winner).bet }} -->
        {{ JSON.parse(winner).Jackpot }}
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
    text: 'Все',
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
        this.text = 'Все';
        this.records = 2;
      } else {
        this.text = 'Скрыть';
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
