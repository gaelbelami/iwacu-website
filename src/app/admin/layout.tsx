import { Space_Grotesk, Manrope } from "next/font/google";
import "../[locale]/globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="font-[family-name:var(--font-manrope)] bg-[#F7F2E4] text-[#1A211A] min-h-screen">
        {children}
      </body>
    </html>
  );
}
