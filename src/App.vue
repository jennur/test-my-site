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
        .catch(() => {
          this.dataIsLoading = false;
          this.responseError = "Unable to load content";
        });
    }
  }
};
</script>

