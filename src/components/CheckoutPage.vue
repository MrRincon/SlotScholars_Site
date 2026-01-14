<script setup>
import { store, computedProps } from '../classes/store.js';
import { cartStore } from '../classes/cart.js';
import { orderStore } from '../classes/order.js';
import { api } from '../classes/servicesAPI.js';

const getFullImageUrl = (imagePath) => api.getFullImageUrl(imagePath);

const reloadPage = () => {
    window.location.reload();
};
</script>

<template>
    <div v-if="store.displayPages === 1">
        <section id="Checkout" class="form-group">
            <div class="container">
                <hr class="divider">
                <div class="row py-5">
                    <div class="col text-center">
                        <h1>Checkout Information</h1>
                        <h6 style="color: rgb(30, 150, 146);">Almost there!</h6>
                    </div>
                </div>
                <hr class="divider">
                <div class="row">
                    <div class="col text-center">
                        <h6 style="color: rgb(30, 150, 146);">Items in the cart</h6>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-2 text-center" v-for="item in computedProps.itemsInCart.value" :key="item.id">
                        <div class="card border-0 bg-rgb mb-2 curvyR cardText text-white">
                            <div class="card-body">
                                <img :src="getFullImageUrl(item.img.location)" class="img-fluid hw-100px curvyR"
                                    :alt="item.img.alt">
                                <p>{{ item.subject }}</p>
                                <p>£{{ item.price }}</p>
                                <p>{{ item.location }}</p>
                                <p>{{ item.amount }}</p>
                                <button class="bg-dark btn0" @click="cartStore.removeItem(item.id)">
                                    <span class="fa-solid fa-trash"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <hr class="divider">
                <div class="row">
                    <div class="col-lg-7">
                        <div class="row">
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">FIRST NAME:</strong>
                                <input v-model.trim="store.order.firstName" class="form-control" />
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">LAST NAME</strong>
                                <input v-model.trim="store.order.lastName" class="form-control" />
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">PHONE NUMBER</strong>
                                <input v-model.number="store.order.phoneNumber" type="number" class="form-control" />
                            </div>
                        </div>
                        <hr class="divider">
                        <div class="row">
                            <div class="col-lg-4">
                                <p>
                                    <input type="radio" id="home" value="Home" v-model="store.order.method">
                                    <strong for="home" style="color: rgb(30, 150, 146);">HOME</strong>
                                    <strong> / </strong>
                                    <input type="radio" id="business" value="Business" v-model="store.order.method">
                                    <strong for="business" style="color: rgb(30, 150, 146);">BUSINESS</strong>
                                </p>
                                <p>
                                    <strong style="color: rgb(30, 150, 146);">SHIP AS GIFT?</strong>
                                    <input type="checkbox" id="gift" v-model="store.order.gift.value"
                                        :true-value="store.order.gift.options.isGift"
                                        :false-value="store.order.gift.options.isNotGift" />
                                </p>
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">ADDRESS:</strong>
                                <input v-model.trim="store.order.address" class="form-control" />
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">CITY:</strong>
                                <input v-model.trim="store.order.city" class="form-control" />
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">STATE:</strong>
                                <select v-model="store.order.states.state" class="form-control">
                                    <option disabled value="">----</option>
                                    <option v-for="state in store.order.states.options" :key="state" :value="state">
                                        {{ state }}
                                    </option>
                                </select>
                            </div>
                            <div class="col-lg-4">
                                <strong style="color: rgb(30, 150, 146);">ZIP/POST CODE:</strong>
                                <input v-model.number="store.order.zip" type="number" class="form-control" />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <h2 class="text-center"><strong>Order Information</strong></h2>
                        <p><strong>First Name:</strong> {{ store.order.firstName }}</p>
                        <p><strong>Last Name:</strong> {{ store.order.lastName }}</p>
                        <p><strong>Phone Number:</strong> {{ store.order.phoneNumber }}</p>
                        <p><strong>Address:</strong> {{ store.order.address }}</p>
                        <p><strong>City:</strong> {{ store.order.city }}</p>
                        <p><strong>Zip:</strong> {{ store.order.zip }}</p>
                        <p><strong>State:</strong> {{ store.order.states.state }}</p>
                        <p><strong>Method:</strong> {{ store.order.method }}</p>
                        <p><strong>Gift:</strong> {{ store.order.gift.value }}</p>
                    </div>
                </div>
                <hr class="divider">
                <div class="row py-2 text-center">
                    <button @click="orderStore.sendOrder" class="nav-link btn0 w-auto bg-rgb m-auto"
                        v-if="computedProps.allowedToSubmit.value" data-bs-toggle="modal"
                        data-bs-target="#notificationModal">
                        Place Order
                        <span class="fas fa-cart-shopping"></span>
                    </button>
                    <button disabled="disabled" class="nav-link btn0 w-auto bg-light m-auto" v-else>
                        Place Order
                        <span class="fas fa-cart-shopping"></span>
                    </button>
                    <div id="feedback" class="text-center py-2">
                        <p style="color: red;"><strong>{{ store.feedback }}</strong></p>
                    </div>
                </div>
            </div>

            <!-- Notification Modal -->
            <div class="modal fade" id="notificationModal" tabindex="-1" aria-labelledby="notificationModalLabel"
                aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="notificationModalLabel">Congratulations!</h5>
                        </div>
                        <div class="modal-body text-center">
                            <p id="modal-result"></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn0 bg-rgb" @click="reloadPage" data-bs-dismiss="modal">
                                Back to the store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer section -->
        <section id="footer" class="py-5 bg-black">
            <div class="container py-5">
                <div class="row">
                    <div class="col-lg-9 m-auto text-center">
                        <h1>Thanks for shopping with us!</h1>
                    </div>
                </div>
                <div class="row pt-5">
                    <div class="col-lg-11 m-auto">
                        <div class="row">
                            <div class="col-lg-4 py-3 text-center">
                                <strong class="pb-3">CUSTOMER CARE</strong>
                                <p>Complaints</p>
                            </div>
                            <div class="col-lg-4 py-3 text-center">
                                <strong class="pb-3">ABOUT US</strong>
                                <p>Contact us</p>
                            </div>
                            <div class="col-lg-4 py-3 text-center">
                                <strong class="pb-3">SOCIAL MEDIA</strong>
                                <p style="margin: 5px 0;">Twitter <span class="fab fa-twitter"></span></p>
                                <p style="margin: 5px 0;">Facebook <span class="fab fa-facebook"></span></p>
                                <p style="margin: 5px 0;">Instagram <span class="fab fa-instagram"></span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>