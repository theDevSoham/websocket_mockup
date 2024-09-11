const express = require('express');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

// Create an HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Load products from JSON file
let products = JSON.parse(fs.readFileSync('products.json'));

// Broadcast updates to all connected clients
function broadcastUpdate(updatedProducts) {
	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(updatedProducts));
		}
	});
}

// WebSocket connection
wss.on('connection', (ws) => {
	console.log('Client connected');
	ws.send(JSON.stringify(products)); // Send current products on connection

	ws.on('close', () => {
		console.log('Client disconnected');
	});
});

// Get all products
app.get('/products', (req, res) => {
	res.json(products);
});

// Update a specific product by ID
app.put('/products/:id', (req, res) => {
	const productId = parseInt(req.params.id);
	const updatedProduct = req.body;

	const productIndex = products.findIndex(p => p.id === productId);
	if (productIndex >= 0) {
		products[productIndex] = updatedProduct;
		fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
		res.json({ message: 'Product updated successfully' });
		broadcastUpdate(products);  // Broadcast update to all clients
	} else {
		res.status(404).json({ message: 'Product not found' });
	}
});

// Update all products
app.put('/products', (req, res) => {
	products = req.body;
	fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
	res.json({ message: 'All products updated successfully' });
	broadcastUpdate(products);  // Broadcast update to all clients
});

// Start HTTP and WebSocket server
const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
