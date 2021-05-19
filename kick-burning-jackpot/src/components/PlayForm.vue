<template>
  <v-container>
    <form>
      <v-text-field
        v-model="tokens"
        :error-messages="tokensErrors"
        label="KiK"
        required
        @input="$v.tokens.$touch()"
        @blur="$v.tokens.$touch()"
      ></v-text-field>
      <v-btn class="mr-4" @click="submit">
        Играть
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
  }),

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
    submit() {
      this.$v.$touch();
    },
  },
};
</script>

<style scoped></style>
