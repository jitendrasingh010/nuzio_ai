import './globals.css';

export const metadata = {
  title: 'Nuzio AI — Personalized News & Audio Brief',
  description: 'AI-curated news briefs tailored to your profession and interests with real-time text-to-speech audio playback.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF8F5] text-[#18191B] selection:bg-[#E86A33]/20 selection:text-[#E86A33]">
        {children}
      </body>
    </html>
  );
}
