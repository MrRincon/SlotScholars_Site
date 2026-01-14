import { store } from './store.js';
import { api } from './servicesAPI.js';
import { cartStore } from './cart.js';

export const orderStore = {
  async sendOrder() {
    const modalContent = document.getElementById('modal-result');
    
    const newOrder = JSON.stringify({
      id: store.order.id,
      firstName: store.order.firstName,
      lastName: store.order.lastName,
      phoneNumber: store.order.phoneNumber,
      address: store.order.address,
      city: store.order.city,
      zip: store.order.zip,
      state: store.order.states.state,
      method: store.order.method,
      gift: store.order.gift.value,
      purchasedLessonsID: store.cart
    });

    const postResult = await api.placeOrder(JSON.parse(newOrder));
    
    if (postResult.success) {
      store.order.id = postResult.order.id;
      let orderValue = postResult.order.id;
      modalContent.innerHTML = `Your order has been placed. this is your order id = <strong>${orderValue}</strong>`;
      
      const putResult = await api.updateLessons(JSON.parse(newOrder));
      if (putResult.success) {
        this.restoreCheckout();
      }
    }
  },

  restoreCheckout() {
    cartStore.clearCart();
    store.order.id = '';
    store.order.firstName = '';
    store.order.lastName = '';
    store.order.phoneNumber = '';
    store.order.address = '';
    store.order.city = '';
    store.order.zip = '';
    store.order.states.state = '';
    store.order.method = 'Home';
    store.order.gift.value = 'Do not send as gift';
  }
};