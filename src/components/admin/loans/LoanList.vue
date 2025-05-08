<template>
  <div class="admin-panel">
    <h2>Активні позики</h2>
    <table>
      <thead>
        <tr>
          <th>Користувач</th>
          <th>Назва книги</th>
          <th>Дата видачі</th>
          <th>Термін повернення</th>
          <th>Статус</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loan in loans" :key="loan.reservationid">
          <td>{{ loan.lastname }}</td>
          <td>{{ loan.book_title }}</td>
          <td>{{ formatDate(loan.loandate) }}</td>
          <td>{{ formatDate(loan.duedate) }}</td>
          <td>{{ loan.status }}</td>
          <td>
            <button
              @click="openStatusModal(loan.reservationid, loan.status)"
              title="Оновити статус"
            >
              📝
            </button>
            <button
              @click="cancelReservation(loan.reservationid, loan.copyid)"
              title="Скасувати"
            >
              ❌
            </button>
            <button
              @click="deleteReservation(loan.reservationid)"
              title="Видалити"
            >
              🗑️
            </button>
            <button
              @click="
                sendReminder(
                  loan.reservationid,
                  loan.email,
                  loan.book_title,
                  loan.duedate
                )
              "
              title="Нагадування"
            >
              ✉️
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="popup-overlay" @click.self="closeModal">
      <div class="popup-form">
        <h3>Оновити статус бронювання</h3>
        <form @submit.prevent="confirmStatusUpdate">
          <label for="status">Новий статус:</label>
          <select v-model="newStatus" id="status">
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <div
            style="
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
            "
          >
            <button type="submit">Підтвердити</button>
            <button type="button" @click="closeModal">Скасувати</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loans: [],
      showModal: false,
      selectedReservationId: null,
      newStatus: "active",
      message: "",
    };
  },
  async created() {
    await this.refreshLoans();
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("uk-UA", options);
    },

    openStatusModal(reservationid, currentStatus) {
      this.selectedReservationId = reservationid;
      this.newStatus = currentStatus;
      this.showModal = true;
    },

    async confirmStatusUpdate() {
      try {
        await axios.put(
          "https://backend-library-0o7f.onrender.com/api/reservations/status",
          {
            reservationid: this.selectedReservationId,
            status: this.newStatus,
          }
        );
        this.closeModal();
        await this.refreshLoans();
      } catch (error) {
        console.error("Помилка при оновленні статусу", error);
      }
    },

    closeModal() {
      this.showModal = false;
      this.selectedReservationId = null;
      this.newStatus = "active";
    },

    async cancelReservation(reservationid, copyId) {
      try {
        await axios.patch(
          `https://backend-library-0o7f.onrender.com/api/reservations/${reservationid}`,
          { copyId }
        );
        await this.refreshLoans();
      } catch (error) {
        console.error("Помилка при скасуванні позики", error);
      }
    },

    async deleteReservation(reservationid) {
      try {
        const confirmation = confirm(
          "Ви впевнені, що хочете видалити цю позику?"
        );
        if (confirmation) {
          await axios.delete(
            `https://backend-library-0o7f.onrender.com/api/reservations/${reservationid}`
          );
          await this.refreshLoans();
        }
      } catch (error) {
        console.error("Помилка при видаленні позики", error);
      }
    },

    async sendReminder(reservationid, email, book_title, duedate) {
      try {
        const response = await axios.post(
          `https://backend-library-0o7f.onrender.com/api/loans/remind`,
          {
            reservationid,
            email,
            book_title,
            duedate,
          }
        );
        this.message = response.data;
        console.log("Нагадування надіслано:", this.message);
      } catch (error) {
        console.error("Помилка при надсиланні нагадування:", error);
        this.message = "Помилка при надсиланні нагадувань.";
      }
    },

    async refreshLoans() {
      try {
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/loans/active"
        );
        this.loans = response.data;
      } catch (error) {
        console.error("Помилка при оновленні даних про позики", error);
      }
    },
  },
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: white;
  font-size: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table,
th,
td {
  border: 1px solid #ddd;
}

th,
td {
  padding: 12px;
  text-align: left;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  margin: 5px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ff7e5f;
  color: white;
}

button:active {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
}

.popup-form {
  background: #fff;
  padding: 20px;
  margin-top: 40px;
  border-radius: 8px;
  width: 400px;
  height: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  color: black;
}

.popup-form h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.popup-form form {
  display: flex;
  flex-direction: column;
}

.popup-form label {
  margin: 10px 0 5px;
  font-size: 14px;
}

.popup-form select {
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.popup-form button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.popup-form button[type="button"] {
  background-color: #ccc;
}

.popup-form button[type="submit"]:hover {
  background-color: #0056b3;
}

.popup-form button[type="button"]:hover {
  background-color: #999;
}
</style>
