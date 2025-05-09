// app/layout.js or app/layout.jsx (depending on your setup)

import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";

// Optimized generateMetadata function with revalidation
export async function generateMetadata() {
  try {
    const res = await fetch(`https://realestate.scriptlisting.com/hackground/api/get-meta-data/home_page`, {
      next: { revalidate: 3600 }, // cache result and revalidate every 1 hour
    });

    if (!res.ok) throw new Error('Failed to fetch metadata');

    const data = await res.json();
    if (data?.status === 1) {
      return {
        title: data.data?.meta_title,
        description: data.data?.meta_description,
      };
    }
  } catch (error) {
    console.error('Metadata fetch error:', error);
  }

  // Fallback metadata
  return {
    title: "RealEstate - Find Your Dream Home",
    description:
      "Discover your dream home with RealEstate. Browse the latest listings, compare prices, and explore properties in your area. Your next home is just a click away!",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
