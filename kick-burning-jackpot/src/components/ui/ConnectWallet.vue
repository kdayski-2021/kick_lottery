<template>
  <v-container>
    <UIButton v-if="!walletConnected" color="primary" outlined @click="connect">
      Connect Wallet
    </UIButton>
    <UIButton v-else color="primary" outlined @click="disconnect">
      {{ accountAddress }}
    </UIButton>
  </v-container>
</template>

<script>
import UIButton from '@/components/ui/UIButton';

export default {
  name: 'ConnectWallet',
  components: {
    UIButton,
  },
  data: () => ({
    walletConnected: false,
    accountAddress: '',
  }),
  methods: {
    connect: async function() {
      this.$bia.connect(async (data) => {
        console.log('bia.connect');
        console.log(data);
        this.accountAddress = this.$bia.spliceAddress(data.address);
        this.walletConnected = data.success;
        if ([1, 4, 56, 97].includes(this.$bia.chainId)) {
          this.network = this.$bia.networkName;
        }
      });
    },
    disconnect: function() {
      console.log('close');
      // prov.disconnect()
    },
  },
};
</script>

<style scoped></style>
