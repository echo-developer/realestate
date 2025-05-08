
import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";


export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/get-meta-data/home_page`, {
      cache: 'no-store'
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

  return {
    title: "RealEstate - Find Your Dream Home",
    description:
      "Discover your dream home with RealEstate. Browse the latest listings, compare prices, and explore properties in your area. Your next home is just a click away!",
  };
}


export default async function RootLayout({ children }) {
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


