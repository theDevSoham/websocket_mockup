let ws;

window.onload = () => {
	connectWebSocket();

	// Initially fetch products
	fetch('http://localhost:3000/products')
		.then(response => response.json())
		.then(renderProducts)
		.catch(err => console.error('Error fetching products:', err));
};

// WebSocket connection
function connectWebSocket() {
	ws = new WebSocket('ws://localhost:3000');

	ws.onopen = () => {
		console.log('WebSocket connection established');
	};

	ws.onmessage = (event) => {
		const updatedProducts = JSON.parse(event.data);
		renderProducts(updatedProducts);
	};

	ws.onclose = () => {
		console.log('WebSocket connection closed, attempting to reconnect...');
		setTimeout(connectWebSocket, 1000); // Try reconnecting after 1 second
	};
}

// Render products in the list
function renderProducts(products) {
	const productList = document.getElementById('product-list');
	productList.innerHTML = ''; // Clear the existing list

	products.forEach(product => {
		const productItem = document.createElement('div');
		productItem.classList.add('product-item');

		productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
        `;

		productList.appendChild(productItem);
	});
}
