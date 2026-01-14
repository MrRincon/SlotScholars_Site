<script setup>
import { store, computedProps } from '../classes/store.js';

const switchPages = () => {
    store.displayPages = store.displayPages === 0 ? 1 : 0;
};

const displayPage = (page) => {
    store.displayPages = page;
};
</script>

<template>
    <section id="header">
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <h1 class="navbar-brand" @click="displayPage(0)">SlotScholars</h1>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <button @click="switchPages" v-if="computedProps.cartItemsCount.value"
                                class="nav-link btn0 w-auto bg-rgb">
                                {{ computedProps.cartItemsCount.value }}
                                <span class="fas fa-cart-shopping"></span>
                                Checkout
                            </button>
                            <button disabled="disabled" class="nav-link btn0 w-auto bg-rgb" v-else>
                                <span class="fas fa-cart-shopping"></span>
                                Checkout
                            </button>
                        </li>
                    </ul>
                    <button class="nav-link btn0 w-auto bg-rgb" data-bs-toggle="modal" data-bs-target="#searchModal"
                        @click="$emit('clearSearch')">
                        Search
                        <span class="fa-solid fa-magnifying-glass"></span>
                    </button>
                </div>
            </div>
        </nav>
    </section>
</template>