<template>
  <div class="home-page">
    <QuoteOfTheDay />
    <BookList />
  </div>
</template>

<script>
import QuoteOfTheDay from "../components/main/QuoteOfTheDay.vue";
import BookList from "../components/main/BookList.vue";

export default {
  components: {
    QuoteOfTheDay,
    BookList,
  },
};
</script>

<style scoped>
.home-page {
  padding: 20px;
}
</style>
