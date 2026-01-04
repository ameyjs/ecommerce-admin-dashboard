import { getOrderById } from '@/app/actions/order';
import { notFound } from 'next/navigation';
import OrderDetailsClient from '@/components/OrderDetailsClient';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({
  params
}: {
  params: { id: string };
}) {
  const { success, order, error } = await getOrderById(params.id);

  if (!success || !order) {
    notFound();
  }

  return (
    <div className="p-8">
      <OrderDetailsClient order={order} />
    </div>
  );
}
