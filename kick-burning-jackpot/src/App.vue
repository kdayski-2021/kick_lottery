<template>
  <v-app>
    <v-main>
      <v-container>
        <ConnectWallet :accountAddress="accountAddress" />
        <Lottery :bestLottery="bestLottery" />
        <Jackpot :jackpot="jackpot" />
        <PlayForm :approved="allowance" :jackpot="jackpot" />
        <Statistic :history="history" :winners="winners" />
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
    allowance: 0,
    jackpot: 0,
    history: [],
    winners: [],
    bestLottery: {},
    accountAddress: '',
  }),

  async mounted() {
    await this.$bia.connectRpc();
    this.roundNumber = await this.$bia.getRoundNumber();
    this.bestLottery = await this.$bia.getBestLottery();
    setInterval(async () => {
      if (this.$bia.connectedRpc) {
        this.jackpot = await this.$bia.getJackpot();
        this.allowance = await this.$bia.getAllowance();
        this.history = await this.$bia.getHistoryArray();
        this.winners = await this.$bia.getWinnersArray();
        this.bestLottery = await this.$bia.getBestLottery();
      }
    }, 5000);
  },
};
</script>
