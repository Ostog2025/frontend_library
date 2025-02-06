<template>
  <div id="custom-layout">
    <div class="custom-sidebar">
      <CustomSidebar />
    </div>
    <div class="custom-header">
      <CustomHeader />
    </div>
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import CustomSidebar from "@/components/CustomSidebar.vue";
import CustomHeader from "@/components/CustomHeader.vue";

export default {
  components: {
    CustomSidebar,
    CustomHeader,
  },
};
</script>

<style></style>
