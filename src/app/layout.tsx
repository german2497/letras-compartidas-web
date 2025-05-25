import type { Metadata } from 'next'
import { inter, lora } from '@/styles/fonts'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Letras Compartidas',
  description: 'Un espacio para escribir, leer y compartir ideas en comunidad.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
