<template>
  <div id="app">
    <TestForm
      title="Test your site's"
      v-on:on-input="handleUrlInput"
      v-on:on-check="handleCheck"
      v-on:on-submit="handleSubmit"
      :wrongFormat="this.wrongFormat"
      :errorMessage="this.errorMessage"
      :dataIsLoading="this.dataIsLoading"
    />
    <Results v-if="this.dataIsLoading === false" :scores="this.categoryScores"/>
    {{this.responseError && this.responseError}}
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
      inputValue: null,
      wrongFormat: false,
      errorMessage: null,
      categories: [],
      dataIsLoading: null,
      data: null,
      categoryScores: {},
      responseError: null,
      testObj: { test: "testing" }
    };
  },

  methods: {
    handleUrlInput(inputValue) {
      let urlCheck = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      if (urlCheck.test(inputValue)) {
        this.inputValue = inputValue;
        this.wrongFormat = false;
        this.errorMessage = null;
      } else {
        //this.errorMessage = "The URL is not the correct format";
        this.wrongFormat = true;
      }
    },

    handleCheck(inputValue) {
      if (!this.categories.includes(inputValue)) {
        this.categories.push(inputValue);
      } else {
        this.categories.splice(this.categories.indexOf(inputValue), 1);
      }
    },

    handleSubmit(event) {
      event.preventDefault();
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

    loadData() {
      this.categoryScores = {};
      this.responseError = null;
      this.dataIsLoading = true;
      let baseURL =
        "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

      let parameters = {
        testUrl: "?url=" + this.inputValue,
        categories: "&category=" + this.categories.join("&category="),
        apiKey: "&key=AIzaSyB9kaG7GbJ9-dtd14f89CKyyWdknydu7Jg"
      };

      // Make API call
      axios
        .get(
          baseURL +
            parameters.testUrl +
            parameters.categories +
            parameters.apiKey
        )
        .then(response => {
          // Handle success (with a try/catch error check)
          try {
            if (response.status === 200 && response.data) {
              this.data = response.data;
              let testedCategories = response.data.lighthouseResult.categories;

              this.categories.forEach(category => {
                if (testedCategories.hasOwnProperty(category)) {
                  this.categoryScores[category] =
                    testedCategories[category].score;
                }
              });
              this.dataIsLoading = false;
            }
            // Handle error codes
            else {
              this.dataIsLoading = false;
            }
          } catch (err) {
            // Handle error codes
            this.dataIsLoading = false;
          }
        })
        .catch(error => {
          this.dataIsLoading = false;
          this.responseError = "Unable to load content. " + error;
        });
    }
  }
};
</script>

