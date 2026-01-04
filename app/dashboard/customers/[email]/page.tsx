import { getCustomerDetails } from '@/app/actions/customer';
import { notFound } from 'next/navigation';
import CustomerDetailsClient from '@/components/CustomerDetailsClient';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailsPage({
  params
}: {
  params: { email: string };
}) {
  const decodedEmail = decodeURIComponent(params.email);
  const result = await getCustomerDetails(decodedEmail);

  if (!result.success || !result.customer) {
    notFound();
  }

  return (
    <div className="p-8">
      <CustomerDetailsClient
        customer={result.customer}
        orders={result.orders || []}
      />
    </div>
  );
}
