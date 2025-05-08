<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.$router.back();
      }

      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case "1":
            this.$router.push("/");
            break;
          case "2":
            this.$router.push("/catalog");
            break;
          case "3":
            this.$router.push("/profile/books_shelf");
            break;
          case "a":
            this.$router.push("/about");
            break;
          case "b":
            this.$router.push("/rules");
            break;
        }
      }
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  z-index: 1;
}

#fixed-border {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 96vh;
  border-top: 20px solid #ff7e5f;
  border-left: 20px solid #ff7e5f;
  border-bottom: 20px solid white;
  border-right: 20px solid white;
  border-radius: 5px;
  pointer-events: none;
  z-index: 10;
}

.sidebar_white {
  background-color: white;
}

.container {
  display: flex;
  min-height: 97vh;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  background-color: #eeeeee;
}
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
}

*:focus {
  outline: 3px solid #ff7e5f !important;
  outline-offset: 2px;
  border-radius: 4px;
  transition: outline 0.2s ease;
  z-index: 1000;
}

.focus-visible {
  outline: 3px solid #ff7e5f !important;
  outline-offset: 2px;
  border-radius: 4px;
}

@media (max-width: 1440px) {
  #fixed-border {
    height: 96vh;
  }
}
@media (max-width: 1068px) {
  #fixed-border {
    height: 95vh;
  }
}
@media (max-width: 321px) {
  #fixed-border {
    height: 100vh;
  }
}
</style>
