import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Simple Todo List App with Next.js and FastAPI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
