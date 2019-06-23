<template>
  <div>
    <ul v-if="scores" class="results">
      <li class="results__list-item" v-for="category in Object.keys(scores)" :key="category">
        <span class="results__score-bar-wrap">
          <span class="results__score-bar" :style="{width: scores[category]*100 +'%'}"></span>
        </span>
        <span>{{category.charAt(0).toUpperCase() + category.slice(1) + " score "}}</span>
        <b class="results__score">{{scores[category] === null ? "NaN" : scores[category]}}</b>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Results",
  props: {
    scores: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>
