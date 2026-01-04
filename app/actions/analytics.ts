"use server";

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function getAnalyticsData() {
  try {
    await connectDB();

    // Get all orders
    const orders = await Order.find({}).lean();

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total orders count
    const totalOrders = orders.length;

    // Average order value
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get product count
    const totalProducts = await Product.countDocuments();

    // Group orders by month for charts
    const monthlyData = getMonthlyData(orders);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalProducts,
      monthlyData,
    };
  } catch (error) {
    console.error("Analytics error:", error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      avgOrderValue: 0,
      totalProducts: 0,
      monthlyData: [],
    };
  }
}

function getMonthlyData(orders: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Get last 6 months
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    last6Months.push({ month: months[monthIndex], monthIndex, year });
  }

  // Group orders by month
  const monthlyStats = last6Months.map(({ month, monthIndex, year }) => {
    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === monthIndex && orderDate.getFullYear() === year;
    });

    const sales = monthOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = monthOrders.length;

    return {
      month,
      sales: Math.round(sales),
      orders: orderCount,
    };
  });

  return monthlyStats;
}
