import { Cairo as FontCairo } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const fontCairo = FontCairo({
  weight: ["300", "400", "700", "900"],
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"ar"} dir={"rtl"}>
      <body
        className={cn(
          "min-h-screen bg-primary/5 antialiased",
          `font-cairo ${fontCairo.variable}`,
        )}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
