<template>
  <div class="login-page">
    <div class="form-container">
      <h2>Login</h2>
      <form @submit.prevent="loginUser">
        <label>Логін:</label>
        <input v-model="username" required />

        <label>Пароль:</label>
        <input type="password" v-model="password" required />

        <button type="submit">Ввійти</button>
      </form>
      <p>{{ message }}</p>

      <button @click="goHome" class="back-home-btn">Назад на головну</button>
      <p class="register-link">
        Немає профілю?
        <router-link to="/auth/register">Зареєструйтесь</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ...mapMutations(["setAuth"]),
    async loginUser() {
      try {
        const response = await axios.post(
          "https://backend-library-0o7f.onrender.com/api/auth/login",
          {
            username: this.username,
            password: this.password,
          }
        );

        if (response.status === 200 && response.data.token) {
          const { token, isAdmin } = response.data;
          this.setAuth({ token, isAdmin });

          if (isAdmin) {
            this.$router.push("/profile/admin/users");
          } else {
            this.$router.push("/profile");
          }
        }
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || "Помилка сервера";

        if (status === 403) {
          Swal.fire({
            icon: "error",
            title: "Доступ заблоковано",
            text: "Ваш обліковий запис заблоковано. Зверніться до адміністратора.",
          });
        } else if (status === 400) {
          Swal.fire({
            icon: "warning",
            title: "Помилка входу",
            text: message,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Серверна помилка",
            text: "Спробуйте пізніше.",
          });
        }
      }
    },
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.login-page {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e5e, #ff7e5f);
}

.form-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  width: 350px;
  text-align: center;
}

h2 {
  color: #ff7e5f;
  margin-bottom: 1rem;
}

label {
  display: block;
  color: #333;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

input {
  width: 90%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

button {
  width: 50%;
  padding: 0.7rem;
  margin-top: 1.5rem;
  background-color: #ff7e5f;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #ff5e5e;
}

p {
  margin-top: 1rem;
  color: #333;
}

.back-home-btn {
  margin-top: 1rem;
  padding: 0.7rem;
  background-color: #cccccc;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-home-btn:hover {
  background-color: #b3b3b3;
}

.register-link {
  margin-top: 1rem;
  font-size: 1rem;
}

.register-link a {
  color: #ff7e5f;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
