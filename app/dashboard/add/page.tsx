import ProductForm from "@/components/ProductForm";
import Link from "next/link";

export default function AddProductPage() {
  return (
    <div className="p-8">
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>
      <ProductForm />
    </div>
  );
}