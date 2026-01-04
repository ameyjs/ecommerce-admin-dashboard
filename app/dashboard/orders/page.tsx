import { getOrders } from '@/app/actions/order';
import Link from 'next/link';
import OrdersClient from '@/components/OrdersClient';

export default async function OrdersPage({
  searchParams
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

  const { orders, pagination } = await getOrders(page, 10, search);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      <OrdersClient
        initialOrders={orders}
        pagination={pagination}
        initialSearch={search}
      />
    </div>
  );
}
