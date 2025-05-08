<template>
  <div class="admin-panel">
    <h2>Управління користувачами</h2>

    <table>
      <thead>
        <tr>
          <th>Ім'я користувача</th>
          <th>Електронна пошта</th>
          <th>Ім'я</th>
          <th>Прізвище</th>
          <th>Телефон</th>
          <th>Статус</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.userid">
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.firstname }}</td>
          <td>{{ user.lastname }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ user.isblocked ? "Заблоковано" : "Активний" }}</td>
          <td>
            <button @click="editUser(user)">Редагувати</button>
            <button @click="deleteUser(user.userid)">Видалити</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="addUser">Додати користувача</button>

    <div v-if="editingUser" class="popup-overlay" @click.self="cancelEdit">
      <div class="popup-form">
        <h3>
          {{
            isEditing ? "Редагувати користувача" : "Додати нового користувача"
          }}
        </h3>
        <form @submit.prevent="saveUser">
          <label>Ім'я користувача:</label>
          <input v-model="userForm.username" required />

          <label v-if="!isEditing">Пароль:</label>
          <input
            type="password"
            v-model="userForm.password"
            :disabled="isEditing"
            required
            v-if="!isEditing"
          />

          <label>Електронна пошта:</label>
          <input v-model="userForm.email" required />

          <label>Ім'я:</label>
          <input v-model="userForm.firstname" required />

          <label>Прізвище:</label>
          <input v-model="userForm.lastname" required />

          <label>Телефон:</label>
          <input v-model="userForm.phone" required />

          <label>Статус блокування:</label>
          <input type="checkbox" v-model="userForm.isblocked" />

          <label>Адмін:</label>
          <input type="checkbox" v-model="userForm.isadmin" />

          <button type="submit">
            {{ isEditing ? "Зберегти" : "Створити" }}
          </button>
          <button type="button" @click="cancelEdit">Скасувати</button>
        </form>
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
      users: [],
      userForm: {
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
        isblocked: false,
        isadmin: false,
      },
      originalUser: null,
      editingUser: false,
      isEditing: false,
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(
          "https://backend-library-0o7f.onrender.com/api/user/get-users"
        );
        this.users = response.data;
        console.log(this.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося отримати список користувачів.",
        });
      }
    },
    async deleteUser(userId) {
      try {
        const response = await axios.delete(
          "https://backend-library-0o7f.onrender.com/api/user/delete-user",
          {
            data: { userId },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Користувача видалено",
          text: response.data.message,
        });
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося видалити користувача.",
        });
      }
    },
    async saveUser() {
      if (this.isEditing) {
        await this.updateUser();
      } else {
        await this.addNewUser();
      }
    },
    async updateUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося знайти токен авторизації.",
        });
        return;
      }

      const updatedFields = {};
      Object.keys(this.userForm).forEach((key) => {
        if (this.userForm[key] !== this.originalUser[key]) {
          updatedFields[key] = this.userForm[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        Swal.fire({
          icon: "info",
          title: "Без змін",
          text: "Жодні дані не були змінені.",
        });
        return;
      }

      updatedFields.userId = this.userForm.userid;

      try {
        const response = await axios.put(
          "https://backend-library-0o7f.onrender.com/api/user/admin-update-user",
          updatedFields,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Користувача оновлено",
          text: response.data.message,
        });
        this.fetchUsers();
        this.cancelEdit();
      } catch (error) {
        console.error("Error updating user:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text:
            error?.response?.data?.message || "Не вдалося оновити користувача.",
        });
      }
    },
    async addNewUser() {
      try {
        const response = await axios.post(
          "https://backend-library-0o7f.onrender.com/api/auth/register",
          this.userForm
        );
        Swal.fire({
          icon: "success",
          title: "Користувача додано",
          text: response.data.message,
        });
        this.fetchUsers();
        this.cancelEdit();
      } catch (error) {
        console.error("Error adding user:", error);
        Swal.fire({
          icon: "error",
          title: "Помилка",
          text: "Не вдалося додати користувача.",
        });
      }
    },
    cancelEdit() {
      this.userForm = {
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        phone: "",
        isblocked: false,
        isadmin: false,
      };
      this.editingUser = false;
      this.isEditing = false;
    },
    editUser(user) {
      this.userForm = { ...user, userid: user.userid };
      console.log(this.userForm);
      this.originalUser = { ...user };
      this.editingUser = true;
      this.isEditing = true;
    },
    addUser() {
      this.cancelEdit();
      this.editingUser = true;
      this.isEditing = false;
    },
  },
  mounted() {
    this.fetchUsers();
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
  color: black;

  border-radius: 8px;
  width: 400px;
  height: 600px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
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

.popup-form input {
  margin-bottom: 10px;
  padding: 8px;
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
