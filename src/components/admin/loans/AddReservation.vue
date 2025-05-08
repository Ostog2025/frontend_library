<template>
  <div>
    <button @click="showPopup = true" class="btn btn-primary">
      Додати бронювання
    </button>

    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-form">
        <h3>Створити бронювання</h3>

        <label>Користувач</label>
        <select v-model="selectedUser">
          <option disabled value="">Оберіть користувача</option>
          <option v-for="user in users" :key="user.userid" :value="user.userid">
            {{ user.username }}
          </option>
        </select>

        <label>Книга</label>
        <select v-model="selectedBook">
          <option disabled value="">Оберіть книгу</option>
          <option v-for="book in books" :key="book.bookid" :value="book.bookid">
            {{ book.book_title }}, {{ book.genre_name }}
          </option>
        </select>

        <label>Дата повернення</label>
        <input type="date" v-model="dueDate" />

        <div class="popup-buttons">
          <button @click="createReservation">Підтвердити</button>
          <button @click="showPopup = false" type="button">Скасувати</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showPopup: false,
      users: [],
      books: [],
      selectedUser: "",
      selectedBook: "",
      dueDate: "",
    };
  },
  methods: {
    async fetchUsersAndBooks() {
      const userRes = await axios.get(
        "https://backend-library-0o7f.onrender.com/api/user/get-users"
      );
      const bookRes = await axios.get(
        "https://backend-library-0o7f.onrender.com/api/books"
      );
      this.users = userRes.data;
      this.books = bookRes.data;
    },
    async createReservation() {
      if (!this.selectedUser || !this.selectedBook || !this.dueDate) {
        alert("Заповніть усі поля");
        return;
      }

      try {
        await axios.post(
          "https://backend-library-0o7f.onrender.com/api/loans/reservations",
          {
            userId: this.selectedUser,
            bookId: this.selectedBook,
            dueDate: this.dueDate,
          }
        );
        alert("Бронювання створено!");
        this.showPopup = false;
      } catch (err) {
        alert("Помилка при створенні бронювання");
        console.error(err);
      }
    },
  },
  mounted() {
    this.fetchUsersAndBooks();
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  margin: 5px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #ff7e5f;
  color: white;
  margin: 20px;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #e5674f;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-form {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  color: black;
}

.popup-form h3 {
  font-size: 20px;
  margin-bottom: 16px;
  text-align: center;
}

.popup-form label {
  margin: 10px 0 4px;
  font-weight: 500;
}

.popup-form select,
.popup-form input[type="date"] {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-bottom: 12px;
  width: 100%;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.popup-buttons button {
  flex: 1;
  margin: 5px;
}

.popup-buttons button:first-child {
  background-color: #28a745;
  color: white;
}

.popup-buttons button:first-child:hover {
  background-color: #218838;
}

.popup-buttons button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.popup-buttons button[type="button"]:hover {
  background-color: #5a6268;
}
</style>
