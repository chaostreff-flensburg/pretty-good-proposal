<script setup>
import Header from "./components/Header.vue";
</script>
<template>
  <Header />
  <div class="flex justify-content-center ">
    <main>
      <router-view></router-view>
    </main>
  </div>
  <footer>
    Das ist ein Projekt des
    <a href="https://chaostreff-flensburg.de/">Chaostreff Flensburg e.V.</a> |
    <a href="https://chaostreff-flensburg.de/impressum/">Impressum</a> &
    <a href="https://chaostreff-flensburg.de/impressum/">Datenschutz</a>
  </footer>
</template>
<style scoped>
main {
  min-height: calc(100vh - 90px);
  max-width: 1000px;
}
</style>
