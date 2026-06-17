"use client";

export default function GiftRegistry({ weddingData, diseño }) {
  if (!weddingData) return null;

  // 1. Extraemos los datos directamente (como los mandamos desde page.js)
  const { banco, titular, clabe, amazonUrl, liverpoolUrl } = weddingData;

  // 2. Verificamos qué secciones existen realmente
  const tieneBanco = Boolean(banco || clabe);
  
  // Evitamos que muestre los botones si los links tienen el '#' de la demo o están vacíos
  const urlAmazonValida = amazonUrl && amazonUrl !== '#' && amazonUrl !== '';
  const urlLiverpoolValida = liverpoolUrl && liverpoolUrl !== '#' && liverpoolUrl !== '';
  const tieneTiendas = urlAmazonValida || urlLiverpoolValida;

  // 3. Si no hay ni banco ni tiendas, ocultamos la sección completa
  if (!tieneBanco && !tieneTiendas) return null;

  // 4. Adaptamos los estilos usando el objeto 'diseño' dinámico
  const cardStyle = diseño?.colorCard || 'bg-white border-stone-200 shadow-md text-stone-700';
  const textAcento = diseño?.textAcento || 'text-[#9a7b5c]';
  const btnStyle = diseño?.btn || 'bg-stone-900 hover:bg-stone-800 text-white';

  return (
    <section className="w-full pt-20 pb-16 px-4 block">
      <div className="max-w-2xl mx-auto space-y-12">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-2">
          <span className={`text-[10px] uppercase tracking-widest font-semibold ${textAcento}`}>
            Mesas de Regalos
          </span>
          <h2 className="text-3xl font-serif">Detalles para Obsequios</h2>
          <p className="text-xs max-w-xs mx-auto opacity-70 font-light leading-relaxed pt-2">
            Su presencia es nuestro mayor regalo, pero si desean tener un detalle con nosotros, aquí tienen las opciones:
          </p>
        </div>

        <div className="space-y-6">
          
          {/* TARJETA DE BANCO / TRANSFERENCIA */}
          {tieneBanco && (
            <div className={`p-8 rounded-3xl border text-center space-y-3 transition-colors duration-500 ${cardStyle}`}>
              <span className="text-xl">✉️</span>
              <h3 className="text-lg font-serif">Lluvia de Sobres / Transferencia</h3>
              <div className="text-xs space-y-1.5 font-light font-mono bg-black/5 p-4 rounded-xl inline-block w-full max-w-sm">
                {banco && <p><span className="opacity-60">Banco:</span> {banco}</p>}
                {titular && <p><span className="opacity-60">Titular:</span> {titular}</p>}
                {clabe && (
                  <p className="tracking-wider text-sm font-semibold mt-1">
                    <span className="opacity-60 font-sans text-xs font-normal">CLABE:</span> {clabe}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TARJETA DE TIENDAS VIRTUALES */}
          {tieneTiendas && (
            <div className={`p-8 rounded-3xl border text-center space-y-4 transition-colors duration-500 ${cardStyle}`}>
              <span className="text-xl">🛍️</span>
              <h3 className="text-lg font-serif">Mesas Virtuales</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                
                {urlAmazonValida && (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${btnStyle}`}
                  >
                    <span>📦</span> Ver en Amazon
                  </a>
                )}

                {urlLiverpoolValida && (
                  <a
                    href={liverpoolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${btnStyle}`}
                  >
                    <span>🛍️</span> Ver en Liverpool
                  </a>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}