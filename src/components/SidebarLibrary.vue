<template>
  <div :class="['gap', { collapsed }]">
    <div
      :class="['sidebar', { collapsed, mobileOpen: isMobile && !collapsed }]"
      role="navigation"
      aria-label="Бічне меню"
    >
      <button
        class="toggle-button"
        @click="toggleSidebar"
        aria-label="Перемкнути бічне меню"
        @keydown.enter.prevent="toggleSidebar"
      >
        <i :class="collapsed ? 'fas fa-arrow-right' : 'fas fa-arrow-left'"></i>
      </button>

      <h1 class="site-title" v-if="!collapsed">REREAD</h1>

      <nav class="main-links">
        <ul>
          <li v-for="(item, index) in mainLinks" :key="index">
            <a
              href="#"
              :aria-label="item.label"
              role="link"
              tabindex="0"
              @click.prevent="navigateTo(item.route)"
              @keydown.enter.prevent="navigateTo(item.route)"
            >
              <i :class="item.icon"></i>
              <span v-if="!collapsed">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <nav class="footer-links" v-if="!collapsed">
        <ul>
          <li v-for="(item, index) in footerLinks" :key="index">
            <a
              href="#"
              :aria-label="item.label"
              tabindex="0"
              @click.prevent="navigateTo(item.route)"
              @keydown.enter.prevent="navigateTo(item.route)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <div
      v-if="isMobile && !collapsed"
      class="overlay"
      @click="toggleSidebar"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SidebarLibrary",
  computed: {
    ...mapState(["isAuthenticated"]),
  },
  data() {
    return {
      collapsed: false,
      isMobile: false,
      mainLinks: [
        { label: "Головна", icon: "fas fa-home", route: "/" },
        { label: "Каталоги", icon: "fas fa-book", route: "/catalog" },
        {
          label: "Моя полиця",
          icon: "fas fa-layer-group",
          route: "/profile/books_shelf",
        },
      ],
      footerLinks: [
        { label: "Про нас", route: "/about" },
        { label: "Правила", route: "/rules" },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.collapsed = !this.collapsed;
    },
    handleResize() {
      this.isMobile = window.innerWidth < 770;
      this.collapsed = this.isMobile;
    },
    navigateTo(route) {
      if (!this.isAuthenticated && route === "/profile/books_shelf") {
        this.$router.push("/auth/login");
      } else {
        this.$router.push(route);
      }
    },
    handleGlobalKeys(e) {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        this.toggleSidebar();
      }
    },
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleGlobalKeys);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleGlobalKeys);
  },
};
</script>

<style scoped>
.gap {
  margin-right: 200px;
  transition: margin-right 0.3s ease;
}

.gap.collapsed {
  margin-right: 60px;
}

.sidebar {
  position: fixed;
  height: 99vh;
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20px;
  transition: width 0.3s ease;
  z-index: 2;
}

.sidebar.collapsed {
  width: 60px;
}

.site-title {
  font-size: 24px;
  font-weight: bold;
  transition: opacity 0.3s ease;
  opacity: 1;
}

.sidebar.collapsed .site-title {
  opacity: 0;
}

.main-links ul,
.footer-links ul {
  list-style-type: none;
  padding: 0;
}

.main-links li,
.footer-links li {
  margin: 10px 0;
}

.main-links a,
.footer-links a {
  text-decoration: none;
  color: #000;
  display: flex;
  align-items: center;
}

.main-links a i,
.footer-links a i {
  margin-right: 10px;
}

.sidebar.collapsed .main-links a span,
.sidebar.collapsed .footer-links a span {
  display: none;
}

.toggle-button {
  position: absolute;
  top: 20px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.toggle-button i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .gap {
    margin-right: 0;
  }
  .sidebar {
    width: 60px;
  }
  .sidebar:not(.collapsed) {
    width: 200px;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
    pointer-events: all;
  }
}
</style>
