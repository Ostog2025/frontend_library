<template>
  <div class="user-fines">
    <h2>Штрафи користувача</h2>
    <div v-if="loading" class="loading">Завантаження...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="fines.length > 0">
      <h3>Перелік штрафів:</h3>
      <ul class="fine-list">
        <li v-for="fine in fines" :key="fine.fineid">
          <span class="fine-id">#{{ fine.fineid }}</span>
          <span class="fine-amount">{{ fine.amount }} грн</span> -
          <span class="fine-status"
            >Статус: {{ translateStatus(fine.paymentstatus) }}</span
          >
        </li>
      </ul>
    </div>

    <div v-if="totalFines !== null" class="total">
      <h3>
        Загальний штраф: <span>{{ totalFines }} грн</span>
      </h3>
    </div>

    <button @click="payFines" class="pay-button">Сплатити штрафи</button>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      fines: [],
      totalFines: null,
      loading: false,
      error: null,
    };
  },
  methods: {
    translateStatus(status) {
      if (status === "paid") return "Сплачено";
      if (status === "unpaid") return "Не сплачено";
      return "Невідомо";
    },

    async fetchUserFines() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/fines",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.fines = response.data;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Не вдалося завантажити штрафи";
      } finally {
        this.loading = false;
      }
    },
    async fetchTotalFines() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/fines/total",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.totalFines = response.data.totalFines;
      } catch (err) {
        this.error =
          err.response?.data?.message || "Не вдалося отримати загальний штраф";
      }
    },
    async payFines() {
      Swal.fire({
        title: "Увага!",
        text: "Зверніться до адміністратора, щоб погасити заборгованість.",
        icon: "info",
        confirmButtonColor: "#ff7e5f",
        confirmButtonText: "Добре",
        background: "white",
        color: "#333",
        customClass: {
          popup: "swal-font",
        },
      });
    },
  },
  mounted() {
    this.fetchUserFines();
    this.fetchTotalFines();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");

.user-fines {
  font-family: "Roboto", sans-serif;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #333;
  max-width: 600px;
  margin: 0 auto;
}

h2,
h3 {
  color: #ff7e5f;
  margin-bottom: 16px;
}

.loading {
  font-size: 18px;
  color: #999;
}

.error {
  color: red;
  background: #ffe6e6;
  border: 1px solid #ffb3b3;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}

.fine-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.fine-list li {
  background: #f9f9f9;
  border: 1px solid #ccc;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.fine-id {
  font-weight: bold;
  color: #ff7e5f;
}

.fine-amount {
  font-weight: 500;
}

.fine-status {
  font-style: italic;
  color: #666;
}

.total {
  margin-top: 20px;
}

.total span {
  color: #ff7e5f;
  font-weight: bold;
}

.pay-button {
  background: #ff7e5f;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 20px;
}

.pay-button:hover {
  background: #e7654a;
}

.swal-font {
  font-family: "Roboto", sans-serif;
}
</style>
