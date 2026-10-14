import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/lib/cart-context";

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </CartProvider>
  );
}
