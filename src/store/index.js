import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: !!localStorage.getItem("token"),
    token: localStorage.getItem("token"),
    isAdmin: localStorage.getItem("isAdmin") === "true",
  },
  mutations: {
    setAuth(state, { token, isAdmin }) {
      state.isAuthenticated = true;
      state.token = token;
      state.isAdmin = isAdmin;
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.isAdmin = false;
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
    },
  },
});
