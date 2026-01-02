# Energy Digital - AI-Powered Energy Management System

> A modern, real-time energy monitoring and intelligence platform built with Next.js 16, React 19, and Google Generative AI. Provides intelligent insights for building energy optimization using Firebase real-time database and advanced visualization.

## 🌟 Features

- **Real-Time Energy Monitoring**: Live tracking of energy consumption across multiple buildings
- **AI-Powered Insights**: Google Generative AI integration for intelligent energy-saving recommendations
- **Digital Twin Visualization**: Interactive 3D building visualization with Three.js and React Three Fiber
- **Firebase Authentication**: Secure Google sign-in integration
- **Real-Time Database**: Firebase Realtime Database for instant data synchronization
- **Advanced Analytics**: Dashboard with historical data analysis and trend visualization
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Radix UI components
- **Dark Theme**: Modern dark mode optimized for energy management interfaces

## 📋 Tech Stack

- **Frontend Framework**: Next.js 16.1.1 with TypeScript
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4 + PostCSS
- **UI Components**: Radix UI, Lucide React Icons
- **3D Visualization**: Three.js, React Three Fiber, Drei
- **AI Integration**: Google Generative AI (Gemini API)
- **Backend**: Firebase (Authentication, Realtime Database)
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Notifications**: Sonner
- **Utilities**: Clsx, Tailwind Merge

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Realtime Database enabled
- Google Generative AI API key
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/energy-digital.git
cd energy-digital
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and Google API credentials.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📦 Project Structure

```
energy-digital/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page with auth
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── features/        # Feature components (Dashboard, Views)
│   │   ├── layout/          # Layout components (Sidebar)
│   │   ├── ui/              # UI components (Core, Visuals, LightRays)
│   │   └── shared/          # Shared components (AuthProvider)
│   └── lib/
│       ├── service.ts       # Firebase & Gemini API integration
│       └── Utils.ts         # Utility functions
├── public/                  # Static assets
├── functions/               # Firebase Cloud Functions
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

See `.env` for required Firebase and Google API configuration.

## 📊 Features Details

### Dashboard
- Real-time energy consumption metrics
- Quick statistics with historical trends
- Interactive charts and visualizations
- Building-specific analytics

### AI Insights
- Automatic energy-saving recommendations
- Anomaly detection
- Fallback insights when API quota is exhausted
- Technical energy optimization tips

### Infrastructure View
- Digital twin 3D visualization
- Equipment status monitoring
- System health indicators

## 🔗 Firebase Integration

The application uses Firebase for:
- **Authentication**: Google OAuth sign-in
- **Realtime Database**: Store and sync energy data
- **Cloud Functions**: Automated energy data simulation and cleanup (every minute)

## 📱 Responsive Design

Fully responsive design supporting:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)



## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue on GitHub.
