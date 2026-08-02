"use client";
import Link from 'next/link';

const TINTA = '#1C1A24';
const PAPEL = '#FBF9F5';
const LINO = '#EDE7DC';
const SELLO = '#A8324A';
const ORO = '#B08D3F';

/**
 * Marco compartido de las páginas legales.
 * Mantiene la misma identidad del home para que no parezcan de otro sitio.
 */
export default function PaginaLegal({ titulo, actualizado, intro, secciones }) {
  return (
    <div style={{ backgroundColor: PAPEL, color: TINTA }} className="min-h-screen font-ui antialiased">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-ui { font-family: 'Jost', system-ui, sans-serif; }
        .etiqueta { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; }
        .regla-oro { height: 1px; background: linear-gradient(90deg, transparent, ${ORO}, transparent); }
        a:focus-visible, button:focus-visible { outline: 2px solid ${SELLO}; outline-offset: 3px; border-radius: 4px; }
      `}} />

      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(251,249,245,.88)', borderColor: LINO }}>
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl tracking-wide">
            clicky<span style={{ color: SELLO }}>papel</span>
          </Link>
          <Link href="/" className="etiqueta hover:opacity-60 transition-opacity" style={{ color: '#6B6577' }}>
            ← Volver
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <header className="space-y-4 mb-12">
          <span className="etiqueta" style={{ color: SELLO }}>Legal</span>
          <h1 className="font-display text-4xl md:text-5xl font-light leading-tight">{titulo}</h1>
          <p className="text-xs font-light" style={{ color: '#8A8397' }}>
            Última actualización: {actualizado}
          </p>
          <div className="regla-oro w-24" />
          <p className="text-sm font-light leading-relaxed" style={{ color: '#5F5A6B' }}>{intro}</p>
        </header>

        <div className="space-y-12">
          {secciones.map((s, i) => (
            <section key={s.titulo} className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-2xl font-light shrink-0" style={{ color: 'rgba(28,26,36,.22)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-light">{s.titulo}</h2>
              </div>

              <div className="space-y-4 pl-0 sm:pl-10">
                {s.parrafos?.map((p, j) => (
                  <p key={j} className="text-sm font-light leading-relaxed" style={{ color: '#4A4557' }}>{p}</p>
                ))}

                {s.lista && (
                  <ul className="space-y-2.5">
                    {s.lista.map((item, j) => (
                      <li key={j} className="flex gap-3 text-sm font-light leading-relaxed" style={{ color: '#4A4557' }}>
                        <span style={{ color: ORO }}>·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer style={{ backgroundColor: TINTA, color: '#8A8397' }} className="py-12">
        <div className="max-w-3xl mx-auto px-5 flex flex-col sm:flex-row justify-between gap-6">
          <span className="font-display text-xl" style={{ color: PAPEL }}>
            clicky<span style={{ color: ORO }}>papel</span>
          </span>
          <div className="flex flex-wrap gap-6 etiqueta">
            <Link href="/privacidad" className="hover:opacity-70 transition-opacity">Privacidad</Link>
            <Link href="/terminos" className="hover:opacity-70 transition-opacity">Términos</Link>
            <Link href="/crear" className="hover:opacity-70 transition-opacity">Crear invitación</Link>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-5 mt-8 pt-5 border-t text-[11px] font-light" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          © {new Date().getFullYear()} ClickyPapel · Hecho en México
        </div>
      </footer>
    </div>
  );
}
