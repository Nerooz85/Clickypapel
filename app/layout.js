import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Asegúrate de tener Tailwind importado aquí

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata = {
  title: 'Tu Gran Día - Invitaciones Digitales',
  description: 'Las invitaciones más elegantes para tu boda.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}