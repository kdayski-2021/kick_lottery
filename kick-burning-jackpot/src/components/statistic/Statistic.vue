<template>
  <v-container>
    <v-row>
      <v-col cols="6"><Winners :winners="winners"/></v-col>
      <v-col cols="6"><Giveaway :participants="participants"/></v-col>
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
  props: {
    participants: {
      type: Array,
      default: () => [{}],
    },
    winners: {
      type: Array,
      default: () => [{}],
    },
  },
};
</script>

<style scoped></style>
