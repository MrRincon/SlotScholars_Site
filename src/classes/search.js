import { api } from './servicesAPI.js';
import { itemsLeft } from './store.js';

export const searchStore = {
  async searchBarQuery(newQuery) {
    const modalContent = document.getElementById('searchModal-body');
    
    try {
      if (!newQuery.trim()) {
        modalContent.innerHTML = `<p><strong>No results, please type to search.</strong></p>`;
        return;
      }

      const results = await api.searchLessons(newQuery);
      
      if (results.length > 0) {
        let newString = ``;
        for (let result of results) {
          newString += `<p><strong>${result.subject} - ${result.location} - £${result.price} - Spaces:${itemsLeft(result)}</strong></p><hr class='divider'>`;
        }
        modalContent.innerHTML = newString;
      } else {
        modalContent.innerHTML = `<p><strong>No results found for ${newQuery}.</strong></p>`;
      }
    } catch (error) {
      console.error('Error fetching the search results', error);
      modalContent.innerHTML = `<p><strong>An error occurred. Please try later</strong></p>`;
    }
  },

  clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const modalBody = document.getElementById('searchModal-body');
    
    if (searchInput) searchInput.value = '';
    if (modalBody) modalBody.innerHTML = ``;
  }
};