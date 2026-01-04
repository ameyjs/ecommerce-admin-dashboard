import { getCustomers } from '@/app/actions/customer';
import CustomersClient from '@/components/CustomersClient';

export const dynamic = 'force-dynamic';

export default async function CustomersPage({
  searchParams
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';

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
