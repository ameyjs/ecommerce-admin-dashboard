import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!\n");

    // Count products
    const Product = mongoose.connection.collection("products");
    const productCount = await Product.countDocuments();
    console.log(`✓ Products in database: ${productCount}`);

    // Count orders
    const Order = mongoose.connection.collection("orders");
    const orderCount = await Order.countDocuments();
    console.log(`✓ Orders in database: ${orderCount}`);

    // Show sample products
    const sampleProducts = await Product.find({}).limit(3).toArray();
    console.log("\nSample Products:");
    sampleProducts.forEach((p: any) => {
      console.log(`  - ${p.name} ($${p.price}) - Stock: ${p.stock}`);
    });

    // Show sample orders
    const sampleOrders = await Order.find({}).limit(3).toArray();
    console.log("\nSample Orders:");
    sampleOrders.forEach((o: any) => {
      console.log(
        `  - ${o.orderNumber} - ${o.customerEmail} - $${o.totalAmount} - ${o.status}`
      );
    });

    // Calculate total revenue
    const orders = await Order.find({}).toArray();
    const totalRevenue = orders.reduce(
      (sum: number, order: any) => sum + order.totalAmount,
      0
    );
    console.log(`\n✓ Total Revenue: $${totalRevenue.toFixed(2)}`);

    await mongoose.connection.close();
    console.log("\nVerification complete!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

verify();
