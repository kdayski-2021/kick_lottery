<template>
  <v-container>
    <v-row>
      <v-col>Last participants</v-col>
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
                  Bet
                </th>
                <th class="text-left">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(participant, index) in participants
                  .slice()
                  .reverse()
                  .slice(maxRecords * (page - 1))"
                :key="index"
              >
                <td v-if="index < maxRecords">
                  {{ formatDate(participant.RunAt) }}
                </td>
                <td v-if="index < maxRecords">
                  {{ participant.Player }}
                </td>
                <td v-if="index < maxRecords">
                  {{ participant.Bet }}
                </td>
                <td v-if="index < maxRecords">
                  {{ participant.IsWinner ? 'win' : 'lose' }}
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
    participants: {
      type: Array,
      default: () => [{}],
    },
  },
  watch: {
    $props: {
      handler() {
        this.pages = Math.ceil(this.participants.length / this.maxRecords);
        this.records = this.participants.length;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
