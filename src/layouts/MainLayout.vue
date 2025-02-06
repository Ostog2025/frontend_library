<template>
  <div id="main-layout">
    <div id="fixed-border"></div>
    <div class="container">
      <div class="sidebar_white">
        <SidebarLibrary />
      </div>
      <div class="main-content">
        <HeaderLibrary />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import SidebarLibrary from "@/components/SidebarLibrary.vue";
import HeaderLibrary from "@/components/HeaderLibrary.vue";

export default {
  components: {
    SidebarLibrary,
    HeaderLibrary,
  },
};
</script>

<style></style>
