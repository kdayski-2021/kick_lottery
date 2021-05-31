<template>
  <v-container>
    <v-row>
      <v-col>Last winners</v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Data
                </th>
                <th class="text-left">
                  Player
                </th>
                <th class="text-left">
                  Jackpot
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(winner, index) in winners
                  .slice()
                  .reverse()
                  .slice(maxRecords * (page - 1))"
                :key="index"
              >
                <td v-if="index < maxRecords">
                  {{ format(JSON.parse(winner).RunAt) }}
                </td>
                <td v-if="index < maxRecords">
                  {{ JSON.parse(winner).Player }}
                </td>
                <td v-if="index < maxRecords">
                  {{ JSON.parse(winner).Jackpot }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="pages"
            :total-visible="7"
          ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Winners',
  data: () => ({
    maxRecords: 10,
    records: 0,
    page: 1,
    pages: 1,
  }),
  props: {
    winners: {
      type: Array,
      default: () => [{}],
    },
  },
  methods: {
    format: (val) => {
      const date = new Date(Number(val * 1000));
      const month = date.getMonth() + 1;
      const fromattedDate =
        date.getDate() +
        '.' +
        (month < 10 ? '0' : '') +
        month +
        '.' +
        date.getFullYear();
      return fromattedDate;
    },
  },
  watch: {
    $props: {
      handler() {
        this.pages = Math.ceil(this.winners.length / this.maxRecords);
        this.records = this.winners.length;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
