<template>
  <div class="book-details">
    <div v-if="loading" class="loading">Завантаження...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="book-header">
        <div class="book-photo-wrapper">
          <img
            :src="`${book.book_photo}`"
            alt="Фото книги"
            v-if="book.book_photo"
            class="book-photo"
          />
        </div>
        <div class="book-info">
          <h1>{{ book.book_title }}</h1>
          <p class="author">
            <strong>Автор:</strong> {{ book.author_firstname }}
            {{ book.author_lastname }}
          </p>
          <p><strong>Жанр:</strong> {{ book.genre_name }}</p>
          <p><strong>Рік:</strong> {{ book.year }}</p>
          <p><strong>ISBN:</strong> {{ book.isbn }}</p>
          <p class="description">{{ book.book_description }}</p>
          <div v-if="isAuthenticated" class="like-button">
            <button @click="addLike">
              <i class="fa fa-heart" aria-hidden="true"></i> Додати у вподобання
            </button>
          </div>
        </div>
      </div>

      <div class="author-details">
        <h2>Про автора</h2>
        <div class="author-content">
          <div class="author-photo-wrapper">
            <img
              :src="`${book.author_photo}`"
              alt="Фото автора"
              v-if="book.author_photo"
              class="author-photo"
            />
          </div>
          <p class="author-biography">{{ book.author_biography }}</p>
        </div>
      </div>

      <div class="publisher-details">
        <h2>Про видавця</h2>
        <div class="publisher-content">
          <p><strong>Назва:</strong> {{ book.publisher_name }}</p>
          <p><strong>Адреса:</strong> {{ book.publisher_address }}</p>
          <p><strong>Телефон:</strong> {{ book.publisher_phone }}</p>
          <p><strong>Email:</strong> {{ book.publisher_email }}</p>
        </div>
      </div>

      <div class="availability">
        <h2>Доступність</h2>
        <p><strong>Доступно копій:</strong> {{ book.copiesavailable }}</p>
        <p><strong>Всього копій:</strong> {{ book.totalcopies }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../api.js";
import { mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "BookDetails",
  data() {
    return {
      book: null,
      loading: true,
      error: null,
    };
  },
  async created() {
    await this.fetchBook();
  },
  watch: {
    "$route.params.id": {
      immediate: true,
      handler() {
        this.fetchBook();
      },
    },
  },
  computed: {
    ...mapState(["isAuthenticated"]),
  },

  methods: {
    async fetchBook() {
      this.loading = true;
      this.error = null;
      const bookId = this.$route.params.id;

      try {
        const response = await api.get(`/books/id/${bookId}`);
        this.book = response.data;
      } catch (err) {
        this.error = "Не вдалося завантажити дані про книгу.";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async addLike() {
      try {
        const token = localStorage.getItem("token");

        const response = await api.post(
          "/likes",
          { bookid: this.book.bookid },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Успіх!",
          text: response.data.message,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text:
            error.response?.data?.message || "Помилка при додаванні вподобання",
        });
      }
    },
  },
};
</script>

<style scoped>
.like-button {
  margin-top: 20px;
}

.like-button button {
  background: #ff7e5f;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  margin: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.like-button button:hover {
  background: #ff6844;
}
.like-button i {
  margin-right: 5px;
}
.book-details {
  font-family: "Roboto", sans-serif;
  max-width: 1100px;
  margin: 40px auto;
  padding: 20px;
  background: #fefefe;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  color: #333;
  line-height: 1.6;
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.loading,
.error {
  text-align: center;
  font-size: 18px;
  color: #555;
}

.book-header {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
  margin-bottom: 30px;
}

.book-photo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-photo {
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.book-info h1 {
  font-size: 32px;
  color: #ff7e5f;
  margin-bottom: 10px;
}

.book-info p {
  font-size: 16px;
  margin: 5px 0;
}

.description {
  margin-top: 15px;
  color: #555;
  font-style: italic;
}

.author-details {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ff7e5f;
  border-radius: 8px;
  background: #fff4f1;
}

.author-content {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
}

.author-photo-wrapper {
  flex: 0 0 160px;
  display: flex;
  justify-content: center;
}

.author-photo {
  width: 100%;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.author-biography {
  flex-grow: 1;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.publisher-details {
  margin-top: 20px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.publisher-content p {
  margin: 5px 0;
}

.availability {
  margin-top: 20px;
  padding: 20px;
  background: #f3f3f3;
  border-radius: 8px;
  text-align: left;
}

.availability p {
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .book-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .author-content {
    flex-direction: column;
    align-items: center;
  }
}
</style>
