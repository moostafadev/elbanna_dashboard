import { Cairo as FontCairo } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const fontCairo = FontCairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"ar"} dir={"rtl"} className={fontCairo.variable}>
      <body
        className={cn(
          fontCairo.className,
          "min-h-screen bg-primary/5 antialiased",
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
