<template>
  <div class="register-page">
    <div class="form-container">
      <h2>Register</h2>
      <form @submit.prevent="registerUser">
        <label>Username:</label>
        <input v-model="form.username" required />

        <label>Password:</label>
        <input type="password" v-model="form.password" required />

        <label>Email:</label>
        <input type="email" v-model="form.email" required />

        <label>First Name:</label>
        <input v-model="form.firstName" required />

        <label>Last Name:</label>
        <input v-model="form.lastName" required />

        <label>Phone:</label>
        <input v-model="form.phone" required />

        <button type="submit">Register</button>
      </form>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      },
      message: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post(
          "https://backend-library-0o7f.onrender.com/register",
          this.form
        );
        this.message = response.data.message;
      } catch (error) {
        console.error("Error:", error);
        this.message = "Server error.";
      }
    },
  },
};
</script>

<style scoped>
.register-page {
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
</style>
