<template>
  <v-container>
    <v-row>
      <v-col><Winners :participants="participants"/></v-col>
      <v-col><Giveaway :participants="participants"/></v-col>
    </v-row>
  </v-container>
</template>

<script>
import Winners from '@/components/statistic/Winners';
import Giveaway from '@/components/statistic/Giveaway';

export default {
  name: 'Statistic',
  components: {
    Winners,
    Giveaway,
  },
  data: () => ({
    participants: [
      { date: '01.01.2000', address: '0x0000...', bet: '10000', result: 'win' },
      {
        date: '01.01.2001',
        address: '0x0001...',
        bet: '10001',
        result: 'lose',
      },
      { date: '01.01.2002', address: '0x0002...', bet: '10002', result: 'win' },
      { date: '01.01.2003', address: '0x0003...', bet: '10003', result: 'win' },
    ],
  }),
};
</script>

<style scoped></style>
