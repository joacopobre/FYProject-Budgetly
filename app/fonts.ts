import localFont from "next/font/local";

export const switzer = localFont({
  src: [
    {
      path: "../public/fonts/Switzer_Complete/Fonts/WEB/fonts/Switzer-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Switzer_Complete/Fonts/WEB/fonts/Switzer-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Switzer_Complete/Fonts/WEB/fonts/Switzer-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],

  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial"],
});