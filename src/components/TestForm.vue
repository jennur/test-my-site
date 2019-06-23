<template>
  <div>
    <h1>{{ title }}</h1>
    <form class="form" v-on:submit="submitHandler($event)">
      <div class="form__categories">
        <label for="seo">
          <input id="seo" type="checkbox" value="seo" v-on:change="updateCategoryValues($event)">SEO
        </label>
        <label for="performance">
          <input
            id="performance"
            type="checkbox"
            value="performance"
            v-on:change="updateCategoryValues($event)"
          >Performance
        </label>
        <label for="accessibility">
          <input
            id="accessibility"
            type="checkbox"
            value="accessibility"
            v-on:change="updateCategoryValues($event)"
          >Accessibility
        </label>
      </div>
      <input
        v-bind:class="['form__url', {'form__url--error': wrongFormat}]"
        type="text"
        v-on:input="updateUrlValue($event)"
        placeholder="https://your-url.com"
      >
      <p
        v-bind:class="['form__error-message', {'form__error-message--open': errorMessage}]"
      >{{ errorMessage }}</p>
      <input class="form__submit" type="submit" value="Get data">
      <p
        v-bind:class="['form__loading', {'form__loading--active': dataIsLoading}]"
      >{{dataIsLoading ? "Loading..." : null}}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "TestForm",
  props: {
    title: String,
    wrongFormat: { type: Boolean, default: false },
    errorMessage: null,
    dataIsLoading: null
  },

  methods: {
    updateUrlValue(event) {
      this.$emit("on-input", event.target.value);
    },
    updateCategoryValues(event) {
      this.$emit("on-check", event.target.value);
    },
    submitHandler(event) {
      this.$emit("on-submit", event);
    }
  }
};
</script>
