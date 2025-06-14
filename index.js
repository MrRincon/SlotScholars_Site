// M00774667
// Vue object with all the important functionality and information
let webstore = new Vue({
    el: '#App',
    data: {// Data information
        sitename: "SlotScholars",
        displayPages: 0,
        lessons: [],// Array to store the lessons information
        sort: {
            by: 'Subject',
            order: 'Ascending',
            options: ['Subject', 'Location', 'Price', 'Spaces']
        },
        cart: [],// Array to store items in the shopping cart
        order: {// Order information
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
    },
    methods: {// Methods for the application
        switchPages() {// Method to switch between the pages
            if (this.displayPages === 0) {
                this.displayPages = 1;
            } else {
                this.displayPages = 0;
            }
        },
        displayPage(page) {// Method to display an specific page
            this.displayPages = page;
        },
        addToCart(lesson) {// Method to add an item to the cart
            this.cart.push(lesson.id);
        },
        canAddToCart(lesson) {// Method to confirm if item can be added to the cart
            return lesson.available > this.cartCount(lesson.id);
        },
        itemsLeft(lesson) {// Method to display the items left
            return lesson.available - this.cartCount(lesson.id);
        },
        cartCount(id) {// Method to count the items with the same id in the cart 
            let count = 0;
            for (let itemIndex = 0; itemIndex < this.cart.length; itemIndex++) {
                if (this.cart[itemIndex] === id) {
                    count++;
                }
            }
            return count;
        },
        removeItem(id) {// Method to remove an specific item from the cart
            let spotCount = 0;
            for (let item of this.cart) {
                if (item === id) {
                    this.cart.splice(spotCount, 1);
                    break;
                }
                spotCount++;
            }
        },
        getFullImageUrl(imagePath) {// Method to correct the URL to display the image from the server
            const serverUrl = "https://slotscholars-server.onrender.com/";
            return serverUrl + imagePath;
        },
        restoreCheckout() {// Method to restore all the values to their initial settings
            this.cart = [];
            this.order.id = '';
            this.order.firstName = '';
            this.order.lastName = '';
            this.order.phoneNumber = '';
            this.order.address = '';
            this.order.city = '';
            this.order.zip = '';
            this.order.states.state = '';
            this.order.method = 'Home';
            this.order.gift.value = 'Do not send as gift';
        },
        async sendOrder() {// Method to send the order
            const modalContent = document.getElementById('modal-result');// Get the modal content area to modify later
            const newOrder = JSON.stringify({// Create the order and how it will be stored in the database
                id: this.order.id,
                firstName: this.order.firstName,
                lastName: this.order.lastName,
                phoneNumber: this.order.phoneNumber,
                address: this.order.address,
                city: this.order.city,
                zip: this.order.zip,
                state: this.order.states.state,
                method: this.order.method,
                gift: this.order.gift.value,
                purchasedLessonsID: this.cart
            }); // Send the order as a string json format
            try {
                const postResponse = await fetch(`https://slotscholars-server.onrender.com/placeOrder`, {// Fetch the post method from the server and send the order data in the request
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: newOrder
                });
                const postResult = await postResponse.json();// Identify the response from the fetch as a result
                if (postResult.success) {// If the result is successful, update the lessons collection
                    this.order.id = postResult.order.id;
                    let orderValue = postResult.order.id;// Safekeeping the order id to display it to the user
                    modalContent.innerHTML = `Your order has been placed. this is your order id = <strong>${orderValue}</strong>`;
                    const putResponse = await fetch(`https://slotscholars-server.onrender.com/updateLessons`, {// Fetch the put method from the server and send the order data in the request
                        method: 'PUT',
                        headers: { 'Content-type': 'application/json' },
                        body: newOrder
                    });
                    const putResult = await putResponse.json();// Identify the response from the fetch as a result
                    if (putResult.success) {// If successful, restore the checkout
                        this.restoreCheckout();
                    }
                }
            } catch (err) {// Catch error if the post method doesn't work
                console.log(`Error fetching post method: ${err}`);
            }
        },
        reloadPage() {// Method to update the lessons when the page is reloaded after placing an order
            webstore.lessons = [];
            fetch("https://slotscholars-server.onrender.com/lessons").then(
                function (res) {
                    res.json().then(
                        function (json) {
                            webstore.lessons = json;
                        }
                    )
                }
            );
            this.displayPage(0);// Calling the function to display the main page agaim
        },
        async searchBarQuery(newQuery) {// Method to search for lessons that match the search bar query
            const modalContent = document.getElementById('searchModal-body');// Element targeted for the response
            try {// Try-Catch for any errors with the server 
                if (!newQuery.trim) {// Check up for the input field to see if is empty
                    modalContent.innerHTML = `<p><strong>No results, please type to search.</strong></p>`;
                    return;
                }
                // Fetch the post method to the server to find the elements that match the query sent in the body as a request
                const response = await fetch("https://slotscholars-server.onrender.com/search", {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ searchTerm: newQuery })
                })
                const results = await response.json();
                if (results.length > 0) {// Display all the lessons found in the targeted element that match the query
                    newString = ``;
                    for (let result of results) {// Loop through the results to display each lessons information
                        newString += `<p><strong>${result.subject} - ${result.location} - £${result.price} - Spaces:${this.itemsLeft(result)}</strong></p><hr class='divider'>`;
                    }
                    modalContent.innerHTML = newString;
                } else {// Error message if nothing is found
                    modalContent.innerHTML = `<p><strong>No results found for ${newQuery}.</strong></p>`;
                }
            } catch (error) {
                console.error('Error fetching the search results', error);
                modalContent.innerHTML = `<p><strong>An error occurred. Please try later</strong></p>`;
            }
        },
        clearSearch() {// Method to clear the input field when the modal is fully hidden
            document.getElementById('searchInput').value = '';// Clear the input field
            document.getElementById('searchModal-body').innerHTML = ``;// Clear modal body
        }
    },
    computed: {// Computed methods for the application
        cartItemsCount() {// Computed method to specify if the basket is empty for the checkout button
            return this.cart.length || "";
        },
        sortedLessons() {// Computed method to sort the lessons based on the selected properties and order
            // Creates a copy of the lessons array to avoid changing the original list
            let lessonsToSort = this.lessons.slice();

            // Sort the copied lessons array based on the selected property and order
            lessonsToSort.sort((lessonA, lessonB) => {
                let valueA, valueB;
                // Using itemsLeft function if sorting by spaces available
                if (this.sort.by === 'Spaces') {
                    valueA = this.itemsLeft(lessonA);
                    valueB = this.itemsLeft(lessonB);

                } else {
                    // Get the values of the selected property from both lessons
                    valueA = lessonA[this.sort.by.toLowerCase()];
                    valueB = lessonB[this.sort.by.toLowerCase()];
                }
                // Variable for the comparison result
                let comparison;
                // Compares alphabetically if the values are strings
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    // Simple comparison, return -1 if valueA is smaller, return 1 if larger, otherwise return 0
                    comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    // Substracts to compare if the values are numbers
                    comparison = valueA - valueB;
                }

                // Reverses the comparison result if the order is "Descending"
                return this.sort.order === 'Ascending' ? comparison : -comparison;
            });

            // Returns the sorted array
            return lessonsToSort;
        },
        lessonsSortedLocations() {// Computed method to display the all the existent locations
            let totalLocations = [];
            this.lessons.forEach(lesson => {
                if (!totalLocations.includes(lesson.location)) {
                    totalLocations.push(lesson.location);
                }
            });
            return totalLocations.sort();
        },
        trendingLessons() {// Computed method to display the trending lessons
            let trendingLessons = this.lessons
                .filter(lesson => this.itemsLeft(lesson) > 0)// Filtering the lessons that have more than 0
                .sort((a, b) => this.itemsLeft(a) - this.itemsLeft(b))// Sorting the lessons in ascending order
                .slice(0, 3);// Display only the first three elements
            return trendingLessons;
        },
        itemsInCart() {// Computed method to display the items in the cart
            let currItems = [];// Array for the 
            let existentItems = [];
            this.cart.forEach(item => {
                // Checking if the item is already in the new array
                if (!existentItems.includes(item)) {
                    // New data for displaying the items in the cart
                    let itemData = {
                        "img": {
                            "location": "",
                            "alt": ""
                        },
                        "price": 0.00,
                        "subject": "",
                        "location": "",
                        "id": 0,
                        "amount": 0
                    };
                    this.lessons.forEach(lesson => {
                        //Loop through the lessons to use the data of the lesson in the item in the basket
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
                    // Push the needed data in the array that will be displayed
                    currItems.push(itemData);
                    // Record the item in the existing items to prevent repetition
                    existentItems.push(item);
                } else {
                    currItems.forEach(itemIn => {
                        if (item === itemIn.id) {
                            itemIn.amount++;// Increase the amount for repetitive items
                        }
                    })
                }
            });
            return currItems;
        },
        allowedToSubmit() {// Computed method to check the validation
            if (this.order.firstName === '') {
                this.feedback = 'First name is required.'
            } else if (!/^[a-zA-Z ]+$/.test(this.order.firstName)) {
                this.feedback = 'First name contains invalid characters.';
            } else if (this.order.lastName === '') {
                this.feedback = 'Last name is required.';
            } else if (!/^[a-zA-Z ]+$/.test(this.order.lastName)) {
                this.feedback = 'Last name contains invalid characters.';
            } else if (this.order.phoneNumber === '') {
                this.feedback = 'Phone number is required.';
            } else if (isNaN(this.order.phoneNumber) || this.order.phoneNumber.toString().length < 10) {
                this.feedback = 'Enter a valid phone number.';
            } else if (this.order.address === '') {
                this.feedback = 'Address is required.';
            } else if (/^[a-zA-Z0-9, ]+[^a-zA-Z0-9 ]$/.test(this.order.address)) {
                this.feedback = 'Address cannot end in a special character'
            } else if (!/^[a-zA-Z0-9, ]+[a-zA-Z0-9 ]$/.test(this.order.address)) {
                this.feedback = 'Address contains invalid characters.';
            } else if (this.order.city === '') {
                this.feedback = 'City is required.';
            } else if (!/^[a-zA-Z ]+$/.test(this.order.city)) {
                this.feedback = 'City contains invalid characters.';
            } else if (this.order.states.state === '') {
                this.feedback = 'Please select a State';
            } else if (this.order.zip === '') {
                this.feedback = 'Zip code is required.';
            } else if (isNaN(this.order.zip) || this.order.zip.toString().length !== 5) {
                this.feedback = 'Enter a valid 5-digit zip code.';
            } else {
                this.feedback = '';
            }
            return (this.feedback === '');
        }

    },
    created:
        function () {
            fetch("https://slotscholars-server.onrender.com/lessons").then(
                function (res) {
                    res.json().then(
                        function (json) {
                            webstore.lessons = json;
                        }
                    )
                }
            ).catch();
        }
});