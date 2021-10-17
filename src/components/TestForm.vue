<template>
  <div>
    <form class="form" @submit="submitHandler($event)">
      <div class="categories">
        <label v-for="category in categories" :key="category.id" :for="category.id">
          <input  :id="category.id" 
                  type="checkbox" 
                  :value="category.id" 
                  checked 
                  @change="updateCategoryValues($event)"
          >{{ category.title }}
        </label>
      </div>
      <input
        :class="['url', {'error': wrongFormat}]"
        type="text"
        @input="updateUrlValue($event)"
        placeholder="https://your-url.com"
      >
      <p :class="['error-message', {'open': errorMessage}]"
      >{{ errorMessage }}</p>
      <input  class="submit" 
              type="submit" 
              value="Get data" 
              :class="{'disabled': dataIsLoading}" 
              :disabled="dataIsLoading"
      />
      <div v-if="dataIsLoading" class="loading">
        <div class="lds-grid">
          <div v-for="index in 9" :key="index"></div>
        </div>Loading...
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "TestForm",
  props: {
    dataIsLoading: Boolean,
    categories: Array
  },
  data() {
    let selectedCategories = this.categories.map(category => category.id);
    return {
      selectedCategories,
      errorMessage: null,
      wrongFormat: false,
      url: null
    }
  },
  methods: {
    checkUrlFormat(inputValue) {
      let urlCheck = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/
      return urlCheck.test(inputValue.toLowerCase())
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

      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      } else {
        this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1)
      }
    },
    submitHandler(event) {
      event.preventDefault();
      let categories = this.selectedCategories;
      let url = this.url;

      if (categories.length > 0 && url) {
        this.errorMessage = null;
        this.$emit("submit", { url, categories });
      } else {
        this.errorMessage = !url ? "URL cannot be empty" : "You need to check at least one option";
      }
    }
  }
};
</script>
