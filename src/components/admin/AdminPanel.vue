<template>
  <div class="admin-panel">
    <div class="admin-nav">
      <router-link to="/profile/admin/users" class="nav-link"
        >Користувачі</router-link
      >
      <router-link to="/profile/admin/books" class="nav-link"
        >Книги</router-link
      >
      <router-link to="/profile/admin/reservation" class="nav-link"
        >Резервування</router-link
      >
      <router-link to="/profile/admin/statistics" class="nav-link"
        >Статистика</router-link
      >
    </div>

    <div class="admin-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminPanel",
};
</script>

<style scoped>
.admin-panel {
  display: flex;
  flex-direction: column;
}

.admin-nav {
  display: flex;
  justify-content: space-around;
  background-color: #f4f4f4;
  padding: 10px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.nav-link:hover {
  color: #007bff;
}

.admin-content {
  padding: 20px;
}

</style>
