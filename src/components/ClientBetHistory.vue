<template>
  <v-container>
    <v-row>
      <v-col>История ставок клиента:</v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-simple-table dense>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  Номер раунда
                </th>
                <th class="text-left">
                  Статус раунда (завершен, завершается, активен)
                </th>
                <th class="text-left">
                  Размер ставки
                </th>
                <th class="text-left">
                  Выиграл/не выиграл. Если выиграл, то сколько + ссылка на
                  транзакцию
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in clientBetHistory
                  .slice()
                  .reverse()
                  .slice(maxRecords * (page - 1))"
                :key="index"
              >
                <td v-if="index < maxRecords">
                  {{ item.roundNumber }}
                </td>
                <td v-if="index < maxRecords">
                  {{ item.roundStatus }}
                </td>
                <td v-if="index < maxRecords">
                  {{ item.bet }}
                </td>
                <td v-if="index < maxRecords">
                  <span>{{ item.iswin }} {{ item.prize }}</span>
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
  name: 'ClientBetHistory',
  data: () => ({
    maxRecords: 10,
    records: 0,
    page: 1,
    pages: 1,
  }),
  props: {
    clientBetHistory: {
      type: Array,
      default: () => [{}],
    },
  },
  watch: {
    $props: {
      handler() {
        this.pages = Math.ceil(this.clientBetHistory.length / this.maxRecords);
        this.records = this.clientBetHistory.length;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
