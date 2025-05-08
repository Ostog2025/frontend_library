<template>
  <div class="filters">
    <select v-model="statusFilter">
      <option value="">Всі статуси</option>
      <option value="active">Активні</option>
      <option value="completed">Завершені</option>
      <option value="cancelled">Скасовані</option>
    </select>
  </div>

  <div class="books-list">
    <div class="book-grid">
      <div
        v-for="reservation in filteredReservations"
        :key="reservation.reservationid"
        class="book-item"
        tabindex="0"
        :class="{
          'active-status': reservation.status === 'active',
          'completed-status': reservation.status === 'completed',
          'cancelled-status': reservation.status === 'cancelled',
        }"
        @keydown.enter="goToBookDetails(reservation.bookid)"
      >
        <div class="book-card">
          <div class="book-front">
            <img
              :src="`${reservation.book_photo}`"
              alt="Фото книги"
              v-if="reservation.book_photo"
            />
          </div>
          <div class="book-back">
            <img
              :src="`${reservation.book_photo}`"
              alt="Фото книги"
              v-if="reservation.book_photo"
            />
            <div class="overlay">
              <div class="padd">
                <h3>{{ reservation.book_title }}</h3>
                <p>Статус: {{ getStatusTranslation(reservation.status) }}</p>
                <p>
                  Дата бронювання: {{ formatDate(reservation.reservationdate) }}
                </p>
                <p>Дата видачі: {{ formatDate(reservation.loandate) }}</p>
                <p>
                  Дата повернення:
                  {{
                    reservation.returndate
                      ? formatDate(reservation.returndate)
                      : "Не повернено"
                  }}
                </p>
                <p>
                  Дата кінцевого терміну:
                  {{ formatDate(reservation.loan_duedate) }}
                </p>
                <button
                  v-if="reservation.status === 'active'"
                  @click="
                    confirmCancel(reservation.reservationid, reservation.copyid)
                  "
                >
                  Скасувати бронювання
                </button>
                <br />
                <router-link
                  :to="`/book/${reservation.bookid}`"
                  class="book-link"
                >
                  Переглянути деталі
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
      reservations: [],
      loading: false,
      error: null,
      statusFilter: "",
    };
  },
  computed: {
    filteredReservations() {
      console.log("Фільтрація розпочалася");

      console.log("Всі бронювання до фільтрації:", this.reservations);

      const filtered = this.reservations.filter((reservation) => {
        console.log("Обробка бронювання:", reservation);

        if (this.statusFilter && reservation.status !== this.statusFilter) {
          console.log(
            `Бронювання зі статусом ${reservation.status} пропускається через статус`
          );
          return false;
        }

        return true;
      });

      console.log("Результати після фільтрації:", filtered);

      return filtered;
    },
  },
  methods: {
    async fetchReservations() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.reservations = response.data;
      } catch (err) {
        this.error = err.response?.data?.message || "Помилка при завантаженні";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return date.toLocaleDateString("uk-UA", options);
    },
    getStatusTranslation(status) {
      switch (status) {
        case "active":
          return "Активний";
        case "completed":
          return "Завершено";
        case "cancelled":
          return "Скасовано";
        default:
          return status;
      }
    },
    confirmCancel(reservationId, copyId) {
      Swal.fire({
        title: "Ви впевнені?",
        text: "Це скасує ваше бронювання!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ff7e5f",
        cancelButtonColor: "#ccc",
        confirmButtonText: "Так, скасувати!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelReservation(reservationId, copyId);
        }
      });
    },
    async cancelReservation(reservationId, copyId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
          `https://backend-library-0o7f.onrender.com/api/reservations/${reservationId}`,
          { copyId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          this.reservations = this.reservations.map((reservation) =>
            reservation.reservationid === reservationId
              ? { ...reservation, status: "cancelled" }
              : reservation
          );
          Swal.fire(
            "Бронювання скасовано",
            "Ваше бронювання було скасовано успішно!",
            "success"
          );
        } else {
          Swal.fire("Помилка", "Не вдалося скасувати бронювання", "error");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Помилка", "Не вдалося скасувати бронювання", "error");
      }
    },
    goToBookDetails(bookId) {
      this.$router.push(`/book/${bookId}`);
    },
  },

  mounted() {
    this.fetchReservations();
  },
};
</script>

<style scoped>
body {
  font-family: "Roboto", sans-serif;
}

.books-list {
  padding: 20px 0;
}

.filters {
  margin-bottom: 20px;
}

.filters select {
  padding: 8px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
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

button {
  background: #ff7e5f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin: 20px 0;
}

button:hover {
  background: #ff7e5f;
}

.book-link {
  text-decoration: none;
  color: white;
  background: #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 10px;
}

.book-link:hover {
  background: #bbb;
}

.active-status {
  border-left: 5px solid blue;
  border-top: 5px solid blue;
  border-radius: 16px;
}

.completed-status {
  border-left: 5px solid green;
  border-top: 5px solid green;
  border-radius: 16px;
}

.cancelled-status {
  border-left: 5px solid red;
  border-top: 5px solid red;
  border-radius: 16px;
}
</style>
