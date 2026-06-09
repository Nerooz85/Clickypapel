// components/GiftRegistry.jsx
import { useState } from 'react';

export default function GiftRegistry({ weddingData }) {
  const [copied, setCopied] = useState(false);
  
  const { bankDetails, registries } = weddingData.mesaRegalos || {
    // Datos demo que vendrán de la base de datos
    bankDetails: {
      banco: "BBVA",
      titular: "Abiel & Debanhi",
      clabe: "0123 4567 8901 2345 67"
    },
    registries: [
      { name: "Amazon", url: "https://amazon.com", logo: "📦" },
      { name: "Liverpool", url: "https://liverpool.com.mx", logo: "🛍️" }
    ]
  };

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(bankDetails.clabe);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 px-4 bg-white text-center">
      <div className="max-w-md mx-auto">
        <span className="font-serif text-amber-600/80 tracking-widest text-xs uppercase block mb-2">
          Mesas de Regalos
        </span>
        <h2 className="text-3xl font-serif text-stone-800 mb-6">Detalles de Obsequios</h2>
        <p className="text-stone-500 text-sm font-light mb-10 leading-relaxed">
          Tu presencia es nuestro mejor regalo, pero si deseas tener un detalle con nosotros, te dejamos algunas opciones.
        </p>

        {/* Opción 1: Tiendas físicas/online */}
        {registries && registries.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            {registries.map((reg, index) => (
              <a
                key={index}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all"
              >
                <span className="text-2xl mb-2">{reg.logo}</span>
                <span className="font-medium text-stone-700 text-sm">Mesa de {reg.name}</span>
              </a>
            ))}
          </div>
        )}

        {/* Opción 2: Innovación en efectivo (Lluvia de sobres digital) */}
        {bankDetails && (
          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">✉️</span>
              <div>
                <h4 className="font-serif text-stone-800 text-base font-medium">Apoyo en Efectivo</h4>
                <p className="text-stone-400 text-xs">Para nuestra luna de miel o futuro hogar</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/60 space-y-2 relative">
              <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">Datos para transferencia:</p>
              <p className="text-sm text-stone-700"><strong className="font-medium text-stone-500">Banco:</strong> {bankDetails.banco}</p>
              <p className="text-sm text-stone-700"><strong className="font-medium text-stone-500">Titular:</strong> {bankDetails.titular}</p>
              <div className="flex justify-between items-center pt-2 border-t border-stone-100 mt-2">
                <div>
                  <p className="text-[10px] text-stone-400 font-medium uppercase">CLABE Interbancaria</p>
                  <p className="text-sm font-mono text-stone-800 tracking-wider">{bankDetails.clabe}</p>
                </div>
                <button
                  onClick={handleCopyClabe}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'bg-stone-800 border-stone-800 text-white hover:bg-stone-900'
                  }`}
                >
                  {copied ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}