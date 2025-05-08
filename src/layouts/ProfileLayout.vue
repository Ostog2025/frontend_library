<template>
  <div class="profile-layout">
    <nav class="nav">
      <router-link to="/profile/info">Профіль</router-link>

      <template v-if="!isAdmin">
        <router-link to="/profile/books_shelf">Полиця</router-link>
        <router-link to="/profile/likes">Вподобання</router-link>
        <router-link to="/profile/fines">Борги</router-link>
      </template>

      <template v-if="isAdmin">
        <router-link to="/profile/admin/users"
          >Панель адміністратора</router-link
        >
      </template>

      <button @click="logout" class="logout-button">Вийти з профілю</button>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProfileLayout",
  computed: {
    ...mapState(["isAdmin"]),
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/auth/login");
    },
  },
};
</script>

<style scoped>
.profile-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: "Roboto", sans-serif;
  background-color: white;
  color: #333;
}

.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 32px;
  background: linear-gradient(90deg, #ff7e5f 0%, #feb47b 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav a {
  color: white;
  font-weight: 500;
  text-decoration: none;
  padding: 8px 12px;
  transition: background-color 0.3s, color 0.3s;
  border-radius: 6px;
}

.nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.logout-button {
  margin-left: auto;
  background-color: white;
  color: #ff7e5f;
  border: 2px solid #ff7e5f;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #ff7e5f;
  color: white;
}

.content {
  flex-grow: 1;
  padding: 32px;
  background-color: #f9f9f9;
  border-top: 1px solid #ccc;
}
</style>
