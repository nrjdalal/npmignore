import localFont from 'next/font/local'

export const fontMono = localFont({
  src: [
    {
      path: './JetBrainsMono-Variable.ttf',
      style: 'normal',
      weight: '100 800',
    },
    {
      path: './JetBrainsMono-Italic.ttf',
      style: 'italic',
      weight: '100 800',
    },
  ],
  variable: '--font-mono',
})

export const fontSans = localFont({
  src: [
    {
      path: './DMSans-Variable.ttf',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './DMSans-Italic.ttf',
      style: 'italic',
      weight: '100 900',
    },
  ],
  variable: '--font-sans',
})
