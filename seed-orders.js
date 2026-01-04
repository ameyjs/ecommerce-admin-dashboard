// Run this with: node seed-orders.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing from .env.local");
  process.exit(1);
}

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customerEmail: String,
  items: Array,
  totalAmount: Number,
  status: String,
  createdAt: Date,
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

// Generate sample orders for the last 6 months
function generateOrders() {
  const orders = [];
  const today = new Date();

  // Create orders for the last 6 months
  for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
    const orderMonth = new Date(today);
    orderMonth.setMonth(today.getMonth() - monthsAgo);

    // Generate 5-15 random orders per month
    const numOrders = Math.floor(Math.random() * 11) + 5;

    for (let i = 0; i < numOrders; i++) {
      const randomDay = Math.floor(Math.random() * 28) + 1;
      const orderDate = new Date(orderMonth.getFullYear(), orderMonth.getMonth(), randomDay);

      const orderAmount = (Math.random() * 200 + 20).toFixed(2);

      orders.push({
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        customerEmail: `customer${i}@example.com`,
        items: [
          {
            productName: "Sample Product",
            quantity: Math.floor(Math.random() * 3) + 1,
            price: parseFloat(orderAmount) / 2,
          }
        ],
        totalAmount: parseFloat(orderAmount),
        status: ["pending", "processing", "shipped", "delivered"][Math.floor(Math.random() * 4)],
        createdAt: orderDate,
      });
    }
  }

  return orders;
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to DB");

    // Clear existing orders
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log(`⚠️  Found ${existingOrders} existing orders. Clearing them...`);
      await Order.deleteMany({});
    }

    // Generate and insert sample orders
    const sampleOrders = generateOrders();
    await Order.insertMany(sampleOrders);

    console.log(`🎉 Successfully created ${sampleOrders.length} sample orders!`);
    console.log(`\nOrders distributed across the last 6 months.`);
    console.log(`\nNow visit your dashboard to see the real analytics! 📊`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding orders:", error);
    process.exit(1);
  }
}

seed();
