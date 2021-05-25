<template>
  <v-app>
    <v-main>
      <v-container>
        <ConnectWallet />
        <Lottery />
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
  }),

  methods: {
    async getHistory(roundNumber) {
      for (let i = 0; i < roundNumber; i++) {
        await this.$bia.getHistory(i).then(async (res, rej) => {
          if (rej) {
            console.log(rej);
          }
          if (!this.history.includes(res)) {
            this.history.push(res);
          }
        });
      }
    },
    sortWinners() {
      for (this.participant of this.history) {
        if (
          this.participant.includes('Winner') &&
          !this.winners.includes(this.participant)
        ) {
          this.winners.push(this.participant);
        }
      }
    },
  },

  mounted() {
    setInterval(async () => {
      const roundNumber = await this.$bia.getRoundNumber();
      this.jackpot = await this.$bia.getJackpot();
      this.allowance = await this.$bia.getAllowance();
      await this.getHistory(roundNumber);
      await this.sortWinners();

      // console.log(`allowance: ${this.allowance}`);
      // console.log(`jackpot: ${this.jackpot}`);
      // console.log(`round number: ${roundNumber}`);
      // console.log(`history: ${this.history}`);
    }, 5000);
  },
};
</script>
