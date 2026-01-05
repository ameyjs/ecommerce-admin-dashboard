'use server';

import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function getCustomers(page: number = 1, limit: number = 10, search: string = '') {
  try {
    await connectDB();

    const trimmedSearch = search.trim().toLowerCase();

    // For customer search, use exact email match
    const searchQuery = trimmedSearch
      ? { customerEmail: trimmedSearch }
      : {};

    // Get unique customer emails with order aggregation
    const customers = await Order.aggregate([
      ...(trimmedSearch ? [{ $match: searchQuery }] : []),
      {
        $group: {
          _id: '$customerEmail',
          totalOrders: { $sum: 1 },
          lifetimeValue: { $sum: '$totalAmount' },
          lastOrderDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' }
        }
      },
      { $sort: { lifetimeValue: -1 } },
      {
        $project: {
          _id: 0,
          email: '$_id',
          totalOrders: 1,
          lifetimeValue: 1,
          lastOrderDate: 1,
          firstOrderDate: 1
        }
      }
    ]);

    // For search, don't paginate (return the single result)
    const total = customers.length;
    const skip = trimmedSearch ? 0 : (page - 1) * limit;
    const paginatedCustomers = trimmedSearch ? customers : customers.slice(skip, skip + limit);

    return {
      success: true,
      customers: JSON.parse(JSON.stringify(paginatedCustomers)),
      pagination: {
        currentPage: page,
        totalPages: trimmedSearch ? 1 : Math.ceil(total / limit),
        totalCustomers: total,
        hasMore: !trimmedSearch && (skip + paginatedCustomers.length < total)
      }
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: 'Failed to fetch customers',
      customers: [],
      pagination: { currentPage: 1, totalPages: 0, totalCustomers: 0, hasMore: false }
    };
  }
}

export async function getCustomerDetails(email: string) {
  try {
    await connectDB();

    // Get customer's orders
    const orders = await Order.find({ customerEmail: email })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .lean();

    if (orders.length === 0) {
      return { success: false, error: 'Customer not found' };
    }

    // Calculate customer stats
    const totalOrders = orders.length;
    const lifetimeValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = lifetimeValue / totalOrders;
    const lastOrderDate = orders[0].createdAt;
    const firstOrderDate = orders[orders.length - 1].createdAt;

    return {
      success: true,
      customer: {
        email,
        totalOrders,
        lifetimeValue,
        averageOrderValue,
        lastOrderDate,
        firstOrderDate
      },
      orders: JSON.parse(JSON.stringify(orders))
    };
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return { success: false, error: 'Failed to fetch customer details' };
  }
}
