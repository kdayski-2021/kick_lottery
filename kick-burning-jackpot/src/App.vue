<template>
  <v-app>
    <v-main>
      <v-container>
        <ConnectWallet />
        <Lottery />
        <Jackpot />
        <PlayForm />
        <Statistic />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Lottery from '@/components/Lottery';
import Jackpot from '@/components/Jackpot';
import PlayForm from '@/components/PlayForm';
import Statistic from '@/components/statistic/Statistic';
import ConnectWallet from '@/components/ui/ConnectWallet';

export default {
  name: 'App',

  components: {
    Lottery,
    Jackpot,
    PlayForm,
    Statistic,
    ConnectWallet,
  },

  data: () => ({
    //
  }),
};
</script>
