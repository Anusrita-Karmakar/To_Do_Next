import "@/styles/globals.css";
export const metadata = {
  title: 'to-do-app',
  description: 'Generated by Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
