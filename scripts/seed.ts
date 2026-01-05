import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Product data
const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life and crystal-clear audio quality.",
    price: 149.99,
    stock: 50,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, and sleep patterns with this advanced fitness tracker.",
    price: 199.99,
    stock: 75,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton.",
    price: 29.99,
    stock: 200,
    category: "Clothing",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks cold for 24 hours or hot for 12 hours with this insulated bottle.",
    price: 34.99,
    stock: 120,
    category: "Home & Kitchen",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
  },
  {
    name: "Leather Laptop Bag",
    description: "Professional leather bag with padded compartment for laptops up to 15 inches.",
    price: 89.99,
    stock: 40,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
  },
  {
    name: "Yoga Mat with Carry Strap",
    description: "Non-slip, eco-friendly yoga mat perfect for all types of yoga and exercise.",
    price: 39.99,
    stock: 85,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500"],
  },
  {
    name: "Portable Phone Charger",
    description: "20,000mAh power bank with fast charging for multiple devices.",
    price: 45.99,
    stock: 150,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500"],
  },
  {
    name: "Coffee Maker Machine",
    description: "Programmable coffee maker with 12-cup capacity and auto-shutoff feature.",
    price: 79.99,
    stock: 60,
    category: "Home & Kitchen",
    images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500"],
  },
  {
    name: "Running Shoes",
    description: "Lightweight and breathable running shoes with superior cushioning and support.",
    price: 119.99,
    stock: 95,
    category: "Sports",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
  },
  {
    name: "Desk Organizer Set",
    description: "Bamboo desk organizer with multiple compartments for office supplies.",
    price: 24.99,
    stock: 110,
    category: "Office Supplies",
    images: ["https://images.unsplash.com/photo-1587582423116-ec07293f0395?w=500"],
  },
  {
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless mouse with customizable RGB lighting and 16,000 DPI.",
    price: 69.99,
    stock: 80,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"],
  },
  {
    name: "Canvas Backpack",
    description: "Vintage-style canvas backpack with laptop sleeve and multiple pockets.",
    price: 54.99,
    stock: 65,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
  },
];

// Customer emails for orders
const customerEmails = [
  "john.doe@example.com",
  "jane.smith@example.com",
  "michael.brown@example.com",
  "emily.wilson@example.com",
  "david.jones@example.com",
  "sarah.davis@example.com",
  "robert.miller@example.com",
  "lisa.anderson@example.com",
  "james.taylor@example.com",
  "mary.thomas@example.com",
];

// Order statuses
const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

// Generate random date within last 6 months
function getRandomDateInLast6Months() {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const randomTime =
    sixMonthsAgo.getTime() +
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  return new Date(randomTime);
}

// Generate random order number
function generateOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function seed() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Define schemas
    const ProductSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        category: { type: String, required: true },
        images: { type: [String], default: [] },
      },
      { timestamps: true }
    );

    const OrderSchema = new mongoose.Schema(
      {
        orderNumber: { type: String, required: true, unique: true },
        customerEmail: { type: String, required: true },
        items: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
            },
            productName: String,
            quantity: Number,
            price: Number,
          },
        ],
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
          default: "pending",
        },
      },
      { timestamps: true }
    );

    // Get or create models
    const Product =
      mongoose.models.Product || mongoose.model("Product", ProductSchema);
    const Order =
      mongoose.models.Order || mongoose.model("Order", OrderSchema);

    // Clear existing data
    console.log("Clearing existing products and orders...");
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Insert products
    console.log("Inserting products...");
    const insertedProducts = await Product.insertMany(products);
    console.log(`Inserted ${insertedProducts.length} products`);

    // Generate orders for each product
    console.log("Generating orders...");
    let totalOrders = 0;

    for (const product of insertedProducts) {
      const numOrders = Math.floor(Math.random() * 6) + 5; // 5-10 orders per product

      for (let i = 0; i < numOrders; i++) {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
        const customerEmail =
          customerEmails[Math.floor(Math.random() * customerEmails.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdAt = getRandomDateInLast6Months();

        const order = {
          orderNumber: generateOrderNumber(),
          customerEmail,
          items: [
            {
              productId: product._id,
              productName: product.name,
              quantity,
              price: product.price,
            },
          ],
          totalAmount: product.price * quantity,
          status,
          createdAt,
          updatedAt: createdAt,
        };

        await Order.create(order);
        totalOrders++;

        // Small delay to ensure unique order numbers
        await new Promise((resolve) => setTimeout(resolve, 2));
      }
    }

    console.log(`Successfully generated ${totalOrders} orders`);
    console.log("\n=== Seeding Complete ===");
    console.log(`Products: ${insertedProducts.length}`);
    console.log(`Orders: ${totalOrders}`);

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run seed
seed();
