<template>
  <div class="container-stat">
    <h1>📊 Статистика бібліотеки</h1>

    <div class="chart-grid">
      <div class="chart" v-if="popularBooksData">
        <h2>Найчастіше взяті книги</h2>
        <Bar :data="popularBooksData" :options="chartOptions" />
      </div>

      <div class="chart" v-if="activeUsersData">
        <h2>Найактивніші користувачі</h2>
        <Bar :data="activeUsersData" :options="chartOptions" />
      </div>

      <div class="chart" v-if="popularGenresData">
        <h2>Найпопулярніші жанри</h2>
        <div style="max-width: 300px; max-height: 300px; margin: 0 auto">
          <Pie :data="popularGenresData" :options="chartOptions" />
        </div>
      </div>

      <div class="chart" v-if="monthlyLoansData">
        <h2>Позики по місяцях</h2>
        <Line :data="monthlyLoansData" :options="chartOptions" />
      </div>
    </div>

    <div class="stat-block">
      <h2>📚 Середня кількість копій на одну книгу:</h2>
      <p>{{ averageCopies }}</p>
    </div>

    <div class="stat-block" v-if="booksWithFewestCopies.length">
      <h2>📉 Книги з найменшою кількістю копій</h2>
      <ul>
        <li v-for="book in booksWithFewestCopies" :key="book.title">
          {{ book.title }} – {{ book.copies }} копій
        </li>
      </ul>
    </div>

    <div class="stat-block" v-if="booksToRestock.length">
      <h2>📦 Рекомендовані до поповнення</h2>
      <ul>
        <li v-for="book in booksToRestock" :key="book.title">
          {{ book.title }} – {{ book.copies }} копій
        </li>
      </ul>
    </div>

    <div class="buttons">
      <button @click="exportCSV" class="export-btn">
        📥 Експортувати всі книги в CSV
      </button>

      <button @click="triggerFileInput" class="import-btn">
        📤 Імпортувати книги з CSV
      </button>
      <input
        type="file"
        ref="fileInput"
        @change="importCSV"
        accept=".csv"
        style="display: none"
      />
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";

import { ref, onMounted } from "vue";
import axios from "axios";
import { Bar, Pie, Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
);

const popularBooksData = ref(null);
const activeUsersData = ref(null);
const popularGenresData = ref(null);
const monthlyLoansData = ref(null);
const booksWithFewestCopies = ref([]);
const booksToRestock = ref([]);
const averageCopies = ref(null);

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
});

const BASE_URL = "https://backend-library-0o7f.onrender.com/api/statistics";

const loadData = async () => {
  try {
    const books = await axios.get(`${BASE_URL}/top-books`);
    const users = await axios.get(`${BASE_URL}/top-users`);
    const genres = await axios.get(`${BASE_URL}/top-genres`);
    const months = await axios.get(`${BASE_URL}/monthly-loans`);
    booksWithFewestCopies.value = (
      await axios.get(`${BASE_URL}/fewest-copies`)
    ).data;
    booksToRestock.value = (await axios.get(`${BASE_URL}/restock-books`)).data;
    averageCopies.value = (
      await axios.get(`${BASE_URL}/average-copies`)
    ).data.average_copies;

    console.log("Books:", books.data);
    console.log("Users:", users.data);
    console.log("Genres:", genres.data);

    popularBooksData.value = {
      labels: books.data.map((book) => book.title),
      datasets: [
        {
          label: "Книги",
          data: books.data.map((book) => book.loan_count),
          backgroundColor: "rgba(52, 152, 219, 0.6)",
        },
      ],
    };

    activeUsersData.value = {
      labels: users.data.map((user) => `${user.firstname} ${user.lastname}`),
      datasets: [
        {
          label: "Користувачі",
          data: users.data.map((user) => user.loans_count),
          backgroundColor: "rgba(46, 204, 113, 0.6)",
        },
      ],
    };

    popularGenresData.value = {
      labels: genres.data.map((genre) => genre.genre),
      datasets: [
        {
          data: genres.data.map((genre) => genre.loans_count),
          backgroundColor: ["#f1c40f", "#e74c3c", "#2ecc71", "#3498db"],
        },
      ],
    };
    monthlyLoansData.value = {
      labels: months.data.map((entry) => entry.month),
      datasets: [
        {
          label: "Кількість позик",
          data: months.data.map((entry) => entry.loans_count),
          backgroundColor: "rgba(155, 89, 182, 0.2)",
          borderColor: "rgba(155, 89, 182, 1)",
          borderWidth: 2,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

const exportCSV = async () => {
  const response = await axios.get(`${BASE_URL}/export-books`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "books.csv");
  document.body.appendChild(link);
  link.click();
};
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const importCSV = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const confirmResult = await Swal.fire({
    title: "Імпорт книги",
    text: `Ви впевнені, що хочете завантажити файл "${file.name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Так, завантажити",
    cancelButtonText: "Скасувати",
  });

  if (confirmResult.isConfirmed) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${BASE_URL}/import-books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        title: "Успіх!",
        text: "Файл успішно імпортовано!",
        icon: "success",
      });

      loadData();
    } catch (error) {
      console.error("Помилка імпорту:", error);
      await Swal.fire({
        title: "Помилка",
        text: "Не вдалося імпортувати файл.",
        icon: "error",
      });
    }
  }
};

onMounted(loadData);
</script>

<style>
.container-stat {
  padding: 30px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: auto;
}

h1 {
  font-size: 32px;
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
}

.chart {
  border: 1px solid #ddd;
  padding: 15px;
  background-color: #fdfdfd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-block {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f3f3f3;
  border-left: 4px solid #3498db;
  border-radius: 5px;
}

.stat-block ul {
  margin-top: 10px;
  padding-left: 20px;
}

.buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
}

.export-btn,
.import-btn {
  background-color: #3498db;
  color: white;
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.import-btn {
  background-color: #db8d34;
}

.export-btn:hover {
  background-color: #2980b9;
}

.import-btn:hover {
  background-color: #ac773b;
}
</style>
