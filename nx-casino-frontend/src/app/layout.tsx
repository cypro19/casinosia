import "@/styles/globals.css";
import { Montserrat } from "next/font/google";

const primaryFont = Montserrat({
  variable: "--primary-font",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className={primaryFont.className}>
        <div>{children}</div>
      </body>
    </html>
  );
}
