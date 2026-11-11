import "./globals.css";
import RegisterSW from "../components/RegisterSW";

export const metadata = {
  title: "Spendly – Expense Tracker",
  description: "Track daily expenses and get weekly and monthly reports.",
  appleWebApp: { capable: true, title: "Spendly", statusBarStyle: "default" },
  icons: { apple: "/icons/180" },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
