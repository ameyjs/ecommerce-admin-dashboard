"use server";

import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. CREATE Product
export async function addProduct(formData: FormData, imageUrls: string[]) {
  try {
    await connectDB();

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      category: formData.get("category"),
      images: imageUrls,
    };

    // Validate data using Zod
    const validatedData = productSchema.parse(rawData);

    // Save to DB
    await Product.create(validatedData);

    // Refresh the dashboard to show new data
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to add product" };
  }
}

// 2. UPDATE Product
export async function updateProduct(productId: string, formData: FormData, imageUrls: string[]) {
  try {
    await connectDB();

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      category: formData.get("category"),
      images: imageUrls,
    };

    // Validate data using Zod
    const validatedData = productSchema.parse(rawData);

    // Update in DB
    await Product.findByIdAndUpdate(productId, validatedData);

    // Refresh the dashboard to show updated data
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update product" };
  }
}

// 3. DELETE Product
export async function deleteProduct(productId: string) {
  try {
    await connectDB();

    // Import Order model dynamically to avoid circular dependencies
    const Order = (await import("@/models/Order")).default;

    // Delete all orders that contain this product
    await Order.deleteMany({ "items.productId": productId });

    // Delete the product itself
    await Product.findByIdAndDelete(productId);

    // Revalidate all relevant paths to update stats and graphs
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product" };
  }
}

// 4. GET Single Product
export async function getProduct(productId: string) {
  try {
    await connectDB();
    const product = await Product.findById(productId).lean();

    if (!product) {
      return { error: "Product not found" };
    }

    return {
      product: {
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString(),
      }
    };
  } catch (error) {
    return { error: "Failed to fetch product" };
  }
}

// 5. GET Products with Pagination and Search
export async function getProducts(page: number = 1, limit: number = 10, search: string = '') {
  try {
    await connectDB();

    const skip = (page - 1) * limit;
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    return {
      success: true,
      products: products.map((product: any) => ({
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt.toString(),
        updatedAt: product.updatedAt.toString(),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasMore: skip + products.length < total
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: 'Failed to fetch products',
      products: [],
      pagination: { currentPage: 1, totalPages: 0, totalProducts: 0, hasMore: false }
    };
  }
}