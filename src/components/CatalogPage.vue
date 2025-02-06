<template>
  <div class="catalogs-list">
    <div class="catalog-grid">
      <div
        v-for="catalog in catalogs"
        :key="catalog.catalog_id"
        class="catalog-item"
      >
        <div class="catalog-card">
          <h2 class="catalog-title">{{ catalog.catalog_name }}</h2>
          <p class="catalog-date">
            Дата додавання: {{ catalog.catalog_entry_date }}
          </p>

          <div class="books">
            <div
              v-for="book in catalog.books"
              :key="book.bookid"
              class="book-item"
            >
              <router-link :to="`/book/${book.book_id}`" class="book-link">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api.js";

export default {
  data() {
    return {
      catalogs: [],
    };
  },
  methods: {
    async fetchCatalogs() {
      try {
        const response = await api.get("/collections");
        this.catalogs = response.data;
      } catch (err) {
        console.error("Помилка при отриманні каталогів:", err);
        this.catalogs = [];
      }
    },
  },
  mounted() {
    this.fetchCatalogs();
  },
};
</script>

<style>
.catalogs-list {
  padding: 20px;
}

.catalog-grid {
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.catalog-item {
  flex: 1 1 calc(33.33% - 20px);
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: background-color 0.3s;
  height: auto;
  display: flex;
  flex-direction: column;
}

.catalog-item .catalog-card {
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.catalog-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  color: #333;
}

.catalog-date {
  font-size: 14px;
  color: #777;
  text-align: center;
  margin-bottom: 20px;
}

.books {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.book-item {
  perspective: 1000px;
}

.book-card {
  position: relative;
  width: 100%;
  height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.book-card:hover {
  transform: rotateY(180deg);
}

.book-card h3 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 15px;
}

.book-card p {
  margin: 5px 0;
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
  background-color: #fff;
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

.book-back .overlay .padd {
  padding: 10px;
}

.book-card:hover .book-back .overlay {
  opacity: 1;
}

.book-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
}

@media (max-width: 1200px) {
  .catalog-item {
    flex: 1 1 calc(50% - 20px);
  }
}

@media (max-width: 768px) {
  .catalog-item {
    flex: 1 1 100%;
  }

  .book-card {
    height: auto;
  }

  .book-front img,
  .book-back img {
    height: 250px;
    object-fit: contain;
  }
}
</style>
