import { getCustomers } from '@/app/actions/customer';
import CustomersClient from '@/components/CustomersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CustomersPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';

  const { customers, pagination } = await getCustomers(page, 10, search);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customer Management</h1>
        <p className="text-gray-600">View and manage customer information</p>
      </div>

      <CustomersClient
        initialCustomers={customers}
        pagination={pagination}
        initialSearch={search}
      />
    </div>
  );
}
