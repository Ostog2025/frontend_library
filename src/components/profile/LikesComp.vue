<template>
  <div class="books-list">
    <div class="book-grid">
      <div
        v-for="like in likes"
        tabindex="0"
        :key="like.likeid"
        class="book-item"
        @keydown.enter="goToDetails(like.bookid)"
      >
        <div class="book-card">
          <div class="book-front">
            <img
              :src="`${like.book_photo}`"
              alt="Фото книги"
              v-if="like.book_photo"
            />
          </div>
          <div class="book-back">
            <img
              :src="`${like.book_photo}`"
              alt="Фото книги"
              v-if="like.book_photo"
            />
            <div class="overlay">
              <div class="padd">
                <h3>{{ like.book_title }}</h3>
                <p>
                  Автор: {{ like.author_firstname }}
                  {{ like.author_lastname }}
                </p>
                <p>Жанр: {{ like.genre_name }}</p>
                <p>Рік: {{ like.year }}</p>
                <p>{{ like.book_description }}</p>
                <button @click="removeLike(like.likeid)">
                  <i class="fas fa-heart-broken"></i> Видалити з вподобаних
                </button>
                <button @click="createReservation(like.bookid)">
                  <i class="fas fa-bookmark"></i> Забронювати книгу
                </button>
                <router-link :to="`/book/${like.bookid}`" class="book-link">
                  <i class="fas fa-info-circle"></i> Переглянути деталі
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      likes: [],
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchLikes() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/likes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.likes = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Помилка при завантаженні";
      } finally {
        this.loading = false;
      }
    },
    async removeLike(likeid) {
      const likedBook = this.likes.find((like) => like.likeid === likeid);
      const confirm = await Swal.fire({
        title: "Ви впевнені?",
        text: `Ви хочете видалити "${likedBook.book_title}" з вподобаних?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff7e5f",
        cancelButtonColor: "#ccc",
        confirmButtonText: "Так, видалити",
        cancelButtonText: "Скасувати",
      });

      if (confirm.isConfirmed) {
        try {
          await axios.delete(
            `https://backend-library-0o7f.onrender.com/api/likes/${likeid}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          this.likes = this.likes.filter((like) => like.likeid !== likeid);

          Swal.fire({
            icon: "success",
            title: "Видалено!",
            text: `"${likedBook.book_title}" видалено з вподобаних.`,
            confirmButtonColor: "#ff7e5f",
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Помилка",
            text:
              err.response?.data?.message || "Не вдалося видалити вподобання",
          });
        }
      }
    },
    async createReservation(bookId) {
      const selectedBook = this.likes.find((like) => like.bookid === bookId);

      const result = await Swal.fire({
        title: "Забронювати книгу?",
        text: `Ви хочете забронювати "${selectedBook.book_title}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ff7e5f",
        cancelButtonColor: "#ccc",
        confirmButtonText: "Так, забронювати",
        cancelButtonText: "Скасувати",
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "https://backend-library-0o7f.onrender.com/api/reservations",
            {
              bookId,
              status: "active",
              loandate: new Date().toISOString().split("T")[0],
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          Swal.fire({
            title: "Готово!",
            text: `"${selectedBook.book_title}" успішно заброньовано.`,
            icon: "success",
            confirmButtonColor: "#ff7e5f",
          });
        } catch (err) {
          const errorMessage =
            typeof err.response?.data === "string"
              ? err.response.data
              : err.response?.data?.message || "Не вдалося забронювати книгу";

          Swal.fire("Помилка", errorMessage, "error");
        }
      }
    },
    goToDetails(bookId) {
      this.$router.push(`/book/${bookId}`);
    },
  },
  mounted() {
    this.fetchLikes();
  },
};
</script>

<style scoped>
button {
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

button:hover {
  background: #ff6844;
}

.book-link {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 12px;
  background-color: #ccc;
  color: #333;
  text-decoration: none;
  border-radius: 6px;
  font-family: "Roboto", sans-serif;
  transition: background-color 0.3s;
}

.book-link:hover {
  background-color: #bbb;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 90px;
}
.likes {
  padding: 20px;
}
.like-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f1f1;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
}
button {
  background: #d9534f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #c9302c;
}
.error {
  color: red;
  margin-top: 10px;
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
