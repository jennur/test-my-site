<template>
  <div id="app">
    <TestForm
      title="Test your site's"
      @submit="loadData"
      :dataIsLoading="dataIsLoading"
    />
    <Results v-if="dataIsLoading === false" :scores="categoryScores"/>
    {{responseError && responseError}}
  </div>
</template>

<script>
import TestForm from "./components/TestForm.vue";
import Results from "./components/Results.vue";
import "./styles/main.scss";
import axios from "axios";

export default {
  name: "app",
  components: {
    TestForm,
    Results
  },
  data() {
    return {
      dataIsLoading: null,
      data: null,
      categoryScores: {},
      responseError: null,
      testObj: { test: "testing" }
    }
  },

  methods: {
    handleSubmit(payload) {
      let url = payload
      if (!this.wrongFormat && this.categories.length > 0) {
        this.errorMessage = null;
        this.loadData();
      } else {
        this.errorMessage =
          this.inputValue !== null
            ? "You need to check at least one option"
            : "The URL is not the correct format";
      }
    },

    loadData(payload) {
      this.categoryScores = {};
      this.responseError = null;
      this.dataIsLoading = true;
      
      let url = payload.url;
      let categories = payload.categories;
      // Make API call
      axios
        .get(url)
        .then(response => {
          this.data = response.data;
          let testedCategories = response.data.lighthouseResult.categories;

          categories.forEach(category => {
            if (testedCategories.hasOwnProperty(category)) {
              this.categoryScores[category] =
                testedCategories[category].score;
            }
          });
          this.dataIsLoading = false;
        })
        .catch(error => {
          this.dataIsLoading = false;
          this.errorMessage = "Unable to load content";
          console.log("Error:", error)
        });
    }
  }
};
</script>

