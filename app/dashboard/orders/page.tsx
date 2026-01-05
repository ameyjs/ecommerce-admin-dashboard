import { getOrders } from '@/app/actions/order';
import Link from 'next/link';
import { Suspense } from 'react';
import OrdersClient from '@/components/OrdersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OrdersPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';

  const { orders, pagination } = await getOrders(page, 10, search);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">View and manage all customer orders</p>
      </div>

      <Suspense fallback={<div className="text-center py-8">Loading orders...</div>}>
        <OrdersClient
          initialOrders={orders}
          pagination={pagination}
          initialSearch={search}
        />
      </Suspense>
    </div>
  );
}
