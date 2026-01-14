import { store } from './store.js';

export const cartStore = {
  addToCart(lesson) {
    store.cart.push(lesson.id);
  },

  removeItem(id) {
    let spotCount = 0;
    for (let item of store.cart) {
      if (item === id) {
        store.cart.splice(spotCount, 1);
        break;
      }
      spotCount++;
    }
  },

  clearCart() {
    store.cart = [];
  }
};