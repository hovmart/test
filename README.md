# Hovmart - Premium Property Marketplace

A modern, full-featured property marketplace built with Next.js, Supabase, and TypeScript.

## Features

### 🏠 Property Management
- **Property Listings** - Browse properties by category (Buy, Rent, Shortlet)
- **Advanced Search** - Filter by location, price, amenities, and more
- **Property Comparison** - Compare multiple properties side by side
- **Interactive Maps** - View properties on interactive maps
- **Virtual Tours** - 360° property views and galleries

### 👤 User Management
- **Authentication** - Secure sign up/sign in with Supabase Auth
- **Profile Management** - Complete profile editing with image upload
- **Role-based Access** - User, Agent, and Admin roles
- **Account Verification** - Email verification system
- **Two-Factor Authentication** - Enhanced security options

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach
- **Dark/Light Mode** - Theme switching capability
- **Smooth Animations** - Framer Motion animations
- **Glassmorphism** - Modern design elements
- **Accessibility** - WCAG compliant components

### 🔧 Technical Features
- **Next.js 14** - App Router with Server Components
- **TypeScript** - Full type safety
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - High-quality components
- **Form Validation** - Zod schema validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/hovmart.git
   cd hovmart
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   # Run the database setup scripts
   npm run db:setup
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
hovmart/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── properties/        # Property pages
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin components
│   ├── properties/       # Property components
│   └── user/             # User management components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── scripts/              # Database scripts
└── types/                # TypeScript definitions
\`\`\`

## Key Features Implementation

### Profile Management
- **Image Upload** - Secure file upload to Supabase Storage
- **Form Validation** - Real-time validation with Zod schemas
- **Security Settings** - Password change, 2FA, account deletion
- **Notification Preferences** - Granular notification controls

### Authentication System
- **Supabase Auth** - Email/password authentication
- **Protected Routes** - Middleware-based route protection
- **Role Management** - User, Agent, Admin roles
- **Session Management** - Secure session handling

### Property System
- **CRUD Operations** - Full property management
- **Category Filtering** - Buy, Rent, Shortlet categories
- **Advanced Search** - Multiple filter options
- **Image Galleries** - Multiple property images
- **Booking System** - Property reservation system

## Environment Variables

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
POSTGRES_URL=your_postgres_connection_string
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional Integrations
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_ANALYTICS_ID=your_google_analytics_id
\`\`\`

## Database Schema

The application uses PostgreSQL with the following main tables:
- `profiles` - User profile information
- `properties` - Property listings
- `bookings` - Property reservations
- `reviews` - Property reviews
- `categories` - Property categories

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@hovmart.com or join our Discord community.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
