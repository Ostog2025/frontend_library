<template>
  <div class="admin-panel">
    <h2>Історія позик</h2>
    <table>
      <thead>
        <tr>
          <th>Користувач</th>
          <th>Назва книги</th>
          <th>Дата видачі</th>
          <th>Дата повернення</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loan in loans" :key="loan.loanid">
          <td>{{ loan.lastname }}</td>
          <td>{{ loan.book_title }}</td>
          <td>{{ formatDate(loan.loandate) }}</td>
          <td>{{ formatDate(loan.returndate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loans: [],
    };
  },
  async created() {
    try {
      const response = await axios.get(
        "https://backend-library-0o7f.onrender.com/api/loans/history"
      );
      this.loans = response.data;
    } catch (error) {
      console.error("Помилка при завантаженні історії позик:", error);
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("uk-UA", options);
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
</style>
