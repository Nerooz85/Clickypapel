// components/RsvpModule.jsx
import { useState } from 'react';

export default function RsvpModule({ weddingId }) {
  const [searchName, setSearchName] = useState('');
  const [guestGroup, setGuestGroup] = useState(null);
  const [confirmedSeats, setConfirmedSeats] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, loading, found, not_found, success

  // Simulación de búsqueda en Supabase / Firebase
  const handleSearchGuest = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) return;
    setStatus('loading');

    // Aquí conectarías con tu base de datos. Simulamos una respuesta:
    setTimeout(() => {
      // Mock de datos que vendrían de la tabla 'Invitados'
      const mockDbGuest = {
        id: 'inv_123',
        nombreFamilia: 'Familia Martínez Pérez',
        pasesTotales: 4,
        confirmados: 0
      };

      if (searchName.toLowerCase().includes('martinez') || searchName.toLowerCase().includes('perez')) {
        setGuestGroup(mockDbGuest);
        setConfirmedSeats(mockDbGuest.pasesTotales); // Por defecto sugerimos que asisten todos
        setStatus('found');
      } else {
        setStatus('not_found');
      }
    }, 1000);
  };

  // Simulación de guardar la confirmación
  const handleConfirmAttendance = async (isAttending) => {
    setStatus('loading');
    
    // Aquí harías el UPDATE en tu base de datos
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <section className="py-20 px-4 bg-stone-50 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
        <h2 className="text-3xl font-serif text-stone-800 mb-2">Confirmar Asistencia</h2>
        <p className="text-stone-500 text-sm mb-6 font-light">
          Por favor, ayúdanos a confirmar tu presencia antes de la fecha límite.
        </p>

        {/* PASO 1: BÚSQUEDA POR NOMBRE */}
        {(status === 'idle' || status === 'loading' || status === 'not_found') && (
          <form onSubmit={handleSearchGuest} className="space-y-4">
            <input
              type="text"
              placeholder="Ingresa tu nombre completo o apellido"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:border-stone-500 text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-stone-800 hover:bg-stone-900 text-white font-medium py-3 rounded-lg text-sm transition-colors"
            >
              {status === 'loading' ? 'Buscando...' : 'Buscar mi pase'}
            </button>
            {status === 'not_found' && (
              <p className="text-red-500 text-xs mt-2">
                No encontramos tu nombre. Por favor intenta con tu apellido o contacta a los novios.
              </p>
            )}
          </form>
        )}

        {/* PASO 2: SELECCIÓN DE PASES (FILTRO ANTI-COLADOS) */}
        {status === 'found' && guestGroup && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Invitación para:</span>
              <span className="text-lg font-serif text-stone-700 font-medium">{guestGroup.nombreFamilia}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-600 block">
                ¿Cuántos pases deseas confirmar? (Máximo {guestGroup.pasesTotales})
              </label>
              <select
                value={confirmedSeats}
                onChange={(e) => setConfirmedSeats(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-700 bg-white text-sm focus:outline-none focus:border-stone-500"
              >
                {[...Array(guestGroup.pasesTotales + 1).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num === 0 ? '0 pases (No podré asistir)' : `${num} ${num === 1 ? 'pase' : 'pases'}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => handleConfirmAttendance(false)}
                className="border border-stone-300 text-stone-600 font-medium py-3 rounded-lg text-sm hover:bg-stone-50 transition-colors"
              >
                No podré ir
              </button>
              <button
                onClick={() => handleConfirmAttendance(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3 rounded-lg text-sm transition-colors shadow-sm"
              >
                Confirmar pases
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: ÉXITO */}
        {status === 'success' && (
          <div className="space-y-4 py-6 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <h3 className="text-xl font-serif text-stone-800">¡Confirmación recibida!</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto">
              Tus pases han sido registrados. Los detalles actualizados se enviaron al panel de los novios. ¡Nos vemos en el gran día!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}