# E-Commerce Dashboard

A modern, full-stack e-commerce dashboard built with Next.js 15, MongoDB, and NextAuth.js.

### Live link  : https://ecommerce-admin-dashboard-spyc.vercel.app/

## Features

- **Authentication**: Secure admin login with NextAuth.js
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Image Upload**: Cloudinary integration for product images
- **Real-time Analytics**:
  - Revenue tracking from database
  - Order count and trends
  - Average order value calculation
  - Product inventory count
  - 6-month sales charts (line & bar)
  - Month-over-month growth percentages
- **Protected Routes**: Middleware-based route protection
- **Admin Onboarding**: Secret-key protected admin creation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Image Upload**: Cloudinary

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ecommerce-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your values:

- **MONGODB_URI**: Get from [MongoDB Atlas](https://cloud.mongodb.com)
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **NEXTAUTH_URL**: Keep as `http://localhost:3000` for development
- **ONBOARD_SECRET**: Set any secret key for admin onboarding
- **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME**: Get from [Cloudinary](https://cloudinary.com)
- **NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET**: Create an unsigned upload preset in Cloudinary

### 4. Create your first admin (Option 1: Using the seed script)

```bash
node seed-admin.js
```

This creates an admin with:
- Email: `admin@example.com`
- Password: `adminpassword123`

### 5. Create your first admin (Option 2: Using the onboarding page)

1. Start the dev server (see step 6)
2. Visit `http://localhost:3000/onboard`
3. Enter your email, password, and the secret key from `.env.local`

### 6. (Optional) Seed sample orders for analytics

To see the charts and analytics with real data:

```bash
node seed-orders.js
```

This will create sample orders distributed across the last 6 months, so you can see the revenue and sales charts in action.

### 7. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ecommerce-dashboard/
├── app/
│   ├── actions/          # Server actions
│   ├── api/              # API routes (NextAuth, onboarding)
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   ├── onboard/          # Admin onboarding
│   └── page.tsx          # Home page
├── components/           # React components
├── lib/                  # Utilities (DB connection, validations)
├── models/               # Mongoose models
├── middleware.ts         # Route protection
└── seed-admin.js         # Admin seed script
```

## Key Routes

- `/` - Home page
- `/login` - Admin login
- `/onboard` - Create new admin (requires secret key)
- `/dashboard` - Product dashboard with analytics
- `/dashboard/add` - Add new product
- `/dashboard/edit/[id]` - Edit product

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

**Important**: Update `NEXTAUTH_URL` to your production URL in Vercel environment variables.

## Default Credentials

If you used the seed script:
- **Email**: admin@example.com
- **Password**: adminpassword123

## License

MIT
