<script setup>
import { store, computedProps } from '../classes/store.js';
import { cartStore } from '../classes/cart.js';
import { searchStore } from '../classes/search.js';
import { api } from '../classes/servicesAPI.js';
import { onMounted, ref } from 'vue';

const searchQuery = ref('');

onMounted(async () => {
    if (store.lessons.length === 0) {
        store.lessons = await api.fetchLessons();
    }
});

const getFullImageUrl = (imagePath) => api.getFullImageUrl(imagePath);
const canAddToCart = (lesson) => lesson.available > cartCount(lesson.id);
const itemsLeft = (lesson) => lesson.available - cartCount(lesson.id);
const cartCount = (id) => {
    let count = 0;
    for (let itemIndex = 0; itemIndex < store.cart.length; itemIndex++) {
        if (store.cart[itemIndex] === id) {
            count++;
        }
    }
    return count;
};

const addToCart = (lesson) => cartStore.addToCart(lesson);

const performSearch = async () => {
    await searchStore.searchBarQuery(searchQuery.value);
};

const clearSearchInput = () => {
    searchQuery.value = '';
    searchStore.clearSearch();
};
</script>

<template>
    <div v-if="store.displayPages === 0">
        <!-- Search bar modal -->
        <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true"
            data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="d-flex align-items-center search-container col-md-6" role="search">
                            <input id="searchInput" v-model="searchQuery" @keyup="performSearch"
                                class="px-2 search w-100" type="search" placeholder="Search" aria-label="Search">
                        </div>
                        <button type="button" class="btn0 bg-rgb col-md-2" data-bs-dismiss="modal"
                            @click="clearSearchInput">
                            <span class="fa-solid fa-xmark"></span>
                        </button>
                    </div>
                    <div id="searchModal-body" class="text-center custom-scroll"></div>
                </div>
            </div>
        </div>

        <!-- Main section -->
        <section id="main">
            <hr class="divider">
            <div class="container py-5">
                <div class="row py-4">
                    <div class="col-lg-7 pt-5 text-center">
                        <h1 class="pt-5">Pick your lectures, Pick SlotScholars!</h1>
                    </div>
                </div>
            </div>
        </section>

        <!-- Location section -->
        <section id="locations" class="bg-black">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-10 col-12 m-auto">
                        <div class="row text-center">
                            <div class="col-lg-4 col-md-6 col-12 my-1"
                                v-for="location in computedProps.lessonsSortedLocations.value">
                                <h3 class="locationText">{{ location }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Trending section -->
        <section id="trending" class="bg-rgb">
            <div class="container py-3">
                <div class="row m-auto text-center">
                    <div class="col-lg-5 m-auto">
                        <h1 class="text-white">Trending Lessons</h1>
                        <h6 class="text-white">Increase your knowledge</h6>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 text-center" v-for="trend in computedProps.trendingLessons.value"
                        :key="trend.id">
                        <div class="card border-0 bg-light mb-2 curvyR cardText">
                            <div class="card-body">
                                <img :src="getFullImageUrl(trend.img.location)" class="img-fluid hw-100px curvyR bg-rgb"
                                    :alt="trend.img.alt">
                                <p>{{ trend.subject }}</p>
                                <p>£{{ trend.price }}</p>
                                <p>{{ itemsLeft(trend) }} Spaces Available</p>
                                <p>{{ trend.location }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Store section -->
        <section id="store">
            <div class="container">
                <div class="row py-5">
                    <div class="col-lg-8 m-auto text-center">
                        <h1>Nurture Your Brain</h1>
                        <h6 style="color: rgb(30, 150, 146);">Shop Some Lessons</h6>
                    </div>
                    <div class="col-lg-8 m-auto text-center py-5">
                        <h6>Sort your search by:</h6>
                        <div class="row">
                            <div class="col-lg-10 text-center">
                                <select v-model="store.sort.by" class="btn0 text-center"
                                    style="background-color: rgb(30, 150, 146);">
                                    <option disabled value="">----</option>
                                    <option v-for="option in store.sort.options" :key="option" :value="option">
                                        {{ option }}
                                    </option>
                                </select>
                                <input type="radio" id="ascending" value="Ascending" v-model="store.sort.order">
                                <label for="ascending">Ascending</label>
                                <input type="radio" id="descending" value="Descending" v-model="store.sort.order">
                                <label for="descending">Descending</label>
                            </div>
                        </div>
                        <hr class="divider">
                    </div>
                    <div class="row">
                        <div class="col-lg-3 text-center" v-for="lesson in computedProps.sortedLessons.value"
                            :key="lesson.id">
                            <div class="card border-0 bg-rgb mb-2 curvyR cardText text-white">
                                <div class="card-body">
                                    <img :src="getFullImageUrl(lesson.img.location)" class="img-fluid hw-100px curvyR"
                                        :alt="lesson.img.alt">
                                    <p>{{ lesson.subject }}</p>
                                    <p>£{{ lesson.price }}</p>
                                    <p>{{ itemsLeft(lesson) }} Spaces Available</p>
                                    <p>{{ lesson.location }}</p>
                                    <button class="bg-dark btn0" @click="addToCart(lesson)" v-if="canAddToCart(lesson)">
                                        Add to cart
                                    </button>
                                    <button class="btn0" disabled="disabled" v-else>Unavailable</button>
                                    <span v-if="itemsLeft(lesson) === 0">No spaces left!</span>
                                    <span v-else-if="itemsLeft(lesson) < 5"> Few spaces left!</span>
                                    <span v-else>Buy now!</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>