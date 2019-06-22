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
    {{this.data ? this.data : null}}
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
      inputValue: null,
      wrongFormat: false,
      errorMessage: null,
      categories: [],
      dataIsLoading: null,
      data: null
    };
  },
  methods: {
    handleUrlInput(inputValue) {
      let urlCheck = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (urlCheck.test(inputValue)) {
        this.inputValue = inputValue;
        this.wrongFormat = false;
        this.errorMessage = null;
      } else {
        this.errorMessage = "The URL is not the correct format";
        this.wrongFormat = true;
        console.log(this.errorMessage);
      }
    },

    handleCheck(inputValue) {
      if (!this.categories.includes(inputValue)) {
        this.categories.push(inputValue);
      } else {
        this.categories.splice(this.categories.indexOf(inputValue), 1);
      }
      console.log(this.categories);
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
      this.dataIsLoading = true;
      let dataLoaded = console.log("DATAISLOADING::: " + this.dataIsLoading);
      let baseURL =
        "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

      let parameters = {
        testUrl: "?url=" + this.inputValue,
        categories: "&category=" + this.categories.join("&category="),
        apiKey: "&key=AIzaSyB9kaG7GbJ9-dtd14f89CKyyWdknydu7Jg"
      };
      console.log(parameters);
      console.log(
        baseURL + parameters.testUrl + parameters.categories + parameters.apiKey
      );
      // Make API call
      axios
        .get(
          baseURL +
            parameters.testUrl +
            parameters.categories +
            parameters.apiKey
        )
        .then(function(response) {
          console.log(response);
          // Handle success (with a try/catch error check)
          try {
            if (response.status === 200 && response.data) {
              console.log("Success: " + JSON.parse(response.data));
              this.data = response.data;
              this.dataIsLoading = false;
              console.log("DATA:::: " + this.data);
            }
            // Handle error codes
            else {
              console.log("Error: " + response);
              this.dataIsLoading = false;
            }
          } catch (err) {
            // Handle error codes
            console.log("Error: " + response);
            this.dataIsLoading = false;
          }
        })
        .catch(function(response) {
          console &&
            console.log &&
            console.log("Something went wrong...", response);
        });
    }
  }
};
</script>

