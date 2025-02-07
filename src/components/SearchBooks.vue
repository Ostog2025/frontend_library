<template>
  <div class="search-header" ref="searchHeader">
    <input
      v-model="query"
      type="text"
      placeholder="Пошук книг..."
      @input="handleSearch"
      @focus="showResults = true"
      class="search-input"
    />
    <div v-if="showResults && books.length" class="search-results">
      <ul>
        <li v-for="book in books" :key="book.bookid">
          <router-link :to="`/book/${book.bookid}`" @click="closeResults">
            {{ book.title }}
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else-if="showResults && !books.length" class="no-results">
      <p>Нічого не знайдено</p>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  data() {
    return {
      query: "",
      books: [],
      showResults: false,
      debounceTimeout: null,
      cache: {},
    };
  },

  methods: {
    handleSearch() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        if (this.query.trim().length === 0) {
          this.books = [];
          this.showResults = false;
          return;
        }

        if (this.cache[this.query]) {
          this.books = this.cache[this.query];
          this.showResults = this.books.length > 0;
          return;
        }

        this.showResults = true;

        try {
          const response = await api.get("/books/search", {
            params: { query: this.query },
          });

          this.books = response.data;
          this.cache[this.query] = response.data;

          if (this.books.length === 0) {
            this.showResults = false;
          }
        } catch (err) {
          console.error("Помилка при пошуку книг:", err);
          this.books = [];
        }
      }, 300);
    },
    closeResults() {
      this.showResults = false;
      this.query = "";
    },
    handleClickOutside(event) {
      const searchHeader = this.$refs.searchHeader;
      if (searchHeader && !searchHeader.contains(event.target)) {
        this.showResults = false;
      }
    },
  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.search-header {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.search-input:focus {
  width: 250px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.search-results ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-results li {
  padding: 8px;
  font-size: 14px;
}

.search-results a {
  text-decoration: none;
  color: #333;
}

.search-results li:hover a {
  color: #007bff;
}

.no-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  font-size: 14px;
  color: #999;
}
</style>
