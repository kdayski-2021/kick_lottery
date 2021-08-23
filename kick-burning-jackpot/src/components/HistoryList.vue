<template>
  <v-container>
    <v-row>
      <v-col>История завершенных раундов:</v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  размер сожженных токенов
                </th>
                <th class="text-left">
                  Дата завершения
                </th>
                <th class="text-left">
                  номер раунда
                </th>
                <th class="text-left">
                  Размер джекпота
                </th>
                <th class="text-left">
                  Количество победителей
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in historyList
                  .slice()
                  .reverse()
                  .slice(maxRecords * (page - 1))"
                :key="index"
              >
                <td v-if="index < maxRecords">
                  {{ item.burnedTotal }}
                </td>
                <td v-if="index < maxRecords">
                  {{ formatDate(item.endDate) }}
                </td>
                <td v-if="index < maxRecords">
                  {{ item.roundNumber }}
                </td>
                <td v-if="index < maxRecords">
                  {{ item.jackpot }}
                </td>
                <td v-if="index < maxRecords">
                  {{ item.numwinners }}
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
  name: 'HistoryList',
  data: () => ({
    maxRecords: 10,
    records: 0,
    page: 1,
    pages: 1,
  }),
  props: {
    historyList: {
      type: Array,
      default: () => [{}],
    },
  },
  watch: {
    $props: {
      handler() {
        this.pages = Math.ceil(this.historyList.length / this.maxRecords);
        this.records = this.historyList.length;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
