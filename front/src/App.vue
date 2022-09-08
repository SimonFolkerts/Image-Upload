<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Upload Image</RouterLink>
      <RouterLink to="/about">View Images</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 3rem;
}

.router-link-active {
  font-weight: bold;
}
</style>
