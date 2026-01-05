'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function getOrders(page: number = 1, limit: number = 10, search: string = '') {
  try {
    await connectDB();

    let searchQuery: any = {};
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      // Check if search looks like an email (contains @)
      if (trimmedSearch.includes('@')) {
        // Search by customer email - return all orders for that customer
        searchQuery = { customerEmail: trimmedSearch.toLowerCase() };
      } else {
        // Search by order number - exact match only
        searchQuery = { orderNumber: trimmedSearch };
      }
    }

    // For single order search, skip pagination
    const isOrderNumberSearch = trimmedSearch && !trimmedSearch.includes('@');
    const skip = isOrderNumberSearch ? 0 : (page - 1) * limit;
    const actualLimit = isOrderNumberSearch ? 1 : limit;

    const [orders, total] = await Promise.all([
      Order.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(actualLimit)
        .populate('items.productId')
        .lean(),
      Order.countDocuments(searchQuery)
    ]);

    return {
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / (isOrderNumberSearch ? 1 : limit)),
        totalOrders: total,
        hasMore: skip + orders.length < total
      }
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      error: 'Failed to fetch orders',
      orders: [],
      pagination: { currentPage: 1, totalPages: 0, totalOrders: 0, hasMore: false }
    };
  }
}

export async function getOrderById(orderId: string) {
  try {
    await connectDB();

    const order = await Order.findById(orderId)
      .populate('items.productId')
      .lean();

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return {
      success: true,
      order: JSON.parse(JSON.stringify(order))
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await connectDB();

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: 'Invalid status' };
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/dashboard/orders');
    revalidatePath(`/dashboard/orders/${orderId}`);

    return {
      success: true,
      message: `Order status updated to ${newStatus}`,
      order: JSON.parse(JSON.stringify(order))
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}
