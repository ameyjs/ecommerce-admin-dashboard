"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "@/lib/validations";
import { addProduct } from "@/app/actions/product";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // FIX: Removed <ProductFormValues> generic here to let Zod infer types automatically
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      images: [] as string[],
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecommerce_preset"); 

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dj614czal/image/upload",
        { method: "POST", body: formData }
      );
      
      const data = await response.json();
      
      if (data.secure_url) {
        setValue("images", [data.secure_url]); 
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // FIX: Explicitly typed 'data' here so TypeScript is happy
  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("stock", data.stock.toString());
    formData.append("category", data.category);
    
    // Check if images is actually an array before using it
    const imageUrls = Array.isArray(data.images) ? data.images : [];

    const result = await addProduct(formData, imageUrls);

    if (result.success) {
      alert("Product Added!");
      router.push("/dashboard"); 
      router.refresh(); 
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input {...register("name")} className="w-full border p-2 rounded" placeholder="iPhone 15" />
        {errors.name && <p className="text-red-500 text-sm">{String(errors.name.message)}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea {...register("description")} className="w-full border p-2 rounded" rows={3} />
        {errors.description && <p className="text-red-500 text-sm">{String(errors.description.message)}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input type="number" step="0.01" {...register("price")} className="w-full border p-2 rounded" />
          {errors.price && <p className="text-red-500 text-sm">{String(errors.price.message)}</p>}
        </div>
        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input type="number" {...register("stock")} className="w-full border p-2 rounded" />
          {errors.stock && <p className="text-red-500 text-sm">{String(errors.stock.message)}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select {...register("category")} className="w-full border p-2 rounded">
          <option value="">Select Category...</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm">{String(errors.category.message)}</p>}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <p className="text-sm text-blue-500 mt-2">Uploading image...</p>}
        {preview && <img src={preview} alt="Preview" className="h-20 w-20 object-cover mt-2 rounded border" />}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting || uploading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
}