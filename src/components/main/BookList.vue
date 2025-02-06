<template>
  <div class="books-list">
    <!-- Фільтри -->
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div class="filters">
        <div class="div">
          <label for="author">Автор:</label>
          <select v-model="filters.authorid" @change="fetchBooks">
            <option value="">Всі</option>
            <option
              v-for="author in authors"
              :key="author.authorid"
              :value="author.authorid"
            >
              {{ author.firstname }} {{ author.lastname }}
            </option>
          </select>

          <label for="genre">Жанр:</label>
          <select v-model="filters.genreid" @change="fetchBooks">
            <option value="">Всі</option>
            <option
              v-for="genre in genres"
              :key="genre.genreid"
              :value="genre.genreid"
            >
              {{ genre.name }}
            </option>
          </select>

          <label for="publisher">Видавництво:</label>
          <select v-model="filters.publisherid" @change="fetchBooks">
            <option value="">Всі</option>
            <option
              v-for="publisher in publishers"
              :key="publisher.publisherid"
              :value="publisher.publisherid"
            >
              {{ publisher.name }}
            </option>
          </select>
        </div>

        <div class="div">
          <label for="sortBy">Сортувати за:</label>
          <select v-model="filters.sortBy" @change="fetchBooks">
            <option value="title">Назвою</option>
            <option value="year">Роком</option>
          </select>

          <label for="sortOrder">Порядок:</label>
          <select v-model="filters.sortOrder" @change="fetchBooks">
            <option value="asc">За зростанням</option>
            <option value="desc">За спаданням</option>
          </select>
        </div>
      </div>
    </transition>

    <!-- Список книг -->
    <transition
      name="fade"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div class="book-grid">
        <div v-for="book in books" :key="book.bookid" class="book-item">
          <router-link :to="`/book/${book.bookid}`" class="book-link">
            <div class="book-card">
              <div class="book-front">
                <img
                  :src="`https://backend-library-0o7f.onrender.com/images/book_covers/${book.book_photo}`"
                  alt="Фото книги"
                  v-if="book.book_photo"
                />
              </div>
              <div class="book-back">
                <img
                  :src="`https://backend-library-0o7f.onrender.com/images/book_covers/${book.book_photo}`"
                  alt="Фото книги"
                  v-if="book.book_photo"
                />
                <div class="overlay">
                  <div class="padd">
                    <h3>{{ book.book_title }}</h3>
                    <p>
                      Автор: {{ book.author_firstname }}
                      {{ book.author_lastname }}
                    </p>
                    <p>Жанр: {{ book.genre_name }}</p>
                    <p>Рік: {{ book.year }}</p>
                    <p>{{ book.book_description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from "../../api.js";

export default {
  data() {
    return {
      books: [],
      authors: [],
      genres: [],
      publishers: [],
      filters: {
        authorid: "",
        genreid: "",
        publisherid: "",
        sortBy: "title",
        sortOrder: "asc",
      },
    };
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await api.get("/books", { params: this.filters });
        this.books = response.data;
      } catch (err) {
        console.error("Помилка при отриманні книг:", err);
        this.books = [];
      }
    },

    async fetchFilters() {
      try {
        const response = await api.get("/books/filters");
        this.authors = response.data.authors;
        this.genres = response.data.genres;
        this.publishers = response.data.publishers;
      } catch (err) {
        console.error("Помилка при отриманні фільтрів:", err);
      }
    },
    beforeEnter(el) {
      el.style.opacity = 0;
    },
    enter(el, done) {
      el.offsetHeight;
      el.style.transition = "opacity 1s";
      el.style.opacity = 1;
      done();
    },
    leave(el, done) {
      el.style.transition = "opacity 1s";
      el.style.opacity = 0;
      done();
    },
  },
  mounted() {
    this.fetchBooks();
    this.fetchFilters();
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.filters {
  padding: 20px 20px 0;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.filters .div {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  padding-bottom: 20px;
}

.filters label {
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 14px;
  color: #374151;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filters select:hover {
  border-color: #93c5fd;
}

.filters select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.filters .div > * {
  flex: 1;
  min-width: 150px;
}

.filters select option {
  color: #111827;
}

@media (max-width: 767px) {
  .filters .div {
    flex-direction: column;
    gap: 15px;
  }

  .filters select {
    width: 100%;
  }
  .filters label,
  .filters select {
    flex: 1 1 50px;
  }
}

.books-list {
  padding: 20px 0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 90px;
}

.book-item {
  perspective: 1000px;
  margin: 0 auto;
}

.book-card {
  position: relative;
  width: 99%;
  height: 450px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.book-card:hover {
  transform: rotateY(180deg);
}

.book-front,
.book-back {
  position: absolute;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.book-front {
  background-color: #f0f0f0;
}

.book-front img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-back {
  background-color: #333;
  color: #fff;
  transform: rotateY(180deg);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.book-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.7;
}

.book-back .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 16px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-back .overlay {
  opacity: 1;
}

@media (max-width: 1024px) {
  .book-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 60px;
  }

  .book-card {
    height: 400px;
  }

  .book-back .overlay {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
  }

  .book-card {
    height: 350px;
  }

  .book-back .overlay {
    font-size: 12px;
    padding: 10px;
  }
}

@media (max-width: 568px) {
  .books-list {
    padding: 10px 0;
  }

  .book-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .book-card {
    width: 100%;
    height: 300px;
  }

  .book-front img,
  .book-back img {
    object-fit: contain;
  }

  .book-back .overlay {
    font-size: 10px;
  }
  .filters label,
  .filters select {
    flex: 1 1 10px;
  }
}

@media (max-width: 375px) {
  .book-grid {
    gap: 15px;
  }

  .book-card {
    height: 250px;
  }

  .book-back .overlay {
    font-size: 8px;
    padding: 5px;
  }
}
</style>
