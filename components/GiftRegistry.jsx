"use client";

export default function GiftRegistry({ weddingData, diseño }) {
  const mesa = weddingData?.mesaRegalos;
  const tieneBanco = mesa?.bankDetails?.banco || mesa?.bankDetails?.clabe;
  const tieneTiendas = mesa?.registries && mesa.registries.length > 0;

  if (!tieneBanco && !tieneTiendas) return null;

  const cardStyle = diseño.id === 'minimal-dark'
    ? 'bg-zinc-900/30 border-zinc-800 text-zinc-300'
    : diseño.id === 'boho-rancho'
    ? 'bg-[#faf7f2] border-amber-900/10 text-amber-950'
    : 'bg-white border-stone-200 text-stone-700';

  return (
    <section className="w-full pt-20 pb-16 px-4 block">
      <div className="max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-amber-700'}`}>
            Mesas de Regalos
          </span>
          <h2 className={`text-3xl ${diseño.fuenteTitulo}`}>Detalles para Obsequios</h2>
          <p className="text-xs max-w-xs mx-auto opacity-70 font-light leading-relaxed">
            Su presencia es nuestro mayor regalo, pero si desean tener un detalle con nosotros, aquí tienen las opciones:
          </p>
        </div>

        <div className="space-y-6">
          {tieneBanco && (
            <div className={`p-8 rounded-3xl border shadow-xs text-center space-y-3 transition-colors duration-500 ${cardStyle}`}>
              <span className="text-xl">✉️</span>
              <h3 className={`text-lg ${diseño.fuenteTitulo}`}>Lluvia de Sobres / Transferencia</h3>
              <div className="text-xs space-y-1.5 font-light font-mono bg-stone-500/5 p-4 rounded-xl inline-block w-full max-w-sm">
                {mesa.bankDetails.banco && <p><span className="opacity-60">Banco:</span> {mesa.bankDetails.banco}</p>}
                {mesa.bankDetails.titular && <p><span className="opacity-60">Titular:</span> {mesa.bankDetails.titular}</p>}
                {mesa.bankDetails.clabe && <p className="tracking-wider text-sm font-semibold mt-1"><span className="opacity-60 font-sans text-xs font-normal">CLABE:</span> {mesa.bankDetails.clabe}</p>}
              </div>
            </div>
          )}

          {tieneTiendas && (
            <div className={`p-8 rounded-3xl border shadow-xs text-center space-y-4 transition-colors duration-500 ${cardStyle}`}>
              <span className="text-xl">🛍️</span>
              <h3 className={`text-lg ${diseño.fuenteTitulo}`}>Mesas Virtuales</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                {mesa.registries.map((reg, index) => (
                  <a
                    key={index}
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${diseño.botonAcento}`}
                  >
                    <span>{reg.logo}</span> Ver Mesa en {reg.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}