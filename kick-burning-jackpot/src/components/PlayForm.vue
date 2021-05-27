<template>
  <v-container>
    <div>Tokens approved: {{ approved }}</div>
    <form>
      <v-text-field
        v-model="tokens"
        :error-messages="tokensErrors"
        label="Kick"
        required
        @input="$v.tokens.$touch()"
        @blur="$v.tokens.$touch()"
      ></v-text-field>
      <v-btn
        class="mr-4"
        @click="approve"
        :disabled="Boolean(approved) || approveDisabled"
        :loading="approveLoading"
      >
        Approve
      </v-btn>
      <v-btn
        class="mr-4"
        @click="play"
        :disabled="!Boolean(approved) || playDisabled"
        :loading="playLoading"
      >
        Play
      </v-btn>
    </form>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span v-if="participant.IsWinner"
            >Your jackpot is {{ participant.Jackpot }} Kick tokens</span
          >
          <span v-else
            >You lost {{ participant.Bet ? participant.Bet : 0 }} Kick
            tokens</span
          >
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
            class="text-right"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'PlayForm',
  mixins: [validationMixin],

  validations: {
    tokens: { required, minValue: minValue(1) },
  },

  data: () => ({
    tokens: 0,
    approveDisabled: false,
    approveLoading: false,
    playDisabled: false,
    playLoading: false,
    dialog: false,
    participant: {},
  }),

  props: {
    approved: {
      type: Number,
      default: 0,
    },
    jackpot: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    tokensErrors() {
      const errors = [];
      if (!this.$v.tokens.$dirty) return errors;
      !this.$v.tokens.minValue && errors.push('Min value is 1!');
      !this.$v.tokens.required && errors.push('Tokens is required!');
      if (this.approved > 0 && this.tokens != this.approved) {
        errors.push('Value must be equal with approved amount!');
        return errors;
      }
      return errors;
    },
  },

  methods: {
    async approve() {
      await this.$v.$touch();
      if (this.tokens > 0) {
        console.log(`approving ${this.tokens} tokens`);
        await this.$bia.approve(this.tokens, (data) => {
          console.log(`hash ${data}`);
          if (data) {
            this.approveLoading = true;
            this.playDisabled = true;
          }
        });
      }
    },
    async play() {
      await this.$v.$touch();
      if (Number(this.tokens) === this.approved) {
        console.log(`playing on ${this.approved} tokens`);
        await this.$bia.play(this.approved, async (data) => {
          console.log(`hash ${data}`);
          if (data) {
            this.playLoading = true;
            this.approveDisabled = true;
          }
        });
        await this.showDialog();
      }
    },
    async showDialog() {
      let round = await this.$bia.getRoundNumber();
      round = Number(round) - 1;
      let result = await this.$bia.getHistory(round);
      result = JSON.parse(result);
      this.dialog = true;
      this.participant = result;
    },
  },
  watch: {
    $props: {
      async handler() {
        if (this.approved !== 0) {
          this.approveLoading = false;
          this.playDisabled = false;
        }
        if (this.jackpot !== 0) {
          this.playLoading = false;
          this.approveDisabled = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
