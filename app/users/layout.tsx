import NavbarComponent from "@/components/NavbarComponent";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen">
      <NavbarComponent />
      {children}
    </div>
  );
}
