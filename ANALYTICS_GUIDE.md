# Analytics Guide - Real Database-Driven Charts

## Overview

The dashboard now fetches **real analytics data from the database** instead of using hardcoded values. All charts, KPI cards, and statistics are dynamically generated from your Orders and Products collections in MongoDB.

---

## What Changed?

### Before (Hardcoded)
- Static dummy data in the component
- Same numbers every time
- No connection to actual business data

### After (Database-Driven)
- Real-time data from MongoDB
- Automatically updates as orders are created
- Accurate revenue, order counts, and trends

---

## New Files

### 1. Order Model
**File**: [models/Order.ts](models/Order.ts)

Mongoose schema for storing order data:
```typescript
{
  orderNumber: String,      // Unique order identifier
  customerEmail: String,    // Customer email
  items: Array,             // Products in the order
  totalAmount: Number,      // Total order value
  status: String,           // pending/processing/shipped/delivered
  createdAt: Date          // Auto-generated timestamp
}
```

### 2. Analytics Actions
**File**: [app/actions/analytics.ts](app/actions/analytics.ts)

Server action that fetches and calculates:
- Total revenue (sum of all orders)
- Total order count
- Average order value
- Total products in inventory
- Monthly sales data (last 6 months)
- Month-over-month growth percentages

### 3. Seed Script
**File**: [seed-orders.js](seed-orders.js)

Populates the database with sample orders for testing:
```bash
node seed-orders.js
```

This creates 30-90 orders distributed across the last 6 months.

---

## Dashboard Analytics Features

### KPI Cards (4 cards)

1. **Total Revenue**
   - Sum of all order amounts
   - Shows % change from previous month
   - Green for positive, red for negative growth

2. **Total Orders**
   - Count of all orders in database
   - Month-over-month comparison
   - Dynamic growth indicator

3. **Average Order Value**
   - Total revenue ÷ Total orders
   - Helps track customer spending patterns

4. **Total Products**
   - Count of products in inventory
   - Useful for stock management

### Charts

1. **Sales Overview (Line Chart)**
   - X-axis: Last 6 months
   - Y-axis: Revenue in dollars
   - Shows sales trends over time
   - Tooltip displays exact amounts

2. **Orders by Month (Bar Chart)**
   - X-axis: Last 6 months
   - Y-axis: Number of orders
   - Visual representation of order volume
   - Green bars for easy visibility

---

## How It Works

### Data Flow

1. **Dashboard Page** ([app/dashboard/page.tsx](app/dashboard/page.tsx))
   ```typescript
   const analyticsData = await getAnalyticsData();
   ```

2. **Analytics Action** ([app/actions/analytics.ts](app/actions/analytics.ts))
   - Connects to MongoDB
   - Fetches all orders
   - Calculates statistics
   - Groups data by month
   - Returns formatted data

3. **SalesChart Component** ([components/SalesChart.tsx](components/SalesChart.tsx))
   - Receives data as props
   - Renders KPI cards with real values
   - Displays charts using Recharts
   - Shows "No data available" if database is empty

---

## Testing the Analytics

### Step 1: Create Sample Orders
```bash
node seed-orders.js
```

This will:
- Clear existing orders
- Create 30-90 sample orders
- Distribute them across 6 months
- Assign random amounts ($20-$220)

### Step 2: View Dashboard
```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` to see:
- Real revenue totals
- Actual order counts
- Calculated averages
- Dynamic charts

### Step 3: Add Products (Optional)
The "Total Products" card shows the count of products in your database. Add products via:
- `/dashboard/add` page
- Or the "Add Product" button

---

## Database Schema

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: "ORD-1234567890",
  customerEmail: "customer@example.com",
  items: [
    {
      productId: ObjectId,
      productName: "Sample Product",
      quantity: 2,
      price: 49.99
    }
  ],
  totalAmount: 99.98,
  status: "delivered",
  createdAt: ISODate("2025-12-15T10:30:00Z"),
  updatedAt: ISODate("2025-12-15T10:30:00Z")
}
```

---

## Extending the Analytics

Want to add more features? Here are some ideas:

### 1. Order Management Page
```typescript
// app/dashboard/orders/page.tsx
const orders = await Order.find({}).sort({ createdAt: -1 });
```

### 2. Revenue by Product
```typescript
// Calculate which products generate most revenue
const topProducts = await Order.aggregate([
  { $unwind: "$items" },
  { $group: {
    _id: "$items.productName",
    revenue: { $sum: "$items.price" }
  }},
  { $sort: { revenue: -1 } }
]);
```

### 3. Customer Analytics
```typescript
// Track customer purchase patterns
const topCustomers = await Order.aggregate([
  { $group: {
    _id: "$customerEmail",
    totalSpent: { $sum: "$totalAmount" },
    orderCount: { $sum: 1 }
  }},
  { $sort: { totalSpent: -1 } }
]);
```

### 4. Real-time Updates
Add a refresh button or auto-refresh:
```typescript
"use client";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.refresh()}>
      Refresh Analytics
    </button>
  );
}
```

---

## Performance Notes

- **Caching**: MongoDB connection is cached globally
- **Server-Side**: All calculations happen server-side
- **Lean Queries**: Using `.lean()` for faster queries
- **Parallel Fetching**: Products and analytics fetched simultaneously

---

## Troubleshooting

### Charts show "No data available"
**Solution**: Run `node seed-orders.js` to populate sample orders

### Revenue is $0
**Solution**: Ensure orders have `totalAmount` values and `createdAt` dates

### Growth percentages are 0%
**Solution**: Need at least 2 months of order data for comparisons

### Build errors
**Solution**: Run `npm run build` to check for TypeScript errors

---

## Summary

Your dashboard now features **100% database-driven analytics**:
- ✅ Real revenue tracking
- ✅ Actual order counts
- ✅ Dynamic charts
- ✅ Growth calculations
- ✅ No hardcoded data

All analytics update automatically as you create new orders in your system!
