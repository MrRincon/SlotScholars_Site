const SERVER_URL = "https://slotscholars-server.onrender.com/";

export const api = {
  async fetchLessons() {
    try {
      const response = await fetch(`${SERVER_URL}lessons`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  },

  async placeOrder(orderData) {
    try {
      const response = await fetch(`${SERVER_URL}placeOrder`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      return { success: false };
    }
  },

  async updateLessons(orderData) {
    try {
      const response = await fetch(`${SERVER_URL}updateLessons`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating lessons:', error);
      return { success: false };
    }
  },

  async searchLessons(searchTerm) {
    try {
      const response = await fetch(`${SERVER_URL}search`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ searchTerm })
      });
      return await response.json();
    } catch (error) {
      console.error('Error searching lessons:', error);
      return [];
    }
  },

  getFullImageUrl(imagePath) {
    return SERVER_URL + imagePath;
  }
};