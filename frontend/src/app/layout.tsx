// import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'


// const inter = Inter({ 
//   subsets: ['latin'], 
//   variable: '--font-inter' 
// })

// const spaceGrotesk = Space_Grotesk({ 
//   subsets: ['latin'], 
//   weight: ['400', '500', '600', '700'],
//   variable: '--font-spacegrotesk'
// })

export const metadata = {
  title: 'ContactHub - School Dashboard',
  description: 'Modern contact & user management dashboard'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans antialiased">
      <body className="font-inter bg-slate-950 text-white antialiased overflow-x-hidden">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
