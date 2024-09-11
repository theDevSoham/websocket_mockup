window.onload = () => {
	fetch('http://localhost:3000/products')
		.then(response => response.json())
		.then(products => {
			const adminProductList = document.getElementById('admin-product-list');
			products.forEach(product => {
				const productItem = document.createElement('div');
				productItem.classList.add('admin-product-item');

				productItem.innerHTML = `
                    <input type="hidden" value="${product.id}" class="product-id">
                    <label>Name:</label>
                    <input type="text" value="${product.name}" class="product-name">
                    <label>Description:</label>
                    <textarea class="product-description">${product.description}</textarea>
                    <label>Price:</label>
                    <input type="number" value="${product.price}" class="product-price">
                    <label>Image URL:</label>
                    <input type="text" value="${product.image}" class="product-image">
                    <button class="update-btn">Update</button>
                `;

				const updateBtn = productItem.querySelector('.update-btn');
				updateBtn.addEventListener('click', () => {
					const updatedProduct = getProductDetails(productItem);
					updateProduct(updatedProduct);
				});

				adminProductList.appendChild(productItem);
			});
		})
		.catch(err => console.error('Error fetching products:', err));

	// Save all button
	const saveAllBtn = document.getElementById('save-all-btn');
	saveAllBtn.addEventListener('click', () => {
		const allProductItems = document.querySelectorAll('.admin-product-item');
		const updatedProducts = [];

		allProductItems.forEach(item => {
			updatedProducts.push(getProductDetails(item));
		});

		updateAllProducts(updatedProducts);
	});
};

function getProductDetails(item) {
	return {
		id: parseInt(item.querySelector('.product-id').value),
		name: item.querySelector('.product-name').value,
		description: item.querySelector('.product-description').value,
		price: parseFloat(item.querySelector('.product-price').value),
		image: item.querySelector('.product-image').value
	};
}

function updateProduct(product) {
	fetch(`http://localhost:3000/products/${product.id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(product)
	})
		.then(response => response.json())
		.then(data => console.log('Product updated:', data))
		.catch(err => console.error('Error updating product:', err));
}

function updateAllProducts(products) {
	fetch('http://localhost:3000/products', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(products)
	})
		.then(response => response.json())
		.then(data => console.log('All products updated:', data))
		.catch(err => console.error('Error updating all products:', err));
}
