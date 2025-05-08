<template>
  <div class="profile">
    <h1>Профіль</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="username">Логін:</label>
        <input
          v-model="user.username"
          type="text"
          id="username"
          disabled
          placeholder="Логін (не можна змінити)"
        />
      </div>
      <div class="form-group">
        <label for="firstname">Ім'я:</label>
        <input
          v-model="user.firstname"
          type="text"
          id="firstname"
          placeholder="Введіть ім'я"
        />
      </div>
      <div class="form-group">
        <label for="lastname">Прізвище:</label>
        <input
          v-model="user.lastname"
          type="text"
          id="lastname"
          placeholder="Введіть прізвище"
        />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          v-model="user.email"
          type="email"
          id="email"
          disabled
          placeholder="Email (не можна змінити)"
        />
      </div>
      <div class="form-group">
        <label for="phone">Телефон:</label>
        <input
          v-model="user.phone"
          type="text"
          id="phone"
          placeholder="Введіть телефон"
        />
      </div>
      <div class="form-group">
        <label for="registrationDate">Дата реєстрації:</label>
        <input
          v-model="user.registrationDate"
          type="text"
          id="registrationDate"
          disabled
          placeholder="Дата реєстрації"
        />
      </div>
      <button type="submit">Оновити профіль</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      user: {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        registrationDate: "",
      },
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://backend-library-0o7f.onrender.com/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error("Помилка при отриманні профілю", error);
      }
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          "https://backend-library-0o7f.onrender.com/api/user/update-profile",
          this.user,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        Swal.fire({
          icon: "success",
          title: "Профіль оновлено",
          text: "Ваші дані було успішно збережено",
          confirmButtonColor: "#ff7e5f",
        });
      } catch (error) {
        console.error("Помилка при оновленні профілю", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося оновити профіль",
          confirmButtonColor: "#ff7e5f",
        });
      }
    },
  },
};
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 40px auto;
  padding: 32px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-family: "Roboto", sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
  color: #ff7e5f;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #444;
}

input {
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #ff7e5f;
  outline: none;
}

input[disabled] {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

button {
  align-self: flex-end;
  padding: 12px 24px;
  background-color: #ff7e5f;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e5674b;
}
</style>
