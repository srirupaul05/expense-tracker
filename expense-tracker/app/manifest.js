export default function manifest() {
  return {
    name: "Spendly – Expense Tracker",
    short_name: "Spendly",
    description:
      "Track daily expenses and income, and get weekly and monthly reports.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf6ec",
    theme_color: "#fdf6ec",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
