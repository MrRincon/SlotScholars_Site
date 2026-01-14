import { reactive, computed } from 'vue'

export const store = reactive({
    sitename: "SlotScholars",
    displayPages: 0,
    lessons: [],
    sort: {
        by: 'Subject',
        order: 'Ascending',
        options: ['Subject', 'Location', 'Price', 'Spaces']
    },
    cart: [],
    order: {
        id: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        zip: '',
        states: {
            state: '',
            options: ['London', 'Manchester', 'Bristol', 'Cardiff']
        },
        method: 'Home',
        gift: {
            value: 'Do not send as gift',
            options: {
                isGift: 'Send as gift',
                isNotGift: 'Do not send as gift'
            }
        }
    },
    feedback: ''
})

// Computed properties
export const computedProps = {
    cartItemsCount: computed(() => store.cart.length || ""),

    sortedLessons: computed(() => {
        let lessonsToSort = store.lessons.slice();

        lessonsToSort.sort((lessonA, lessonB) => {
            let valueA, valueB;

            if (store.sort.by === 'Spaces') {
                valueA = itemsLeft(lessonA);
                valueB = itemsLeft(lessonB);
            } else {
                valueA = lessonA[store.sort.by.toLowerCase()];
                valueB = lessonB[store.sort.by.toLowerCase()];
            }

            let comparison;
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                comparison = valueA - valueB;
            }

            return store.sort.order === 'Ascending' ? comparison : -comparison;
        });

        return lessonsToSort;
    }),

    lessonsSortedLocations: computed(() => {
        let totalLocations = [];
        store.lessons.forEach(lesson => {
            if (!totalLocations.includes(lesson.location)) {
                totalLocations.push(lesson.location);
            }
        });
        return totalLocations.sort();
    }),

    trendingLessons: computed(() => {
        return store.lessons
            .filter(lesson => itemsLeft(lesson) > 0)
            .sort((a, b) => itemsLeft(a) - itemsLeft(b))
            .slice(0, 3);
    }),

    itemsInCart: computed(() => {
        let currItems = [];
        let existentItems = [];

        store.cart.forEach(item => {
            if (!existentItems.includes(item)) {
                let itemData = {
                    "img": { "location": "", "alt": "" },
                    "price": 0.00,
                    "subject": "",
                    "location": "",
                    "id": 0,
                    "amount": 0
                };

                store.lessons.forEach(lesson => {
                    if (item === lesson.id) {
                        itemData.img.location = lesson.img.location;
                        itemData.img.alt = lesson.img.alt;
                        itemData.subject = lesson.subject;
                        itemData.price = lesson.price;
                        itemData.subject = lesson.subject;
                        itemData.location = lesson.location;
                        itemData.id = lesson.id;
                        itemData.amount++;
                    }
                });

                currItems.push(itemData);
                existentItems.push(item);
            } else {
                currItems.forEach(itemIn => {
                    if (item === itemIn.id) {
                        itemIn.amount++;
                    }
                });
            }
        });

        return currItems;
    }),

    allowedToSubmit: computed(() => {
        if (store.order.firstName === '') {
            store.feedback = 'First name is required.';
        } else if (!/^[a-zA-Z ]+$/.test(store.order.firstName)) {
            store.feedback = 'First name contains invalid characters.';
        } else if (store.order.lastName === '') {
            store.feedback = 'Last name is required.';
        } else if (!/^[a-zA-Z ]+$/.test(store.order.lastName)) {
            store.feedback = 'Last name contains invalid characters.';
        } else if (store.order.phoneNumber === '') {
            store.feedback = 'Phone number is required.';
        } else if (isNaN(store.order.phoneNumber) || store.order.phoneNumber.toString().length < 10) {
            store.feedback = 'Enter a valid phone number.';
        } else if (store.order.address === '') {
            store.feedback = 'Address is required.';
        } else if (/^[a-zA-Z0-9, ]+[^a-zA-Z0-9 ]$/.test(store.order.address)) {
            store.feedback = 'Address cannot end in a special character';
        } else if (!/^[a-zA-Z0-9, ]+[a-zA-Z0-9 ]$/.test(store.order.address)) {
            store.feedback = 'Address contains invalid characters.';
        } else if (store.order.city === '') {
            store.feedback = 'City is required.';
        } else if (!/^[a-zA-Z ]+$/.test(store.order.city)) {
            store.feedback = 'City contains invalid characters.';
        } else if (store.order.states.state === '') {
            store.feedback = 'Please select a State';
        } else if (store.order.zip === '') {
            store.feedback = 'Zip code is required.';
        } else if (isNaN(store.order.zip) || store.order.zip.toString().length !== 5) {
            store.feedback = 'Enter a valid 5-digit zip code.';
        } else {
            store.feedback = '';
        }
        return (store.feedback === '');
    })
}

// Helper functions
export const itemsLeft = (lesson) => lesson.available - cartCount(lesson.id);

export const cartCount = (id) => {
    let count = 0;
    for (let itemIndex = 0; itemIndex < store.cart.length; itemIndex++) {
        if (store.cart[itemIndex] === id) {
            count++;
        }
    }
    return count;
};

export const canAddToCart = (lesson) => lesson.available > cartCount(lesson.id);