import type { Metadata } from 'next'
import '../index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://imagology.fictiontribe.com'),
  title: 'Imagology | Film Photography Prompt Builder',
  description:
    'Explore prompting for photography. Built as an example of custom, brand-controlled image generation.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Imagology',
    description:
      'Explore prompting for photography. Built as an example of custom, brand-controlled image generation.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Analytics (Google Analytics, Snitcher, LinkedIn Insight) load only after cookie consent — see src/lib/consent.ts */}
      </head>
      <body>{children}</body>
    </html>
  )
}
