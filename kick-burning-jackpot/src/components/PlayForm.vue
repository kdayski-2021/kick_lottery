<template>
  <v-container>
    <div>Tokens approved: {{ approved }}</div>
    <form>
      <v-text-field
        v-model="tokens"
        :error-messages="tokensErrors"
        label="KiK"
        required
        @input="$v.tokens.$touch()"
        @blur="$v.tokens.$touch()"
      ></v-text-field>
      <v-btn
        class="mr-4"
        @click="approve"
        :disabled="approveDisabled"
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
      console.log(`joining ${this.approved} tokens`);
      await this.$bia.join(this.approved, (data) => {
        console.log(`hash ${data}`);
        if (data) {
          this.playLoading = true;
          this.approveDisabled = true;
        }
      });
    },
  },
  watch: {
    $props: {
      handler() {
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
