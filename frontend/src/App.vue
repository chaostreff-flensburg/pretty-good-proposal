<template>
  <router-view :key="$route.fullPath"></router-view>
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
