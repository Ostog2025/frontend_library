<template>
  <div class="header">
    <SearchBooks />
    <div class="account">
      <template v-if="isAuthenticated">
        <div class="auth-links">
          <router-link to="/profile"> Профіль </router-link>
        </div>
      </template>
      <template v-else>
        <div class="auth-links">
          <router-link to="/auth/login">Login</router-link>
          <router-link to="/auth/register">Register</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import SearchBooks from "./SearchBooks.vue";
import { mapState } from "vuex";

export default {
  name: "HeaderLibrary",
  components: {
    SearchBooks,
  },
  computed: {
    ...mapState(["isAuthenticated"]),
  },
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 20px;
  left: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  background-color: #eeeeee;
}

.search {
  width: 200px;
  padding: 10px;
}

.account {
  display: flex;
  align-items: center;
}

.auth-links {
  display: flex;
  gap: 10px;
}

.auth-links a {
  text-decoration: none;
  color: #003366;
  font-weight: bold;
  transition: color 0.3s;
}

.auth-links a:hover {
  color: #0056b3;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

@media (max-width: 568px) {
  .header {
    flex-direction: column-reverse;
    align-items: center;
    gap: 20px;
    padding: 10px;
  }

  .search {
    width: 100%;
    margin-bottom: 10px;
    text-align: center;
  }

  .account {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .account a {
    margin-top: 5px;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }
}
</style>
