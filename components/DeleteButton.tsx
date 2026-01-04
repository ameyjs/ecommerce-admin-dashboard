"use client";

import { deleteProduct } from "@/app/actions/product";
import { useState } from "react";

export default function DeleteButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    const result = await deleteProduct(productId);

    if (result.success) {
      // The page will automatically refresh due to revalidatePath in the action
    } else {
      alert(result.error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50 font-medium transition"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
