<template>
  <div>
    <h1>{{ title }}</h1>
    <form class="form" @submit="submitHandler($event)">
      <div class="categories">
        <label for="seo">
          <input id="seo" type="checkbox" value="seo" checked @change="updateCategoryValues($event)">SEO
        </label>
        <label for="performance">
          <input
            id="performance"
            type="checkbox"
            value="performance"
            checked
            @change="updateCategoryValues($event)"
          >Performance
        </label>
        <label for="accessibility">
          <input
            id="accessibility"
            type="checkbox"
            value="accessibility"
            checked
            @change="updateCategoryValues($event)"
          >Accessibility
        </label>
      </div>
      <input
        v-bind:class="['url', {'error': wrongFormat}]"
        type="text"
        @input="updateUrlValue($event)"
        placeholder="https://your-url.com"
      >
      <p :class="['error-message', {'open': errorMessage}]"
      >{{ errorMessage }}</p>
      <input class="submit" type="submit" value="Get data" :disabled="!!dataIsLoading">
      <p
        v-bind:class="['loading', {'active': dataIsLoading}]"
      >{{dataIsLoading ? "Loading..." : null}}</p>
    </form>
  </div>
</template>

<script>
export default {
  name: "TestForm",
  props: {
    title: String,
    dataIsLoading: null
  },
  data() {
      return {
        categories: ["seo", "performance", "accessibility"],
        errorMessage: null,
        wrongFormat: false,
        url: null
      }
  },
  methods: {
    checkUrlFormat(inputValue) {
      let urlCheck = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
      return urlCheck.test(inputValue)
    },
    updateUrlValue(event) {
      let url = event.target.value;
      if(this.checkUrlFormat(url)) {
        this.url = url;
        this.errorMessage = null;
        this.wrongFormat = false;
      }
      else if (!url.length) this.errorMessage = "This field cannot be empty";
      else {
        this.wrongFormat = true;
        this.errorMessage = "The URL is not the correct format";
      }
    },
    updateCategoryValues(event) {
      let category = event.target.value;

      if (!this.categories.includes(category)) {
        this.categories.push(category);
      } else {
        this.categories.splice(this.categories.indexOf(category), 1)
      }
    },
    submitHandler(event) {
      event.preventDefault();
      let categories = this.categories;
      let url = this.url;

      if (categories.length > 0 && url) {
        this.errorMessage = null;
        let baseUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
        let urlParam = "?url=" + this.url;
        let categoryParams = "&category=" + this.categories.join("&category=")
        let url = baseUrl + urlParam + categoryParams;
        this.$emit("submit", {url, categories});
      } else {
        this.errorMessage = !url ? "URL cannot be empty" : "You need to check at least one option";
      }
    }
  }
};
</script>
