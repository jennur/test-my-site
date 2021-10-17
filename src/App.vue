<template>
  <div id="app">
    <h1 class='main-title'>Test your site's</h1>
    <TestForm
      @submit="loadData"
      :dataIsLoading="dataIsLoading"
      :categories="categories"
    />
    <div class="details" v-if="data && data.date">
      <div class="url">Results for <a :href="data.url" target="__blank">{{ data.url }}</a></div>
      <div><b>Fetch time</b> {{ data.date }}</div>
    </div>

    <Results v-if="!dataIsLoading" :scores="categoryScores"/>

    <div v-if="responseError" class="response-error">
      {{ responseError }}
    </div>

    <div v-if="data && data.categories" class="tabs">
      <button v-for="tab in tabs" :key="tab.id"
              :class="['tab', {'active': activeTab === tab.id}]" 
              @click="activeTab = tab.id"
      >{{ tab.title }}
      </button>
    </div>

    <div v-if="data && data.categories" class="grid-content">
      <div class="sidebar">
        <nav class="nav">
          <a v-for="ref in nav(activeTab)" :key="ref" :href="`#${ref}`">
            {{ ref }}
          </a>
        </nav>
      </div>

      <div class="main-content">
        <div  v-for="(audit, index) in audits(activeTab)" 
              :key="index" 
              :id="audit[1].id" 
              class="audit"
        >
          <h3>{{ audit[1].title }}</h3>
          <p v-if="audit[1].score">
            <b>Score:</b>{{ audit[1].score }}
          </p>
          <div v-html="audit[1].description"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import TestForm from "./components/TestForm.vue";
import Results from "./components/Results.vue";
import "./styles/main.scss";
import axios from "axios";
import moment from 'moment';

export default {
  name: "app",
  components: {
    TestForm,
    Results
  },
  data() {
    return {
      dataIsLoading: false,
      data: null,
      categoryScores: {},
      responseError: null,
      activeTab: null,
      availableTabs: []
    }
  },
  computed: {
    categories() {
      return [
        { id: 'seo', title: 'SEO' },
        { id: 'performance', title: 'Performance' },
        { id: 'accessibility', title: 'Accessibility' }
      ]
    },
    tabs() {
      return this.categories.filter(category => {
        return this.availableTabs.indexOf(category.id) > -1;
      })
    }
  },
  methods: {
    audits(category) {
      category = this.data && this.data.categories[category] || null;

      if(category) {
        let audits = Object.entries(this.data.audits);
        let auditRefs = category.auditRefs.map(ref => {
          return ref.id;
        });
        audits = audits.filter(audit => {
          return auditRefs.indexOf(audit[0]) > -1;
        })
        return audits.map(audit => {
          audit[1].description = this.createTextLinks(audit[1].description)
          return audit;
        });
      }
      return null;
    },
    nav(category) {
      category = this.data && this.data.categories[category] || null;
      return category.auditRefs.map(ref => {
        return ref.id;
      });
    },
    createTextLinks (text) {
      let elements = text.match(/\[.*?\)/g);
      if(elements && elements.length){
        for(let el of elements){
          let txt = el.match(/\[(.*?)\]/)[1];
          let url = el.match(/\((.*?)\)/)[1];
          text = text.replace(el,`<a href="${url}" target="_blank">${txt}</a>`)
        }
      }
      return text;
    },
    async loadData(payload) {
      this.data = null;
      this.categoryScores = {};
      this.responseError = null;
      this.dataIsLoading = true;
      
      let url = payload.url;
      let categories = payload.categories;

      let params = `?url=${url}&category=${categories && categories.join("&category=")}`;

      try {
        let response = await axios.get("https://www.googleapis.com/pagespeedonline/v5/runPagespeed" + params)
        // let response = await axios.get('/test-result.json');
        let date = moment(response.data.lighthouseResult.fetchDate).format('MMMM Do YYYY, h:mm:ss a')
        let audits = response.data.lighthouseResult.audits;
        // console.log("Response:", response.data);

        this.data = {
          url: response.data.id,
          date,
          audits,
          categories: response.data.lighthouseResult.categories,
          categoryGroups: response.data.lighthouseResult.categoryGroups
        };
        this.availableTabs = categories;
        this.activeTab = categories[0];
        this.dataIsLoading = false;
      } 
      catch(error) {
          this.dataIsLoading = false;
          this.responseError = "Unable to load content. Please try again later.";
      }
    }
  }
};
</script>

