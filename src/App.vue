<script setup>
import NavBar from './components/NavBar.vue';
import HomePage from './components/HomePage.vue';
import CheckoutPage from './components/CheckoutPage.vue';
import { store } from './classes/store.js';
</script>

<template>
  <div id="App">
    <NavBar />

    <!-- Shop page -->
    <HomePage v-if="store.displayPages === 0" />

    <!-- Checkout page -->
    <CheckoutPage v-if="store.displayPages === 1" />
  </div>
</template>