import { Cairo as FontCairo } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
          "min-h-screen antialiased",
          `font-cairo ${fontCairo.variable}`
        )}
      >
        <main>{children}</main>
      </body>
    </html>
  );
}
