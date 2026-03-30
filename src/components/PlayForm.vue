<template>
  <v-container>
    <div>Tokens played: {{ tokens }}</div>
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
        @click="play"
        :disabled="playDisabled"
        :loading="playLoading"
      >
        Play
      </v-btn>
      <v-btn class="mr-4" @click="checkRound">
        Забрать выигрыш (Round Change)
      </v-btn>
      <v-btn class="mr-4" @click="checkRoundAdmin" :disabled="isTooFar">
        Force Round Change
      </v-btn>
    </form>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ dialogText }}</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-actions>
          <v-btn
            :color="dialogColor"
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
    playDisabled: false,
    playLoading: false,
    dialog: false,
    dialogText: {},
    dialogColor: 'primary',
  }),

  props: {
    jackpot: {
      type: Number,
      default: 0,
    },
    isTooFar: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    tokensErrors() {
      const errors = [];
      if (!this.$v.tokens.$dirty) return errors;
      !this.$v.tokens.minValue && errors.push('Min value is 1!');
      !this.$v.tokens.required && errors.push('Tokens is required!');
      return errors;
    },
  },

  methods: {
    async checkRound() {
      if (!this.$bia.connected) {
        this.popup('Connect first', '#cc3300');
      } else {
        const { message, status } = await this.$bia.checkRound();
        this.popup(message, status);
      }
    },
    async checkRoundAdmin() {
      if (!this.$bia.connected) {
        this.popup('Connect first', '#cc3300');
      } else {
        await this.$bia.checkRoundAdmin();
      }
    },
    popup(text, color) {
      this.dialogText = text;
      this.dialogColor = color;
      this.dialog = true;
    },
    async play() {
      await this.$v.$touch();
      if (!this.$bia.connected) {
        this.popup('Connect first', '#cc3300');
      } else {
        if (Number(this.tokens) > 0) {
          this.playLoading = true;
          const data = await this.$bia.play(this.tokens);
          console.log(data);
          this.popup('Ставка принята', 'primary');
          this.playLoading = false;
        }
      }
    },
  },
  watch: {
    $props: {
      async handler() {
        if (this.jackpot === 0) {
          this.playDisabled = false;
        }
        if (this.jackpot !== 0) {
          this.playLoading = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
