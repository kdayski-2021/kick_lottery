<template>
  <v-app>
    <v-main>
      <v-container>
        <ConnectWallet :accountAddress="accountAddress" />
        <Lottery :currentLottery="currentLottery" />
        <HistoryList :historyList="historyList" />
        <CompletedRoundHistory :completedRoundHistory="completedRoundHistory" />
        <ClientBetHistory :clientBetHistory="clientBetHistory" />
        <PlayForm :jackpot="jackpot" :isTooFar="isTooFar" />

        <!-- <Jackpot :jackpot="jackpot" />
        <Statistic :participants="participants" :winners="winners" /> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Lottery from '@/components/Lottery';
import HistoryList from '@/components/HistoryList';
import CompletedRoundHistory from '@/components/CompletedRoundHistory';
import ClientBetHistory from '@/components/ClientBetHistory';
import PlayForm from '@/components/PlayForm';

// import Jackpot from '@/components/Jackpot';
// import Statistic from '@/components/statistic/Statistic';
import ConnectWallet from '@/components/ui/ConnectWallet';

export default {
  name: 'App',

  components: {
    Lottery,
    HistoryList,
    CompletedRoundHistory,
    ClientBetHistory,
    PlayForm,

    // Jackpot,
    // Statistic,
    ConnectWallet,
  },

  data: () => ({
    roundNumber: 0,
    currentLottery: {},
    historyList: [],
    completedRoundHistory: {},
    clientBetHistory: [],
    isTooFar: true,

    allowance: 0,
    jackpot: 0,
    participants: [],
    winners: [],
    bestLottery: {},
    accountAddress: '',
  }),

  async mounted() {
    try {
      await this.$bia.connectRpc();
      setInterval(async () => {
        if (this.$bia.connectedRpc) {
          this.roundNumber = await this.$bia.getRoundNumber();
          this.isTooFar = await this.$bia.isTooFar();
          this.currentLottery = await this.$bia.getCurrentLottery();
          this.historyList = await this.$bia.getHistoryArray();
          this.completedRoundHistory = await this.$bia.getCompletedRoundHistory(
            this.roundNumber === 0 ? 0 : this.roundNumber - 1
          );
          this.clientBetHistory = await this.$bia.getClientBetHistory(
            this.roundNumber
          );

          // this.jackpot = await this.$bia.getJackpot();
          // this.allowance = await this.$bia.getAllowance();
          // this.participants = await this.$bia.getParticipantsArray();
          // this.winners = await this.$bia.getWinnersArray();
          // this.bestLottery = await this.$bia.getBestLottery();
        }
      }, 5000);
    } catch (e) {
      console.log(e);
    }
  },
};
</script>
