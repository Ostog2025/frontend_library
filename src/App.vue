<template>
  <router-view />
</template>

<script>
export default {
  name: "App",
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
