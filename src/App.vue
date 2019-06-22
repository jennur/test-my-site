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
    {{this.categoryScores}}
    {{this.responseError && this.responseError}}
  </div>
</template>

<script>
import TestForm from "./components/TestForm.vue";
import "./styles/main.scss";
import axios from "axios";

export default {
  name: "app",
  components: {
    TestForm
  },
  data() {
    return {
      inputValue: {
        type: String,
        default: ""
      },
      wrongFormat: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String,
        default: ""
      },
      categories: {
        type: Array,
        default: []
      },
      dataIsLoading: {
        type: Boolean,
        default: null
      },
      data: {
        type: Object,
        default: {}
      },
      categoryScores: {
        type: Object,
        default: {}
      },
      responseError: {
        type: String,
        default: ""
      }
    };
  },

  methods: {
    handleUrlInput(inputValue) {
      let urlCheck = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
      if (urlCheck.test(inputValue)) {
        this.inputValue = inputValue;
        this.wrongFormat = false;
        this.errorMessage = null;
      } else {
        this.errorMessage = "The URL is not the correct format";
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
      if (this.inputValue && this.categories.length) {
        this.loadData();
      } else {
        this.errorMessage = "You need to check at least one option";
      }
    },

    loadData() {
      this.categoryScores = {};
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
        .catch(response => {
          this.responseError =
            "Unable to load content, error code " + response.status;
        });
    }
  }
};
</script>

