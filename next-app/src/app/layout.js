
import { AuthProvider } from "@/context/AuthProvider";
import "./globals.css";


export const metadata = {
  title: "RealEstate - Find Your Dream Home",
  description: "Discover your dream home with RealEstate. Browse the latest listings, compare prices, and explore properties in your area. Your next home is just a click away!",
};


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
