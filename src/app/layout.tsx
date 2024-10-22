import '@/styles/globals.css'

export const metadata = {
  title: 'Debatable',
  description: "Because everything is 'Debatable'—A social media platform designed for debaters and thinkers alike. ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  )
}
