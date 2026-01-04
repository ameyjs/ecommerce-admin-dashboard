import EditProductForm from "@/components/EditProductForm";
import Link from "next/link";
import { getProduct } from "@/app/actions/product";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const result = await getProduct(id);

  if (result.error || !result.product) {
    redirect("/dashboard");
  }

  return (
    <div className="p-8">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>
      <EditProductForm product={result.product} />
    </div>
  );
}
